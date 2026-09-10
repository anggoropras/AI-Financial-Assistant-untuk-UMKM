import { Transaction, UserProfile } from '../../types';
import { calculateTotals, calculateCategoryBreakdown } from '../../utils/calculations';
import { formatRupiah } from '../../utils/currency';

export interface AiResponse {
  answer: string;
  source: 'gemini' | 'rules_fallback';
  model?: string;
}

/**
 * AI Financial Assistant Service
 * Mematuhi Mandat PHASE 7:
 * 1. Gemini TIDAK boleh mengarang angka.
 * 2. Gemini hanya boleh menggunakan data yang diberikan aplikasi (Firestore / deterministic calculations).
 * 3. Jika data tidak tersedia, katakan bahwa data belum cukup.
 * 4. Jangan memberikan jawaban seolah-olah memiliki data yang tidak tersedia.
 * 5. Jangan mengubah transaksi Firestore melalui chat.
 * 6. Jangan menghapus transaksi melalui AI.
 * 7. Jangan membuat keputusan finansial berisiko tanpa disclaimer yang sesuai.
 * 8. Gunakan Bahasa Indonesia sederhana.
 * 9. Hindari jargon akuntansi.
 * 10. Jawaban harus actionable dengan struktur: Jawaban singkat -> Data yang mendukung -> Insight -> Saran tindakan.
 */
export const aiService = {
  async askFinancialAssistant(
    prompt: string,
    transactions: Transaction[],
    user?: UserProfile | null,
    periodLabel: string = 'Semua Waktu'
  ): Promise<AiResponse> {
    const trimmedPrompt = prompt.trim();
    if (!trimmedPrompt) {
      return {
        answer: 'Silakan ketik pertanyaan seputar keuangan usaha Anda.',
        source: 'rules_fallback'
      };
    }

    // Jika tidak ada transaksi sama sekali
    if (!transactions || transactions.length === 0) {
      return {
        answer: `**Jawaban Singkat:**
Data catatan transaksi Anda saat ini masih kosong (0 transaksi).

**Data yang Mendukung:**
Belum ada transaksi pemasukan maupun pengeluaran yang tercatat di akun usaha **${user?.businessName || 'Anda'}**.

**Insight:**
AFIN.AI membutuhkan data transaksi aktual untuk melakukan kalkulasi dan analisa kondisi keuangan secara akurat tanpa mengarang angka.

**Saran Tindakan:**
Mulai catat transaksi pertama Anda dengan mengklik tombol **"+ Tambah Transaksi"** di pojok kanan atas atau masuk ke menu **Transaksi**.`,
        source: 'rules_fallback'
      };
    }

    // Hitung kalkulasi deterministik
    const totals = calculateTotals(transactions);
    const expenseCategories = calculateCategoryBreakdown(transactions, 'expense');
    const incomeCategories = calculateCategoryBreakdown(transactions, 'income');
    const incomeList = transactions.filter((t) => t.type === 'income');
    const expenseList = transactions.filter((t) => t.type === 'expense');

    // 5 transaksi terbesar berdasarkan nominal
    const largestTransactions = [...transactions]
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5)
      .map((t) => ({
        date: t.date,
        type: t.type,
        category: t.category,
        amount: t.amount,
        description: t.description
      }));

    // 10 transaksi paling baru
    const recentTransactions = [...transactions]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 10)
      .map((t) => ({
        date: t.date,
        type: t.type,
        category: t.category,
        amount: t.amount,
        description: t.description
      }));

    const payload = {
      prompt: trimmedPrompt,
      context: {
        periodLabel,
        totalIncome: totals.totalIncome,
        totalExpense: totals.totalExpense,
        balance: totals.balance,
        netCashFlow: totals.netCashFlow,
        transactionCount: totals.transactionCount,
        incomeCount: incomeList.length,
        expenseCount: expenseList.length,
        averageTransaction: totals.averageTransaction,
        expenseByCategory: expenseCategories,
        incomeByCategory: incomeCategories,
        recentTransactions,
        largestTransactions,
        businessName: user?.businessName || 'Usaha UMKM Anda',
        userName: user?.name || 'Bapak/Ibu'
      }
    };

    // Panggil Server-Side Endpoint yang mengintegrasikan Gemini
    try {
      const response = await fetch('/api/gemini/assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const data = await response.json();
        if (data && data.answer) {
          return {
            answer: data.answer,
            source: 'gemini',
            model: 'gemini-3.8-flash'
          };
        }
      }
    } catch (fetchError) {
      console.warn('Gagal menghubungi Gemini endpoint, menggunakan deterministic engine fallback:', fetchError);
    }

    // Grounded deterministic fallback jika API Gemini sedang tidak tersedia
    return {
      answer: this.generateDeterministicAnswer(trimmedPrompt, totals, expenseCategories, incomeCategories, transactions, user),
      source: 'rules_fallback'
    };
  },

  /**
   * Deterministic fallback generator yang mengikuti standar 4 bagian ketat:
   * 1. Jawaban Singkat
   * 2. Data yang Mendukung
   * 3. Insight
   * 4. Saran Tindakan
   */
  generateDeterministicAnswer(
    prompt: string,
    totals: ReturnType<typeof calculateTotals>,
    expenseCategories: ReturnType<typeof calculateCategoryBreakdown>,
    incomeCategories: ReturnType<typeof calculateCategoryBreakdown>,
    transactions: Transaction[],
    user?: UserProfile | null
  ): string {
    const lower = prompt.toLowerCase();
    const topExpense = expenseCategories[0];
    const topIncome = incomeCategories[0];
    const incomeCount = transactions.filter((t) => t.type === 'income').length;
    const expenseCount = transactions.filter((t) => t.type === 'expense').length;

    // Filter di luar konteks finansial
    const nonFinancialKeywords = ['resep', 'cuaca', 'presiden', 'politik', 'lagu', 'puisi', 'film', 'game', 'bercanda', 'cerita'];
    if (nonFinancialKeywords.some((k) => lower.includes(k))) {
      return `**Jawaban Singkat:**
Pertanyaan Anda berada di luar konteks pengelolaan keuangan usaha.

**Data yang Mendukung:**
Sebagai asisten finansial **AFIN.AI**, saya dirancang khusus untuk menganalisa data transaksi, arus kas, dan pengeluaran usaha Anda.

**Insight:**
Fokus utama kita adalah menjaga kesehatan dan kelangsungan keuangan usaha **${user?.businessName || 'Anda'}**.

**Saran Tindakan:**
Silakan tanyakan hal seputar keuangan, seperti:
• "Berapa total pengeluaran saya?"
• "Pengeluaran terbesar saya ada di mana?"
• "Bagaimana kondisi arus kas usaha saya?"`;
    }

    // 1. Pertanyaan Pemasukan / Omzet
    if (lower.includes('pemasukan') || lower.includes('omzet') || lower.includes('omset') || lower.includes('penjualan')) {
      return `**Jawaban Singkat:**
Total pemasukan usaha Anda yang tercatat adalah **${formatRupiah(totals.totalIncome)}**.

**Data yang Mendukung:**
• Terdiri dari **${incomeCount} transaksi** uang masuk.
${topIncome ? `• Kategori pemasukan utama adalah **${topIncome.category}** senilai **${formatRupiah(topIncome.amount)}** (${topIncome.percentage.toFixed(1)}% dari seluruh pemasukan).` : '• Belum ada rincian kategori pemasukan.'}

**Insight:**
Pemasukan ini adalah penopang perputaran kas usaha Anda. ${totals.netCashFlow >= 0 ? 'Pemasukan berhasil menutup seluruh pengeluaran tercatat.' : 'Namun total pemasukan saat ini masih berada di bawah total pengeluaran Anda.'}

**Saran Tindakan:**
1. Catat seluruh penjualan harian secara konsisten setiap tutup toko agar tren pendapatan akurat.
2. Evaluasi kategori **${topIncome?.category || 'utama'}** untuk melihat peluang repeat order dari pelanggan.`;
    }

    // 2. Pertanyaan Pengeluaran / Biaya
    if (lower.includes('pengeluaran') || lower.includes('biaya') || lower.includes('belanja')) {
      return `**Jawaban Singkat:**
Total pengeluaran usaha Anda yang tercatat mencapai **${formatRupiah(totals.totalExpense)}**.

**Data yang Mendukung:**
• Terdiri dari **${expenseCount} transaksi** pengeluaran.
${topExpense ? `• Pos biaya nomor 1 adalah **${topExpense.category}** sebesar **${formatRupiah(topExpense.amount)}** (${topExpense.percentage.toFixed(1)}% dari total pengeluaran).` : ''}

**Insight:**
${topExpense ? `Kategori **${topExpense.category}** menyerap porsi anggaran terbesar dalam operasional usaha Anda.` : 'Pengeluaran tersebar di berbagai pos.'}

**Saran Tindakan:**
1. Periksa kembali efisiensi pembelian pada kategori **${topExpense?.category || 'terbesar'}**.
2. Tinjau nota belanja berkala untuk menghindari kebocoran biaya kecil yang berulang.`;
    }

    // 3. Pertanyaan Kategori Terbesar / Boros
    if (lower.includes('terbesar') || lower.includes('paling besar') || lower.includes('boros') || lower.includes('kategori')) {
      if (!topExpense) {
        return `**Jawaban Singkat:**
Belum ada transaksi pengeluaran yang tercatat di akun Anda.

**Data yang Mendukung:**
Total pengeluaran saat ini adalah **Rp0**.

**Insight:**
Sistem belum dapat memetakan pos pengeluaran terbesar tanpa adanya catatan transaksi biaya.

**Saran Tindakan:**
Catat pengeluaran bahan baku, operasional, atau biaya lainnya di menu Transaksi.`;
      }

      return `**Jawaban Singkat:**
Pengeluaran terbesar usaha Anda berasal dari kategori **${topExpense.category}** sebesar **${formatRupiah(topExpense.amount)}**.

**Data yang Mendukung:**
• Kategori **${topExpense.category}** menyumbang sekitar **${topExpense.percentage.toFixed(1)}%** dari total pengeluaran usaha (${formatRupiah(totals.totalExpense)}).
${expenseCategories.length > 1 ? `• Urutan kedua ditempati oleh **${expenseCategories[1].category}** sebesar **${formatRupiah(expenseCategories[1].amount)}** (${expenseCategories[1].percentage.toFixed(1)}%).` : ''}

**Insight:**
Artinya, ${topExpense.category} menjadi komponen biaya yang paling perlu diperhatikan karena menyerap lebih dari separuh anggaran usaha.

**Saran Tindakan:**
1. Cek harga dan volume pembelian dari supplier untuk pos ${topExpense.category}.
2. Cari alternatif pemasok atau negosiasi potongan harga untuk pembelian berkala.
3. Hindari stok berlebih yang berpotensi rusak atau menumpuk.`;
    }

    // 4. Kondisi Keuangan / Arus Kas / Saldo Sehat
    const isPositive = totals.netCashFlow >= 0;
    return `**Jawaban Singkat:**
Kondisi keuangan usaha Anda saat ini berada dalam status **${isPositive ? 'SEHAT (Surplus)' : 'PERLU PERHATIAN (Defisit)'}**.

**Data yang Mendukung:**
• Total Pemasukan: **${formatRupiah(totals.totalIncome)}** (${incomeCount} transaksi)
• Total Pengeluaran: **${formatRupiah(totals.totalExpense)}** (${expenseCount} transaksi)
• Arus Kas Bersih: **${formatRupiah(totals.netCashFlow)}**
• Saldo Terkini: **${formatRupiah(totals.balance)}**

**Insight:**
${isPositive
  ? `Arus kas Anda bernilai positif **${formatRupiah(totals.netCashFlow)}**, artinya uang yang masuk lebih besar daripada biaya yang dikeluarkan.`
  : `Arus kas Anda bernilai negatif **${formatRupiah(Math.abs(totals.netCashFlow))}**, artinya pengeluaran melampaui pendapatan yang tercatat.`}

**Saran Tindakan:**
1. ${isPositive ? 'Sisihkan minimal 10-20% dari surplus kas ini sebagai dana cadangan darurat usaha.' : 'Tunda pengeluaran non-esensial dan fokus genjot penjualan tunai dalam minggu ini.'}
2. Lakukan pengecekan cash flow rutin di menu **Arus Kas** setiap akhir pekan.

*Disclaimer: Analisa ini dihasilkan secara otomatis berdasarkan data transaksi aktual yang Anda inputkan, dan bukan nasihat finansial/hukum resmi.*`;
  }
};

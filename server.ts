import express, { Request, Response } from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";


dotenv.config();

const PORT = 3000;

let aiClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is not set.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

interface FinancialContextPayload {
  prompt: string;
  context: {
    periodLabel?: string;
    totalIncome: number;
    totalExpense: number;
    balance: number;
    netCashFlow: number;
    transactionCount: number;
    incomeCount: number;
    expenseCount: number;
    averageTransaction?: number;
    expenseByCategory?: Array<{ category: string; amount: number; percentage: number }>;
    incomeByCategory?: Array<{ category: string; amount: number; percentage: number }>;
    recentTransactions?: Array<{ date: string; type: string; category: string; amount: number; description?: string }>;
    largestTransactions?: Array<{ date: string; type: string; category: string; amount: number; description?: string }>;
    businessName?: string;
    userName?: string;
  };
}

const SYSTEM_INSTRUCTION = `Anda adalah AFIN.AI, asisten keuangan pribadi cerdas untuk pemilik UMKM (Usaha Mikro, Kecil, dan Menengah) di Indonesia.
Misi utama Anda adalah membantu pemilik usaha memahami: "Apa yang sedang terjadi pada keuangan usaha saya?"

PRINSIP & ATURAN KRITIS (WAJIB DIPATUHI):
1. JANGAN PERNAH MENGARANG ANGKA. Gunakan HANYA angka faktual dari DATA KEUANGAN PENGGUNA yang diberikan.
2. Anda HANYA boleh menggunakan data yang disediakan dalam konteks aplikasi.
3. JIKA DATA TIDAK TERSEDIA atau transaksi 0 / kosong, katakan dengan jujur dan ramah bahwa data belum cukup untuk menjawab, dan ajak pengguna mencatat transaksi pemasukan/pengeluaran terlebih dahulu.
4. JANGAN PERNAH memberikan jawaban seolah-olah memiliki data yang tidak tersedia.
5. Anda TIDAK MEMILIKI HAK untuk mengubah atau menghapus transaksi di database. Jika pengguna meminta edit atau hapus transaksi, beri tahu bahwa mereka dapat mengelolanya langsung di menu 'Transaksi'.
6. JANGAN membuat keputusan finansial spekulatif atau berisiko tinggi tanpa disclaimer yang tepat.
7. Gunakan Bahasa Indonesia yang sederhana, bersahabat, dan hindari jargon akuntansi rumit (misal: ganti 'debit/kredit' dengan 'uang masuk/uang keluar', 'likuiditas' dengan 'ketersediaan uang kas').
8. Setiap jawaban harus ACTIONABLE (memberi saran langkah nyata yang bisa segera dipraktikkan oleh pemilik UMKM).
9. Jika pengguna menanyakan hal di luar topik keuangan atau bisnis usaha (misal resep masakan, cuaca, politik, gosip), tolak dengan sopan dan ingatkan bahwa Anda berfokus mendampingi pengelolaan keuangan usaha.

FORMAT STRUKTUR JAWABAN:
Untuk pertanyaan keuangan, gunakan struktur terorganisir berikut:
1. **Jawaban Singkat**: Inti jawaban langsung atas pertanyaan pengguna.
2. **Data yang Mendukung**: Fakta angka dari transaksi (sebutkan nominal Rupiah dengan format jelas misal Rp3.200.000, jumlah transaksi, atau persentase).
3. **Insight**: Penjelasan arti dari angka tersebut bagi kondisi usaha.
4. **Saran Tindakan**: 1-3 rekomendasi konkret yang dapat dilakukan pemilik usaha untuk perbaikan/pengembangan.

Selalu gunakan markdown rapi (poin bullet, bolding pada angka nominal Rupiah dan kesimpulan penting).`;

function formatRp(num: number) {
  return `Rp${Math.round(num || 0).toLocaleString("id-ID")}`;
}

function buildUserContextPrompt(payload: FinancialContextPayload): string {
  const { prompt, context } = payload;

  if (!context || context.transactionCount === 0) {
    return `STATUS DATA: TIDAK ADA TRANSAKSI (0 transaksi tercatat).
Nama Usaha: ${context?.businessName || "UMKM Anda"}
Pemilik: ${context?.userName || "Bapak/Ibu"}

PERTANYAAN PENGGUNA:
"${prompt}"

Instruksi: Karena belum ada data transaksi yang tercatat sama sekali di akun ini, tolong sampaikan dengan ramah bahwa data belum cukup untuk melakukan analisa, lalu sarankan pengguna mencatat transaksi terlebih dahulu di menu Transaksi.`;
  }

  const expenseBreakdown = context.expenseByCategory && context.expenseByCategory.length > 0
    ? context.expenseByCategory
        .map((c, i) => `  ${i + 1}. ${c.category}: ${formatRp(c.amount)} (${c.percentage.toFixed(1)}%)`)
        .join("\n")
    : "  Tidak ada pengeluaran tercatat.";

  const incomeBreakdown = context.incomeByCategory && context.incomeByCategory.length > 0
    ? context.incomeByCategory
        .map((c, i) => `  ${i + 1}. ${c.category}: ${formatRp(c.amount)} (${c.percentage.toFixed(1)}%)`)
        .join("\n")
    : "  Tidak ada pemasukan tercatat.";

  const recentTxs = context.recentTransactions && context.recentTransactions.length > 0
    ? context.recentTransactions
        .slice(0, 10)
        .map(
          (t) =>
            `  - [${t.date}] ${t.type === "income" ? "Masuk" : "Keluar"}: ${t.category} ${formatRp(t.amount)} ${
              t.description ? `("${t.description}")` : ""
            }`
        )
        .join("\n")
    : "  Belum ada catatan.";

  const largestTxs = context.largestTransactions && context.largestTransactions.length > 0
    ? context.largestTransactions
        .slice(0, 5)
        .map(
          (t) =>
            `  - ${t.type === "income" ? "[Masuk]" : "[Keluar]"} ${t.category}: ${formatRp(t.amount)} (${t.date})`
        )
        .join("\n")
    : "  -";

  return `DATA KEUANGAN USAHA PENGGUNA (Sumber: Data Transaksi Aktual):
Nama Usaha: ${context.businessName || "UMKM Anda"}
Pemilik: ${context.userName || "Bapak/Ibu"}
Periode Laporan: ${context.periodLabel || "Semua Waktu"}

RINGKASAN TOTAL:
- Total Pemasukan: ${formatRp(context.totalIncome)} (${context.incomeCount} transaksi masuk)
- Total Pengeluaran: ${formatRp(context.totalExpense)} (${context.expenseCount} transaksi keluar)
- Arus Kas Bersih (Saldo Bersih): ${formatRp(context.netCashFlow)} (${
    context.netCashFlow >= 0 ? "Surplus / Kas Sehat" : "Defisit / Perlu Perhatian"
  })
- Saldo Terkini: ${formatRp(context.balance)}
- Total Transaksi: ${context.transactionCount} transaksi
- Rata-rata per Transaksi: ${formatRp(context.averageTransaction || 0)}

BREAKDOWN KATEGORI PENGELUARAN:
${expenseBreakdown}

BREAKDOWN KATEGORI PEMASUKAN:
${incomeBreakdown}

5 TRANSAKSI TERBESAR:
${largestTxs}

DAFTAR TRANSAKSI TERBARU:
${recentTxs}

PERTANYAAN PENGGUNA:
"${prompt}"

Jawablah pertanyaan pengguna di atas dengan mengacu KETAT pada DATA KEUANGAN PENGGUNA di atas. Ikuti struktur:
1. **Jawaban Singkat**
2. **Data yang Mendukung**
3. **Insight**
4. **Saran Tindakan**`;
}

function generateGroundedFallback(payload: FinancialContextPayload): string {
  const { prompt, context } = payload;
  const lower = (prompt || "").toLowerCase();

  if (!context || context.transactionCount === 0) {
    return `**Jawaban Singkat:**
Data transaksi Anda saat ini masih kosong (0 transaksi tercatat).

**Data yang Mendukung:**
Belum ada transaksi pemasukan maupun pengeluaran pada akun usaha **${context?.businessName || "UMKM Anda"}**.

**Insight:**
AFIN.AI tidak dapat menganalisa atau memprediksi kondisi keuangan tanpa data transaksi riil.

**Saran Tindakan:**
Silakan tambahkan catatan pemasukan atau pengeluaran pertama Anda melalui tombol **"+ Tambah Transaksi"** di menu Transaksi.`;
  }

  const nonFinancial = ["resep", "cuaca", "presiden", "politik", "lagu", "puisi", "game", "film"];
  if (nonFinancial.some((k) => lower.includes(k))) {
    return `**Jawaban Singkat:**
Pertanyaan tersebut berada di luar ruang lingkup keuangan usaha.

**Data yang Mendukung:**
AFIN.AI dirancang khusus sebagai asisten keuangan UMKM untuk menganalisa arus kas, pemasukan, pengeluaran, dan profit usaha Anda.

**Insight:**
Menjaga fokus pada pencatatan keuangan membantu Anda memantau kesehatan bisnis secara berkesinambungan.

**Saran Tindakan:**
Silakan tanyakan hal-hal seperti total omzet, pos biaya terbesar, atau strategi penghematan operasional usaha Anda.`;
  }

  const topExpense = context.expenseByCategory && context.expenseByCategory[0];
  const topIncome = context.incomeByCategory && context.incomeByCategory[0];
  const incomeCount = context.incomeCount ?? 0;
  const expenseCount = context.expenseCount ?? 0;

  // 1. Kategori Terbesar / Paling Boros (Prioritas tinggi sebelum generic pengeluaran)
  if (lower.includes("terbesar") || lower.includes("paling besar") || lower.includes("boros") || lower.includes("kategori") || lower.includes("paling banyak")) {
    if (!topExpense) {
      return `**Jawaban Singkat:**
Belum ada catatan pengeluaran pada akun usaha Anda.

**Data yang Mendukung:**
Total pengeluaran tercatat: **Rp0**.

**Insight:**
Data transaksi pengeluaran belum cukup untuk memetakan kategori terbesar.

**Saran Tindakan:**
Catat pengeluaran operasional Anda di menu Transaksi.`;
    }

    return `**Jawaban Singkat:**
Pengeluaran terbesar usaha Anda berasal dari **${topExpense.category}** sebesar **${formatRp(topExpense.amount)}**.

**Data yang Mendukung:**
• Kategori ini mencakup sekitar **${topExpense.percentage.toFixed(1)}%** dari seluruh total pengeluaran (${formatRp(context.totalExpense)}).
${context.expenseByCategory && context.expenseByCategory[1] ? `• Kategori terbesar kedua adalah **${context.expenseByCategory[1].category}** (${formatRp(context.expenseByCategory[1].amount)} atau ${context.expenseByCategory[1].percentage.toFixed(1)}%).` : ""}

**Insight:**
Pos **${topExpense.category}** adalah komponen biaya utama yang paling mempengaruhi margin keuntungan usaha Anda.

**Saran Tindakan:**
1. Bandingkan harga dari minimal 2 pemasok berbeda untuk pos ${topExpense.category}.
2. Hitung kebutuhan bahan/operasional secara berkala untuk menghindari pemborosan.`;
  }

  // 2. Pertanyaan Pemasukan / Omzet
  if (lower.includes("pemasukan") || lower.includes("omzet") || lower.includes("omset") || lower.includes("penjualan")) {
    return `**Jawaban Singkat:**
Total pemasukan usaha Anda yang tercatat adalah **${formatRp(context.totalIncome)}**.

**Data yang Mendukung:**
• Terdiri dari **${incomeCount} transaksi** uang masuk.
${topIncome ? `• Kategori penyumbang terbesar adalah **${topIncome.category}** senilai **${formatRp(topIncome.amount)}** (${topIncome.percentage.toFixed(1)}%).` : ""}

**Insight:**
Pemasukan ini adalah penggerak utama kas usaha Anda. ${
      context.netCashFlow >= 0
        ? "Arus pendapatan berhasil menutup seluruh beban operasional yang dicatat."
        : "Namun saat ini total pemasukan masih di bawah pengeluaran tercatat."
    }

**Saran Tindakan:**
1. Pertahankan disiplin mencatat setiap penjualan harian di akhir sesi operasional.
2. Tinjau kategori **${topIncome?.category || "utama"}** untuk strategi promosi dan retensi pelanggan.`;
  }

  // 3. Pertanyaan Pengeluaran / Biaya
  if (lower.includes("pengeluaran") || lower.includes("biaya") || lower.includes("belanja")) {
    return `**Jawaban Singkat:**
Total pengeluaran usaha Anda saat ini mencapai **${formatRp(context.totalExpense)}**.

**Data yang Mendukung:**
• Berasal dari **${expenseCount} transaksi** pengeluaran.
${topExpense ? `• Pos pengeluaran terbesar adalah **${topExpense.category}** senilai **${formatRp(topExpense.amount)}** (${topExpense.percentage.toFixed(1)}% dari total pengeluaran).` : ""}

**Insight:**
${topExpense ? `Kategori **${topExpense.category}** mengambil porsi terbesar kas usaha Anda.` : "Pengeluaran terdistribusi pada beberapa kategori."}

**Saran Tindakan:**
1. Evaluasi harga beli dan vendor untuk pos **${topExpense?.category || "pengeluaran utama"}**.
2. Pantau pengeluaran kecil berulang yang sering kali tidak terkontrol.`;
  }

  const isPositive = context.netCashFlow >= 0;
  return `**Jawaban Singkat:**
Kondisi keuangan usaha Anda saat ini berada dalam posisi **${isPositive ? "SEHAT (Surplus Kas)" : "PERLU PERHATIAN (Defisit Kas)"}**.

**Data yang Mendukung:**
• Total Pemasukan: **${formatRp(context.totalIncome)}** (${context.incomeCount} transaksi)
• Total Pengeluaran: **${formatRp(context.totalExpense)}** (${context.expenseCount} transaksi)
• Arus Kas Bersih: **${formatRp(context.netCashFlow)}**
• Saldo Terkini: **${formatRp(context.balance)}**

**Insight:**
${isPositive ? `Arus kas Anda positif **${formatRp(context.netCashFlow)}**, mengindikasikan operasional usaha mampu membiayai dirinya sendiri.` : `Arus kas defisit **${formatRp(Math.abs(context.netCashFlow))}**, artinya pengeluaran sementara waktu melampaui pendapatan.`}

**Saran Tindakan:**
1. ${isPositive ? "Sisihkan sebagian laba kas ini ke rekening terpisah sebagai dana cadangan darurat." : "Tekan pengeluaran non-mendesak dan fokus genjot penjualan tunai minggu ini."}
2. Buka menu **Arus Kas** untuk melihat grafik tren mingguan dan bulanan secara berkala.

*Catatan: Analisa ini dihasilkan secara otomatis berdasarkan data transaksi aktual Anda, bukan nasihat finansial/legal resmi.*`;
}

async function startServer() {
  const app = express();

  // Security Headers Middleware
  app.use((_req, res, next) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-XSS-Protection", "1; mode=block");
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
    next();
  });

  // Strict Request Body Limit (100kb is ample for financial context & prevents body-inflation attacks)
  app.use(express.json({ limit: "100kb" }));

  // API Health Check
  app.get("/api/health", (_req: Request, res: Response) => {
    res.json({ status: "ok", service: "afin-ai", timestamp: new Date().toISOString() });
  });

  // API Gemini Financial Assistant (supports alias endpoints and payload variants)
  const handleAiAssistantRequest = async (req: Request, res: Response): Promise<void> => {
    const payload = req.body as FinancialContextPayload & { message?: string };
    const rawPrompt = payload?.prompt || payload?.message;

    // 1. Input Validation: Prompt wajib ada dan bertipe string
    if (!rawPrompt || typeof rawPrompt !== "string") {
      res.status(400).json({ error: "Prompt pertanyaan diperlukan dan harus berupa teks string." });
      return;
    }

    const trimmedPrompt = rawPrompt.trim();
    if (trimmedPrompt.length === 0) {
      res.status(400).json({ error: "Prompt pertanyaan tidak boleh kosong." });
      return;
    }

    // 2. Input Validation: Batasi panjang prompt maksimum 1.000 karakter untuk mencegah denial-of-service / prompt injection
    if (trimmedPrompt.length > 1000) {
      res.status(400).json({ error: "Panjang pertanyaan melebihi batas wajar (maksimal 1.000 karakter)." });
      return;
    }

    // Sanitasi payload dengan prompt yang sudah ditrim & dibatasi
    const sanitizedPayload: FinancialContextPayload = {
      ...payload,
      prompt: trimmedPrompt,
      context: {
        ...payload.context,
        // Batasi array transaksi yang dikirim untuk mencegah payload injection
        recentTransactions: (payload.context?.recentTransactions || []).slice(0, 15),
        largestTransactions: (payload.context?.largestTransactions || []).slice(0, 10),
      }
    };

    const apiKey = process.env.GEMINI_API_KEY;

    // Jika API Key tersedia, coba panggil Gemini dengan timeout aman
    if (apiKey) {
      try {
        const ai = getGenAI();
        const userPrompt = buildUserContextPrompt(sanitizedPayload);

        // Timeout 6 detik agar tidak pernah membuat browser menunggu lama
        const callGemini = ai.models.generateContent({
          model: "gemini-3.8-flash",
          contents: userPrompt,
          config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            temperature: 0.2,
          },
        });

        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error("Gemini API call timed out")), 6000)
        );

        const response = await Promise.race([callGemini, timeoutPromise]);
        const text = response.text || "";

        if (text) {
          res.json({
            answer: text,
            source: "gemini",
            model: "gemini-3.8-flash",
          });
          return;
        }
      } catch (err: unknown) {
        console.warn("Gemini API call failed or timed out, using grounded deterministic answer:", err);
      }
    }

    // Grounded deterministic fallback (selalu deterministik & mematuhi 4 format)
    const fallbackAnswer = generateGroundedFallback(sanitizedPayload);
    res.json({
      answer: fallbackAnswer,
      source: "rules_fallback",
      model: "afin-deterministic-v1",
    });
  };

  app.post("/api/gemini/assistant", handleAiAssistantRequest);
  app.post("/api/ai/ask", handleAiAssistantRequest);
  app.post("/api/chat", handleAiAssistantRequest);

  // Vite Middleware for development vs static serve for production
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    // In Express v5, wildcard must be '*all'
    app.get("*all", (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

import { Transaction, TransactionType, INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '../../types';
import { getTodayDateString } from '../../utils/date';

const STORAGE_KEY_TXS = 'afin_mock_transactions';

const INITIAL_MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx_01',
    userId: 'user_umkm_01',
    date: getTodayDateString(),
    type: 'income',
    category: 'Penjualan',
    amount: 3500000,
    description: 'Penjualan katering makan siang 35 porsi',
    createdAt: new Date().toISOString()
  },
  {
    id: 'tx_02',
    userId: 'user_umkm_01',
    date: getTodayDateString(),
    type: 'expense',
    category: 'Bahan Baku',
    amount: 1200000,
    description: 'Belanja beras, ayam, dan bumbu dapur di pasar',
    createdAt: new Date().toISOString()
  },
  {
    id: 'tx_03',
    userId: 'user_umkm_01',
    date: getTodayDateString(),
    type: 'expense',
    category: 'Transportasi',
    amount: 50000,
    description: 'Bensin pengantaran pesanan',
    createdAt: new Date().toISOString()
  },
  {
    id: 'tx_04',
    userId: 'user_umkm_01',
    date: '2026-09-09',
    type: 'income',
    category: 'Penjualan',
    amount: 7500000,
    description: 'Pendapatan warung dan pesanan nasi kotak harian',
    createdAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: 'tx_05',
    userId: 'user_umkm_01',
    date: '2026-09-08',
    type: 'expense',
    category: 'Operasional',
    amount: 500000,
    description: 'Kemasan box makanan dan kantong ramah lingkungan',
    createdAt: new Date(Date.now() - 172800000).toISOString()
  },
  {
    id: 'tx_06',
    userId: 'user_umkm_01',
    date: '2026-09-05',
    type: 'income',
    category: 'Pendapatan Jasa',
    amount: 4000000,
    description: 'Jasa masak acara arisan warga',
    createdAt: new Date(Date.now() - 432000000).toISOString()
  },
  {
    id: 'tx_07',
    userId: 'user_umkm_01',
    date: '2026-09-04',
    type: 'expense',
    category: 'Gaji',
    amount: 2500000,
    description: 'Uang gaji mingguan 2 asisten dapur',
    createdAt: new Date(Date.now() - 518400000).toISOString()
  },
  {
    id: 'tx_08',
    userId: 'user_umkm_01',
    date: '2026-09-02',
    type: 'expense',
    category: 'Listrik/Internet',
    amount: 2000000,
    description: 'Token listrik freezer kulkas dan wifi usaha',
    createdAt: new Date(Date.now() - 691200000).toISOString()
  }
];

export const transactionService = {
  /**
   * READ: Mengambil transaksi HANYA untuk userId yang terautentikasi.
   * Tidak mengembalikan data milik user lain.
   */
  getTransactions(userId: string): Transaction[] {
    if (!userId || typeof userId !== 'string' || userId.trim() === '') {
      return [];
    }

    const raw = localStorage.getItem(STORAGE_KEY_TXS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_TXS, JSON.stringify(INITIAL_MOCK_TRANSACTIONS));
      return INITIAL_MOCK_TRANSACTIONS.filter((t) => t.userId === userId);
    }
    try {
      const all: Transaction[] = JSON.parse(raw);
      // STRICT FILTERING: Hanya mengembalikan transaksi dengan userId yang cocok
      return all
        .filter((t) => t.userId === userId)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } catch {
      return [];
    }
  },

  /**
   * CREATE: Menambahkan transaksi baru dengan kepemilikan userId terverifikasi.
   * Melakukan validasi ketat terhadap input: nominal > 0, tipe valid, kategori valid.
   */
  addTransaction(data: {
    userId: string;
    date: string;
    type: TransactionType;
    category: string;
    amount: number;
    description: string;
  }): Transaction {
    if (!data.userId || typeof data.userId !== 'string' || data.userId.trim() === '') {
      throw new Error('Akses ditolak: User ID tidak terautentikasi.');
    }

    if (!data.amount || isNaN(data.amount) || data.amount <= 0) {
      throw new Error('Nominal transaksi wajib lebih besar dari 0.');
    }

    if (data.type !== 'income' && data.type !== 'expense') {
      throw new Error('Tipe transaksi harus "income" atau "expense".');
    }

    if (!data.category || typeof data.category !== 'string' || data.category.trim() === '') {
      throw new Error('Kategori transaksi wajib dipilih.');
    }

    const validCategories = [...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES] as string[];
    if (!validCategories.includes(data.category)) {
      throw new Error('Kategori transaksi tidak dikenal.');
    }

    if (!data.date || isNaN(new Date(data.date).getTime())) {
      throw new Error('Tanggal transaksi tidak valid.');
    }

    const raw = localStorage.getItem(STORAGE_KEY_TXS);
    const all: Transaction[] = raw ? JSON.parse(raw) : INITIAL_MOCK_TRANSACTIONS;

    const newTx: Transaction = {
      id: `tx_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      userId: data.userId, // Terikat pada user pembuat
      date: data.date,
      type: data.type,
      category: data.category.trim(),
      amount: Math.abs(data.amount),
      description: (data.description || '').trim().slice(0, 500),
      createdAt: new Date().toISOString()
    };

    all.unshift(newTx);
    localStorage.setItem(STORAGE_KEY_TXS, JSON.stringify(all));
    return newTx;
  },

  /**
   * UPDATE: Memperbarui transaksi dengan verifikasi hak milik (isOwner check).
   * Mencegah user mengubah transaksi milik user lain atau memutasi kepemilikan userId.
   */
  updateTransaction(
    id: string,
    currentUserId: string,
    updates: Partial<Omit<Transaction, 'id' | 'userId' | 'createdAt'>>
  ): Transaction | null {
    if (!currentUserId || typeof currentUserId !== 'string' || currentUserId.trim() === '') {
      throw new Error('Akses ditolak: User ID tidak terautentikasi.');
    }

    const raw = localStorage.getItem(STORAGE_KEY_TXS);
    if (!raw) return null;
    const all: Transaction[] = JSON.parse(raw);
    const index = all.findIndex((t) => t.id === id);
    if (index === -1) return null;

    const existingTx = all[index];

    // DATA OWNERSHIP CHECK: Tolak jika transaksi bukan milik user yang sedang aktif
    if (existingTx.userId !== currentUserId) {
      throw new Error('Akses ditolak: Anda tidak memiliki wewenang untuk mengubah data transaksi milik user lain.');
    }

    // Input validations on update
    if (updates.amount !== undefined) {
      if (isNaN(updates.amount) || updates.amount <= 0) {
        throw new Error('Nominal transaksi wajib lebih besar dari 0.');
      }
    }

    if (updates.type !== undefined && updates.type !== 'income' && updates.type !== 'expense') {
      throw new Error('Tipe transaksi harus "income" atau "expense".');
    }

    all[index] = {
      ...existingTx,
      ...updates,
      // Jaminan integritas: id, userId, dan createdAt TIDAK BISA dimutasi
      id: existingTx.id,
      userId: existingTx.userId,
      createdAt: existingTx.createdAt,
      amount: updates.amount !== undefined ? Math.abs(updates.amount) : existingTx.amount,
      description: updates.description !== undefined ? (updates.description || '').trim().slice(0, 500) : existingTx.description
    };

    localStorage.setItem(STORAGE_KEY_TXS, JSON.stringify(all));
    return all[index];
  },

  /**
   * DELETE: Menghapus transaksi dengan verifikasi hak milik (isOwner check).
   * Mencegah user menghapus transaksi milik user lain.
   */
  deleteTransaction(id: string, currentUserId: string): boolean {
    if (!currentUserId || typeof currentUserId !== 'string' || currentUserId.trim() === '') {
      throw new Error('Akses ditolak: User ID tidak terautentikasi.');
    }

    const raw = localStorage.getItem(STORAGE_KEY_TXS);
    if (!raw) return false;
    const all: Transaction[] = JSON.parse(raw);
    const target = all.find((t) => t.id === id);

    if (!target) return false;

    // DATA OWNERSHIP CHECK: Tolak jika transaksi bukan milik user aktif
    if (target.userId !== currentUserId) {
      throw new Error('Akses ditolak: Anda tidak memiliki wewenang untuk menghapus transaksi milik user lain.');
    }

    const filtered = all.filter((t) => t.id !== id);
    localStorage.setItem(STORAGE_KEY_TXS, JSON.stringify(filtered));
    return true;
  },

  /**
   * Reset data demo awal untuk akun demo
   */
  resetToInitial(userId: string): void {
    if (!userId) return;
    const raw = localStorage.getItem(STORAGE_KEY_TXS);
    const all: Transaction[] = raw ? JSON.parse(raw) : [];
    // Hapus data milik user ini saja, lalu masukkan initial data khusus user ini
    const others = all.filter((t) => t.userId !== userId);
    const userSeed = INITIAL_MOCK_TRANSACTIONS.map((t, idx) => ({
      ...t,
      id: `tx_seed_${userId}_${idx}`,
      userId
    }));
    localStorage.setItem(STORAGE_KEY_TXS, JSON.stringify([...userSeed, ...others]));
  },

  /**
   * Mengosongkan data transaksi HANYA milik user bersangkutan
   */
  clearAll(userId: string): void {
    if (!userId) return;
    const raw = localStorage.getItem(STORAGE_KEY_TXS);
    if (!raw) return;
    const all: Transaction[] = JSON.parse(raw);
    const remaining = all.filter((t) => t.userId !== userId);
    localStorage.setItem(STORAGE_KEY_TXS, JSON.stringify(remaining));
  }
};

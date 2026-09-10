import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Trash2, 
  Edit3, 
  PlusCircle, 
  Calendar, 
  XCircle, 
  Tag, 
  ChevronLeft, 
  ChevronRight,
  Loader2,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { 
  Transaction, 
  TransactionType, 
  INCOME_CATEGORIES, 
  EXPENSE_CATEGORIES 
} from '../../types';
import { formatRupiah } from '../../utils/currency';
import { formatTanggalIndo } from '../../utils/date';
import { Badge } from '../common/Badge';
import { ConfirmDeleteModal } from './ConfirmDeleteModal';

interface TransactionListProps {
  transactions: Transaction[];
  isLoading?: boolean;
  onOpenNew: () => void;
  onEdit: (tx: Transaction) => void;
  onDelete: (id: string) => void;
}

const ITEMS_PER_PAGE = 10;

export const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  isLoading = false,
  onOpenNew,
  onEdit,
  onDelete
}) => {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | TransactionType>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteTargetTx, setDeleteTargetTx] = useState<Transaction | null>(null);

  // Available categories based on type filter
  const categoryOptions = useMemo(() => {
    if (typeFilter === 'income') return [...INCOME_CATEGORIES];
    if (typeFilter === 'expense') return [...EXPENSE_CATEGORIES];
    return Array.from(new Set([...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES]));
  }, [typeFilter]);

  // Reset pagination on filter or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search, typeFilter, categoryFilter, startDate, endDate]);

  // Filtered transactions
  const filtered = useMemo(() => {
    return transactions.filter((tx) => {
      // 1. Search across description & category
      if (search.trim()) {
        const query = search.toLowerCase();
        const matchDesc = tx.description?.toLowerCase().includes(query);
        const matchCat = tx.category.toLowerCase().includes(query);
        if (!matchDesc && !matchCat) return false;
      }

      // 2. Type filter
      if (typeFilter !== 'all' && tx.type !== typeFilter) {
        return false;
      }

      // 3. Category filter
      if (categoryFilter !== 'all' && tx.category !== categoryFilter) {
        return false;
      }

      // 4. Date range
      if (startDate && tx.date < startDate) return false;
      if (endDate && tx.date > endDate) return false;

      return true;
    });
  }, [transactions, search, typeFilter, categoryFilter, startDate, endDate]);

  // Totals for filtered transactions
  const filteredTotals = useMemo(() => {
    let income = 0;
    let expense = 0;
    for (const t of filtered) {
      if (t.type === 'income') income += t.amount;
      else if (t.type === 'expense') expense += t.amount;
    }
    return { income, expense, count: filtered.length };
  }, [filtered]);

  // Pagination calculations
  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * ITEMS_PER_PAGE;
  const paginatedTransactions = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const hasActiveFilters = Boolean(
    search.trim() || typeFilter !== 'all' || categoryFilter !== 'all' || startDate || endDate
  );

  const resetFilters = () => {
    setSearch('');
    setTypeFilter('all');
    setCategoryFilter('all');
    setStartDate('');
    setEndDate('');
    setCurrentPage(1);
  };

  // Quick Date Presets
  const applyDatePreset = (preset: 'today' | 'last7' | 'thisMonth') => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const todayStr = `${year}-${month}-${day}`;

    if (preset === 'today') {
      setStartDate(todayStr);
      setEndDate(todayStr);
    } else if (preset === 'last7') {
      const past = new Date(now);
      past.setDate(past.getDate() - 6);
      const pastStr = `${past.getFullYear()}-${String(past.getMonth() + 1).padStart(2, '0')}-${String(past.getDate()).padStart(2, '0')}`;
      setStartDate(pastStr);
      setEndDate(todayStr);
    } else if (preset === 'thisMonth') {
      setStartDate(`${year}-${month}-01`);
      setEndDate(todayStr);
    }
  };

  const handleConfirmDelete = (id: string) => {
    onDelete(id);
    setDeleteTargetTx(null);
  };

  return (
    <div className="space-y-4">
      {/* Header & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Manajemen Transaksi
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Kelola pemasukan dan pengeluaran usaha Anda dengan filter dan pencarian lengkap.
          </p>
        </div>
        <button
          id="btn-add-transaction-list"
          type="button"
          onClick={onOpenNew}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-bold shadow-xs shadow-blue-600/20 transition-all cursor-pointer shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Tambah Transaksi Baru</span>
        </button>
      </div>

      {/* Filter & Search Panel */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
            <Filter className="w-4 h-4 text-blue-600" />
            <span>Filter & Pencarian</span>
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              id="btn-reset-filters"
              onClick={resetFilters}
              className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline cursor-pointer"
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>Reset Filter</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* 1. Search Deskripsi & Kategori */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              id="input-search-transaction"
              type="text"
              placeholder="Cari deskripsi / kategori..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
            />
          </div>

          {/* 2. Type Filter Tabs (Semua, Pemasukan, Pengeluaran) */}
          <div className="flex rounded-xl border border-slate-200 p-1 bg-slate-50">
            <button
              type="button"
              id="filter-type-all"
              onClick={() => {
                setTypeFilter('all');
                setCategoryFilter('all');
              }}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                typeFilter === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Semua
            </button>
            <button
              type="button"
              id="filter-type-income"
              onClick={() => {
                setTypeFilter('income');
                setCategoryFilter('all');
              }}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                typeFilter === 'income'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Pemasukan
            </button>
            <button
              type="button"
              id="filter-type-expense"
              onClick={() => {
                setTypeFilter('expense');
                setCategoryFilter('all');
              }}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                typeFilter === 'expense'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Pengeluaran
            </button>
          </div>

          {/* 3. Category Filter */}
          <div className="relative">
            <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <select
              id="filter-category"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            >
              <option value="all">Semua Kategori</option>
              {categoryOptions.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* 4. Date Range */}
          <div className="flex items-center gap-1.5">
            <div className="relative flex-1">
              <input
                id="filter-start-date"
                type="date"
                title="Rentang Tanggal Mulai"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-2.5 py-2 text-xs rounded-xl border border-slate-200 bg-white text-slate-700"
              />
            </div>
            <span className="text-slate-400 text-xs font-bold">-</span>
            <div className="relative flex-1">
              <input
                id="filter-end-date"
                type="date"
                title="Rentang Tanggal Selesai"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-2.5 py-2 text-xs rounded-xl border border-slate-200 bg-white text-slate-700"
              />
            </div>
          </div>
        </div>

        {/* Quick Date Range Preset Buttons */}
        <div className="flex items-center gap-2 pt-1 border-t border-slate-100 text-[11px] overflow-x-auto pb-1">
          <span className="text-slate-400 font-medium">Preset cepat:</span>
          <button
            type="button"
            onClick={() => applyDatePreset('today')}
            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold cursor-pointer whitespace-nowrap"
          >
            Hari Ini
          </button>
          <button
            type="button"
            onClick={() => applyDatePreset('last7')}
            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold cursor-pointer whitespace-nowrap"
          >
            7 Hari Terakhir
          </button>
          <button
            type="button"
            onClick={() => applyDatePreset('thisMonth')}
            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold cursor-pointer whitespace-nowrap"
          >
            Bulan Ini
          </button>
          {(startDate || endDate) && (
            <button
              type="button"
              onClick={() => {
                setStartDate('');
                setEndDate('');
              }}
              className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold cursor-pointer whitespace-nowrap"
            >
              Hapus Filter Tanggal
            </button>
          )}
        </div>
      </div>

      {/* Filter Summary Banner */}
      {filtered.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 bg-slate-100/70 rounded-xl border border-slate-200 text-xs">
          <span className="font-semibold text-slate-700">
            Hasil Filter: <strong>{filtered.length}</strong> transaksi ditemukan
          </span>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
              <TrendingUp className="w-3.5 h-3.5" />
              Masuk: {formatRupiah(filteredTotals.income)}
            </span>
            <span className="inline-flex items-center gap-1 text-rose-700 font-bold">
              <TrendingDown className="w-3.5 h-3.5" />
              Keluar: {formatRupiah(filteredTotals.expense)}
            </span>
          </div>
        </div>
      )}

      {/* Table / Transactions Card List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="py-20 text-center flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-2" />
            <p className="text-xs font-semibold text-slate-600">Memuat transaksi...</p>
          </div>
        ) : filtered.length === 0 ? (
          /* Empty State */
          <div className="py-16 text-center text-slate-400 flex flex-col items-center justify-center p-6">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mb-3">
              <Calendar className="w-6 h-6 stroke-1" />
            </div>
            <p className="text-sm font-bold text-slate-800">
              {hasActiveFilters ? 'Tidak ada transaksi yang cocok' : 'Belum ada data transaksi'}
            </p>
            <p className="text-xs text-slate-500 mt-1 max-w-sm">
              {hasActiveFilters 
                ? 'Tidak ada transaksi yang sesuai dengan kriteria pencarian atau filter yang dipilih.' 
                : 'Mulai kelola keuangan usaha dengan mencatat pemasukan atau pengeluaran pertama Anda.'}
            </p>
            {hasActiveFilters ? (
              <button
                type="button"
                onClick={resetFilters}
                className="mt-4 px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 cursor-pointer"
              >
                Reset Semua Filter
              </button>
            ) : (
              <button
                type="button"
                onClick={onOpenNew}
                className="mt-4 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-xs hover:bg-blue-700 cursor-pointer"
              >
                Catat Transaksi Sekarang
              </button>
            )}
          </div>
        ) : (
          /* Table View */
          <div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-[11px] font-bold text-slate-600 border-b border-slate-200 uppercase tracking-wider">
                    <th className="py-3 px-4">Tanggal</th>
                    <th className="py-3 px-4">Jenis</th>
                    <th className="py-3 px-4">Kategori</th>
                    <th className="py-3 px-4">Keterangan</th>
                    <th className="py-3 px-4 text-right">Nominal</th>
                    <th className="py-3 px-4 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {paginatedTransactions.map((tx) => {
                    const isIncome = tx.type === 'income';

                    return (
                      <tr key={tx.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4 font-semibold text-slate-700 whitespace-nowrap">
                          {formatTanggalIndo(tx.date)}
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <Badge type={tx.type}>
                            <span className="flex items-center gap-1">
                              {isIncome ? (
                                <ArrowUpRight className="w-3 h-3" />
                              ) : (
                                <ArrowDownLeft className="w-3 h-3" />
                              )}
                              {isIncome ? 'Pemasukan' : 'Pengeluaran'}
                            </span>
                          </Badge>
                        </td>
                        <td className="py-3.5 px-4 font-bold text-slate-900 whitespace-nowrap">
                          {tx.category}
                        </td>
                        <td className="py-3.5 px-4 text-slate-600 max-w-xs truncate">
                          {tx.description || <span className="text-slate-300 italic">-</span>}
                        </td>
                        <td className="py-3.5 px-4 text-right whitespace-nowrap font-black text-sm">
                          <span className={isIncome ? 'text-emerald-700' : 'text-rose-700'}>
                            {isIncome ? '+' : '-'}{formatRupiah(tx.amount)}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center whitespace-nowrap">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              type="button"
                              id={`btn-edit-${tx.id}`}
                              onClick={() => onEdit(tx)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                              title="Edit Transaksi"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              id={`btn-delete-${tx.id}`}
                              onClick={() => setDeleteTargetTx(tx)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                              title="Hapus Transaksi"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="px-5 py-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
              <span className="text-xs text-slate-500">
                Menampilkan <strong>{startIndex + 1}</strong> - <strong>{Math.min(startIndex + ITEMS_PER_PAGE, filtered.length)}</strong> dari <strong>{filtered.length}</strong> transaksi
              </span>

              {totalPages > 1 && (
                <div className="flex items-center gap-1 self-center">
                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={safeCurrentPage === 1}
                    className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                    title="Halaman Sebelumnya"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => {
                    // Show first, last, and around current
                    if (
                      num === 1 || 
                      num === totalPages || 
                      Math.abs(num - safeCurrentPage) <= 1
                    ) {
                      return (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setCurrentPage(num)}
                          className={`w-7 h-7 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                            safeCurrentPage === num
                              ? 'bg-blue-600 text-white shadow-xs'
                              : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          {num}
                        </button>
                      );
                    } else if (
                      num === 2 && safeCurrentPage > 3 ||
                      num === totalPages - 1 && safeCurrentPage < totalPages - 2
                    ) {
                      return <span key={num} className="text-slate-400 text-xs px-1">...</span>;
                    }
                    return null;
                  })}

                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={safeCurrentPage === totalPages}
                    className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                    title="Halaman Berikutnya"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Modal for Delete */}
      <ConfirmDeleteModal
        isOpen={Boolean(deleteTargetTx)}
        transaction={deleteTargetTx}
        onClose={() => setDeleteTargetTx(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

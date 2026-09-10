import React, { useState, useMemo } from 'react';
import { 
  ArrowLeftRight, 
  Calendar, 
  PlusCircle, 
  SlidersHorizontal,
  XCircle
} from 'lucide-react';
import { Transaction, CashFlowPeriod } from '../../types';
import { 
  calculateTotals, 
  calculateCategoryBreakdown, 
  filterTransactionsByCashFlowPeriod,
  calculateCashFlowTrendPoints,
  getLargestTransactions
} from '../../utils/calculations';
import { getTodayDateString } from '../../utils/date';
import { CashFlowMetricCards } from './CashFlowMetricCards';
import { CashFlowTrendChart } from './CashFlowTrendChart';
import { ExpenseCategoryChart } from './ExpenseCategoryChart';
import { LargestTransactionsCard } from './LargestTransactionsCard';

interface CashFlowViewProps {
  transactions: Transaction[];
  onOpenNewTransaction: () => void;
}

export const CashFlowView: React.FC<CashFlowViewProps> = ({
  transactions,
  onOpenNewTransaction
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState<CashFlowPeriod>('month');
  const [customStart, setCustomStart] = useState<string>('');
  const [customEnd, setCustomEnd] = useState<string>('');

  // Perhitungan Data Periode (Sekarang vs Sebelumnya)
  const {
    currentTransactions,
    previousTransactions,
    periodLabel,
    startDate,
    endDate
  } = useMemo(() => {
    return filterTransactionsByCashFlowPeriod(
      transactions,
      selectedPeriod,
      customStart,
      customEnd
    );
  }, [transactions, selectedPeriod, customStart, customEnd]);

  // Metrik Finansial
  const currentSummary = useMemo(() => calculateTotals(currentTransactions), [currentTransactions]);
  const previousSummary = useMemo(() => calculateTotals(previousTransactions), [previousTransactions]);
  
  // Breakdown Kategori Pengeluaran
  const expenseBreakdown = useMemo(() => {
    return calculateCategoryBreakdown(currentTransactions, 'expense');
  }, [currentTransactions]);

  const topExpenseCategory = expenseBreakdown.length > 0 ? expenseBreakdown[0] : null;

  // Tren Points (Grafik Pemasukan vs Pengeluaran)
  const trendPoints = useMemo(() => {
    return calculateCashFlowTrendPoints(currentTransactions, selectedPeriod, startDate, endDate);
  }, [currentTransactions, selectedPeriod, startDate, endDate]);

  // 5 Transaksi Terbesar
  const largestTransactions = useMemo(() => {
    return getLargestTransactions(currentTransactions, 5);
  }, [currentTransactions]);

  const hasGlobalTransactions = transactions.length > 0;
  const hasCurrentPeriodTransactions = currentTransactions.length > 0;

  return (
    <div className="space-y-6">
      {/* Header & Period Filter */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <ArrowLeftRight className="w-5 h-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Analisa Arus Kas (Cash Flow)
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Pahami pergerakan uang masuk dan uang keluar usaha Anda secara komprehensif.
          </p>
        </div>

        {/* Filter Periode: Minggu, Bulan, 3 Bulan, Custom date range */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex rounded-xl border border-slate-200 p-1 bg-slate-50">
            <button
              type="button"
              id="filter-cf-week"
              onClick={() => setSelectedPeriod('week')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                selectedPeriod === 'week'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Minggu
            </button>
            <button
              type="button"
              id="filter-cf-month"
              onClick={() => setSelectedPeriod('month')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                selectedPeriod === 'month'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Bulan
            </button>
            <button
              type="button"
              id="filter-cf-3months"
              onClick={() => setSelectedPeriod('three_months')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                selectedPeriod === 'three_months'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              3 Bulan
            </button>
            <button
              type="button"
              id="filter-cf-custom"
              onClick={() => {
                setSelectedPeriod('custom');
                if (!customStart || !customEnd) {
                  const today = getTodayDateString();
                  setCustomStart(today);
                  setCustomEnd(today);
                }
              }}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                selectedPeriod === 'custom'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Custom Date
            </button>
          </div>

          <button
            type="button"
            onClick={onOpenNewTransaction}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs cursor-pointer shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Catat Transaksi</span>
          </button>
        </div>
      </div>

      {/* Custom Date Range Picker Bar (Muncul jika pilih 'custom') */}
      {selectedPeriod === 'custom' && (
        <div className="bg-white rounded-2xl border border-blue-200 p-4 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-700 font-bold">
            <SlidersHorizontal className="w-4 h-4 text-blue-600" />
            <span>Pilih Rentang Tanggal Custom:</span>
          </div>

          <div className="flex items-center gap-2">
            <input
              id="custom-cf-start"
              type="date"
              value={customStart}
              onChange={(e) => setCustomStart(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-800 text-xs font-medium"
            />
            <span className="text-slate-400 font-bold">s/d</span>
            <input
              id="custom-cf-end"
              type="date"
              value={customEnd}
              onChange={(e) => setCustomEnd(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-800 text-xs font-medium"
            />
          </div>
        </div>
      )}

      {/* Global Empty State */}
      {!hasGlobalTransactions ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs">
          <div className="w-14 h-14 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
            <ArrowLeftRight className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Belum Ada Transaksi Tercatat</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-5 leading-relaxed">
            Halaman Cash Flow akan menganalisa perputaran kas, rasio pengeluaran, tren pertumbuhan, dan transaksi terbesar setelah Anda mulai mencatat transaksi usaha.
          </p>
          <button
            type="button"
            onClick={onOpenNewTransaction}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Catat Transaksi Pertama</span>
          </button>
        </div>
      ) : (
        <>
          {/* 1. Metric Cards: Total Pemasukan, Total Pengeluaran, Arus Kas Bersih, Kategori Terbesar */}
          <CashFlowMetricCards
            summary={currentSummary}
            prevSummary={previousSummary}
            topExpenseCategory={topExpenseCategory}
            periodLabel={periodLabel}
          />

          {/* 2. Visual Grafik Tren Arus Kas: Menjawab pertanyaan bisnis */}
          <CashFlowTrendChart
            trendPoints={trendPoints}
            periodLabel={periodLabel}
            summary={currentSummary}
            prevSummary={previousSummary}
          />

          {/* 3. Breakdown Kategori Pengeluaran & Transaksi Terbesar */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 7. Breakdown Kategori Pengeluaran */}
            <ExpenseCategoryChart
              categories={expenseBreakdown}
              totalExpense={currentSummary.totalExpense}
              periodLabel={periodLabel}
            />

            {/* 8. Transaksi Terbesar */}
            <LargestTransactionsCard
              transactions={largestTransactions}
              onOpenNewTransaction={onOpenNewTransaction}
            />
          </div>
        </>
      )}
    </div>
  );
};

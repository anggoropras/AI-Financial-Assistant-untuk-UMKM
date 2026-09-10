import React, { useState } from 'react';
import { PlusCircle, Bot, ArrowLeftRight, TrendingDown, Calendar } from 'lucide-react';
import { FinancialSummary, CategoryBreakdown, Transaction, UserProfile, PeriodFilterType } from '../../types';
import { SummaryCards } from './SummaryCards';
import { RecentTransactions } from './RecentTransactions';
import { QuickInsightCard } from './QuickInsightCard';
import { IncomeExpenseChart } from './IncomeExpenseChart';
import { formatRupiah } from '../../utils/currency';
import { formatTanggalIndo, getTodayDateString } from '../../utils/date';
import { calculateTotals, calculateCategoryBreakdown, filterTransactionsByPeriod } from '../../utils/calculations';

interface DashboardViewProps {
  summary: FinancialSummary;
  recentTransactions: Transaction[];
  expenseBreakdown: CategoryBreakdown[];
  currentUser: UserProfile | null;
  allTransactions?: Transaction[];
  onOpenNewTransaction: () => void;
  onOpenTransactions: () => void;
  onOpenCashFlow: () => void;
  onOpenAi: () => void;
  onSelectTransaction: (tx: Transaction) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  summary: initialSummary,
  recentTransactions,
  expenseBreakdown: initialExpenseBreakdown,
  currentUser,
  allTransactions,
  onOpenNewTransaction,
  onOpenTransactions,
  onOpenCashFlow,
  onOpenAi,
  onSelectTransaction
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodFilterType>('all');
  const todayStr = formatTanggalIndo(getTodayDateString());

  // Sumber transaksi lengkap
  const sourceTransactions = allTransactions || recentTransactions;

  // Perhitungan deterministik berdasarkan periode aktif
  const filteredTxs = filterTransactionsByPeriod(sourceTransactions, selectedPeriod);
  const activeSummary = calculateTotals(filteredTxs);
  const activeExpenseBreakdown = calculateCategoryBreakdown(filteredTxs, 'expense');
  const topExpenses = activeExpenseBreakdown.slice(0, 5);

  const periodLabels: Record<PeriodFilterType, string> = {
    today: 'Hari Ini',
    this_week: 'Minggu Ini',
    this_month: 'Bulan Ini',
    all: 'Semua Waktu'
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner & Period Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Dashboard Keuangan
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold">
              {todayStr}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Selamat datang di <strong>{currentUser?.businessName || 'Usaha Anda'}</strong>. Pantau kondisi kas harian Anda secara real-time.
          </p>
        </div>

        {/* Periode Filter (Hari Ini, Minggu Ini, Bulan Ini, Semua Waktu) */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200 self-start md:self-auto shrink-0">
          <Calendar className="w-3.5 h-3.5 text-slate-400 ml-2 mr-1 hidden sm:inline" />
          {(['today', 'this_week', 'this_month', 'all'] as const).map((key) => {
            const isActive = selectedPeriod === key;
            return (
              <button
                key={key}
                type="button"
                id={`btn-period-${key}`}
                onClick={() => setSelectedPeriod(key)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                {periodLabels[key]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Action Shortcuts */}
      <div className="flex items-center justify-between gap-3">
        <div className="text-xs text-slate-500 font-medium">
          Menampilkan metrik untuk: <strong className="text-slate-800">{periodLabels[selectedPeriod]}</strong>
          {selectedPeriod !== 'all' && (
            <span className="ml-2 text-[11px] text-blue-600 cursor-pointer hover:underline" onClick={() => setSelectedPeriod('all')}>
              (Reset ke Semua Waktu)
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenNewTransaction}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Catat Transaksi</span>
          </button>
          <button
            type="button"
            onClick={onOpenAi}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold cursor-pointer"
          >
            <Bot className="w-4 h-4 text-blue-600" />
            <span>Tanya AI</span>
          </button>
          <button
            type="button"
            onClick={onOpenCashFlow}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold cursor-pointer"
          >
            <ArrowLeftRight className="w-4 h-4 text-slate-500" />
            <span className="hidden sm:inline">Arus Kas</span>
          </button>
        </div>
      </div>

      {/* 5 Financial Summary Stat Cards */}
      <SummaryCards summary={activeSummary} />

      {/* Visual Chart: Pemasukan vs Pengeluaran */}
      <IncomeExpenseChart
        summary={activeSummary}
        selectedPeriod={selectedPeriod}
        periodLabel={periodLabels[selectedPeriod]}
      />

      {/* Main Grid: Recent Transactions & AI Insight + Expense Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Recent Transactions (Span 2) */}
        <div className="lg:col-span-2">
          <RecentTransactions
            transactions={selectedPeriod === 'all' ? recentTransactions : filteredTxs}
            onViewAll={onOpenTransactions}
            onSelectTransaction={onSelectTransaction}
          />
        </div>

        {/* Right Column: AI Quick Insight & Category Breakdown (Span 1) */}
        <div className="space-y-6">
          <QuickInsightCard
            summary={activeSummary}
            topExpenses={activeExpenseBreakdown}
            onOpenAi={onOpenAi}
          />

          {/* Breakdown Pengeluaran Berdasarkan Kategori */}
          <div id="section-category-breakdown" className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <div className="flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-rose-500" />
                <h3 className="text-sm font-bold text-slate-900">Breakdown Pengeluaran</h3>
              </div>
              <span className="text-[11px] text-slate-400">
                {periodLabels[selectedPeriod]}
              </span>
            </div>

            {topExpenses.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">
                Belum ada pengeluaran pada periode {periodLabels[selectedPeriod].toLowerCase()}.
              </p>
            ) : (
              <div className="space-y-3">
                {topExpenses.map((cat) => (
                  <div key={cat.category} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-700 truncate">{cat.category}</span>
                      <span className="font-bold text-slate-900">{formatRupiah(cat.amount)}</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden flex">
                      <div
                        className="bg-rose-500 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(cat.percentage, 100)}%` }}
                      />
                    </div>
                    <div className="text-[10px] text-slate-400 text-right">
                      {cat.percentage.toFixed(1)}% dari total pengeluaran
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

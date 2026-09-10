import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  PieChart, 
  ArrowUpRight, 
  ArrowDownRight, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { FinancialSummary, CategoryBreakdown } from '../../types';
import { formatRupiah } from '../../utils/currency';

interface CashFlowMetricCardsProps {
  summary: FinancialSummary;
  prevSummary: FinancialSummary;
  topExpenseCategory: CategoryBreakdown | null;
  periodLabel: string;
}

export const CashFlowMetricCards: React.FC<CashFlowMetricCardsProps> = ({
  summary,
  prevSummary,
  topExpenseCategory,
  periodLabel
}) => {
  const { totalIncome, totalExpense, netCashFlow } = summary;
  const isSurplus = netCashFlow >= 0;

  // 1. Tren Pemasukan (Apakah pemasukan meningkat?)
  let incomeGrowthPercent: number | null = null;
  if (prevSummary.totalIncome > 0) {
    incomeGrowthPercent = ((totalIncome - prevSummary.totalIncome) / prevSummary.totalIncome) * 100;
  } else if (totalIncome > 0 && prevSummary.totalIncome === 0) {
    incomeGrowthPercent = 100;
  }

  // 2. Tren Pengeluaran (Apakah pengeluaran meningkat?)
  let expenseGrowthPercent: number | null = null;
  if (prevSummary.totalExpense > 0) {
    expenseGrowthPercent = ((totalExpense - prevSummary.totalExpense) / prevSummary.totalExpense) * 100;
  } else if (totalExpense > 0 && prevSummary.totalExpense === 0) {
    expenseGrowthPercent = 100;
  }

  // Rasio Beban Pengeluaran thd Pemasukan
  const expenseRatio = totalIncome > 0 
    ? ((totalExpense / totalIncome) * 100).toFixed(1) 
    : (totalExpense > 0 ? '100+' : '0');

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Total Pemasukan & Tren */}
      <div id="metric-cashflow-income" className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">1. Total Pemasukan</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black text-emerald-700">
            {formatRupiah(totalIncome)}
          </div>
        </div>

        {/* Jawaban: Apakah pemasukan meningkat? */}
        <div className="mt-3 pt-2.5 border-t border-slate-100 text-xs">
          {incomeGrowthPercent !== null ? (
            <div className="flex items-center gap-1.5">
              {incomeGrowthPercent >= 0 ? (
                <span className="inline-flex items-center gap-0.5 text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  +{incomeGrowthPercent.toFixed(1)}%
                </span>
              ) : (
                <span className="inline-flex items-center gap-0.5 text-rose-700 font-bold bg-rose-50 px-1.5 py-0.5 rounded">
                  <ArrowDownRight className="w-3.5 h-3.5" />
                  {incomeGrowthPercent.toFixed(1)}%
                </span>
              )}
              <span className="text-slate-500 text-[11px] truncate">
                {incomeGrowthPercent >= 0 ? 'Pemasukan meningkat' : 'Pemasukan menurun'} vs periode lalu
              </span>
            </div>
          ) : (
            <span className="text-slate-400 text-[11px]">
              Belum ada data pembanding sebelumnya
            </span>
          )}
        </div>
      </div>

      {/* 2. Total Pengeluaran & Tren */}
      <div id="metric-cashflow-expense" className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">2. Total Pengeluaran</span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black text-rose-700">
            {formatRupiah(totalExpense)}
          </div>
        </div>

        {/* Jawaban: Apakah pengeluaran meningkat? */}
        <div className="mt-3 pt-2.5 border-t border-slate-100 text-xs">
          {expenseGrowthPercent !== null ? (
            <div className="flex items-center gap-1.5">
              {expenseGrowthPercent > 0 ? (
                <span className="inline-flex items-center gap-0.5 text-rose-700 font-bold bg-rose-50 px-1.5 py-0.5 rounded">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  +{expenseGrowthPercent.toFixed(1)}%
                </span>
              ) : (
                <span className="inline-flex items-center gap-0.5 text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">
                  <ArrowDownRight className="w-3.5 h-3.5" />
                  {expenseGrowthPercent.toFixed(1)}%
                </span>
              )}
              <span className="text-slate-500 text-[11px] truncate">
                {expenseGrowthPercent > 0 ? 'Pengeluaran naik' : 'Pengeluaran lebih hemat'} vs periode lalu
              </span>
            </div>
          ) : (
            <span className="text-slate-400 text-[11px]">
              Belum ada data pembanding sebelumnya
            </span>
          )}
        </div>
      </div>

      {/* 3. Arus Kas Bersih (Bagaimana kondisi arus kas saya?) */}
      <div id="metric-cashflow-net" className={`rounded-2xl border p-5 shadow-xs flex flex-col justify-between ${
        isSurplus ? 'bg-emerald-50/40 border-emerald-200' : 'bg-rose-50/40 border-rose-200'
      }`}>
        <div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700">3. Arus Kas Bersih</span>
            <span className={`text-[11px] px-2 py-0.5 rounded-full font-bold border ${
              isSurplus 
                ? 'bg-emerald-100 text-emerald-800 border-emerald-300' 
                : 'bg-rose-100 text-rose-800 border-rose-300'
            }`}>
              {isSurplus ? 'Surplus' : 'Defisit'}
            </span>
          </div>
          <div className={`mt-2 text-2xl font-black ${isSurplus ? 'text-emerald-700' : 'text-rose-700'}`}>
            {isSurplus ? '+' : ''}{formatRupiah(netCashFlow)}
          </div>
        </div>

        <div className="mt-3 pt-2.5 border-t border-slate-200/60 text-xs text-slate-600 flex items-center gap-1.5">
          {isSurplus ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="truncate">Kas sehat, surplus <strong>{formatRupiah(netCashFlow)}</strong></span>
            </>
          ) : (
            <>
              <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
              <span className="truncate">Defisit, pengeluaran {expenseRatio}% dari omzet</span>
            </>
          )}
        </div>
      </div>

      {/* 4. Kategori Pengeluaran Terbesar (Kategori apa yang paling banyak menghabiskan uang?) */}
      <div id="metric-cashflow-top-category" className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">4. Pos Pengeluaran Terbesar</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <PieChart className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-base font-black text-slate-900 truncate">
            {topExpenseCategory ? topExpenseCategory.category : 'Belum Ada Data'}
          </div>
          <div className="text-xs font-bold text-rose-600 mt-0.5">
            {topExpenseCategory ? formatRupiah(topExpenseCategory.amount) : 'Rp 0'}
          </div>
        </div>

        <div className="mt-3 pt-2.5 border-t border-slate-100 text-[11px] text-slate-500 truncate">
          {topExpenseCategory ? (
            <span>Menghabiskan <strong>{topExpenseCategory.percentage.toFixed(1)}%</strong> dari total pengeluaran</span>
          ) : (
            <span>Belum ada catatan pengeluaran</span>
          )}
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { BarChart3, TrendingUp, TrendingDown, CheckCircle2, AlertCircle } from 'lucide-react';
import { FinancialSummary, PeriodFilterType } from '../../types';
import { formatRupiah } from '../../utils/currency';

interface IncomeExpenseChartProps {
  summary: FinancialSummary;
  selectedPeriod: PeriodFilterType;
  periodLabel: string;
}

export const IncomeExpenseChart: React.FC<IncomeExpenseChartProps> = ({
  summary,
  periodLabel
}) => {
  const { totalIncome, totalExpense, netCashFlow } = summary;
  const isSurplus = netCashFlow >= 0;
  
  // Deterministic calculation of chart heights
  const maxVal = Math.max(totalIncome, totalExpense, 1);
  const incomePercent = totalIncome > 0 ? (totalIncome / maxVal) * 100 : 0;
  const expensePercent = totalExpense > 0 ? (totalExpense / maxVal) * 100 : 0;

  const expenseRatio = totalIncome > 0 
    ? ((totalExpense / totalIncome) * 100).toFixed(1) 
    : (totalExpense > 0 ? '100+' : '0');

  const isEmpty = totalIncome === 0 && totalExpense === 0;

  return (
    <div id="chart-income-vs-expense" className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <BarChart3 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-900">
              Grafik Pemasukan vs Pengeluaran
            </h3>
            <p className="text-[11px] text-slate-500">
              Periode: <strong className="text-slate-700">{periodLabel}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-bold border ${
            isSurplus
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : 'bg-rose-50 text-rose-700 border-rose-200'
          }`}>
            {isSurplus ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
            )}
            <span>{isSurplus ? 'Surplus Kas' : 'Defisit Kas'}</span>
          </span>
        </div>
      </div>

      {isEmpty ? (
        <div className="py-12 text-center">
          <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mb-3">
            <BarChart3 className="w-6 h-6" />
          </div>
          <p className="text-xs font-semibold text-slate-600">Belum ada transaksi pada periode ini</p>
          <p className="text-[11px] text-slate-400 mt-1">Catat transaksi baru untuk melihat visualisasi arus kas.</p>
        </div>
      ) : (
        <div className="pt-6 pb-2">
          {/* Visual Bars Comparison */}
          <div className="h-52 flex items-end justify-center gap-10 sm:gap-20 px-4 border-b border-slate-200 pb-3">
            {/* Pemasukan Bar */}
            <div className="flex flex-col items-center gap-2 w-28">
              <span className="text-xs font-black text-emerald-700 text-center">
                {formatRupiah(totalIncome)}
              </span>
              <div className="w-full bg-emerald-50 rounded-t-xl overflow-hidden h-44 flex items-end border border-emerald-100">
                <div
                  className="w-full bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t-xl transition-all duration-500 shadow-xs"
                  style={{ height: `${Math.max(incomePercent, 6)}%` }}
                />
              </div>
              <div className="flex items-center gap-1 text-xs font-bold text-slate-800">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                <span>Pemasukan</span>
              </div>
            </div>

            {/* Pengeluaran Bar */}
            <div className="flex flex-col items-center gap-2 w-28">
              <span className="text-xs font-black text-rose-700 text-center">
                {formatRupiah(totalExpense)}
              </span>
              <div className="w-full bg-rose-50 rounded-t-xl overflow-hidden h-44 flex items-end border border-rose-100">
                <div
                  className="w-full bg-gradient-to-t from-rose-600 to-rose-400 rounded-t-xl transition-all duration-500 shadow-xs"
                  style={{ height: `${Math.max(expensePercent, 6)}%` }}
                />
              </div>
              <div className="flex items-center gap-1 text-xs font-bold text-slate-800">
                <TrendingDown className="w-3.5 h-3.5 text-rose-600" />
                <span>Pengeluaran</span>
              </div>
            </div>
          </div>

          {/* Quick Ratio & Insights */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-slate-500 text-[11px] block">Rasio Beban Usaha</span>
              <span className="font-bold text-slate-800 text-sm">{expenseRatio}%</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Pengeluaran dibanding pemasukan</span>
            </div>
            
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-slate-500 text-[11px] block">Arus Kas Bersih</span>
              <span className={`font-bold text-sm ${isSurplus ? 'text-emerald-700' : 'text-rose-700'}`}>
                {isSurplus ? '+' : ''}{formatRupiah(netCashFlow)}
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Sisa kas periode ini</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-slate-500 text-[11px] block">Rata-rata per Transaksi</span>
              <span className="font-bold text-slate-800 text-sm">
                {formatRupiah(summary.averageTransaction)}
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Dari total {summary.transactionCount} transaksi</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

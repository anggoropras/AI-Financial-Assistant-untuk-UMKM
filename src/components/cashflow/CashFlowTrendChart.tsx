import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  HelpCircle, 
  CheckCircle2, 
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { CashFlowTrendPoint, FinancialSummary } from '../../types';
import { formatRupiah } from '../../utils/currency';

interface CashFlowTrendChartProps {
  trendPoints: CashFlowTrendPoint[];
  periodLabel: string;
  summary: FinancialSummary;
  prevSummary: FinancialSummary;
}

export const CashFlowTrendChart: React.FC<CashFlowTrendChartProps> = ({
  trendPoints,
  periodLabel,
  summary,
  prevSummary
}) => {
  const [activePointIndex, setActivePointIndex] = useState<number | null>(null);

  const { totalIncome, totalExpense, netCashFlow } = summary;
  const isSurplus = netCashFlow >= 0;

  // 1. Apakah pemasukan meningkat?
  const incomeGrowth = prevSummary.totalIncome > 0
    ? ((totalIncome - prevSummary.totalIncome) / prevSummary.totalIncome) * 100
    : (totalIncome > 0 ? 100 : 0);
  const isIncomeGrowing = incomeGrowth >= 0;

  // 2. Apakah pengeluaran meningkat?
  const expenseGrowth = prevSummary.totalExpense > 0
    ? ((totalExpense - prevSummary.totalExpense) / prevSummary.totalExpense) * 100
    : (totalExpense > 0 ? 100 : 0);
  const isExpenseGrowing = expenseGrowth > 0;

  // Find max value across all trend points for responsive scaling
  let maxBarValue = Math.max(
    ...trendPoints.map((p) => Math.max(p.income, p.expense)),
    1
  );

  const isEmpty = trendPoints.length === 0 || (totalIncome === 0 && totalExpense === 0);

  return (
    <div id="chart-cashflow-trend" className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <BarChart3 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-900">
              Grafik Tren Arus Kas: Pemasukan vs Pengeluaran
            </h3>
            <p className="text-[11px] text-slate-500">
              Periode: <strong className="text-slate-700">{periodLabel}</strong>
            </p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs font-semibold">
          <div className="flex items-center gap-1.5 text-slate-700">
            <span className="w-3 h-3 rounded-xs bg-emerald-500" />
            <span>Pemasukan</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-700">
            <span className="w-3 h-3 rounded-xs bg-rose-500" />
            <span>Pengeluaran</span>
          </div>
        </div>
      </div>

      {/* Direct Business Questions & Answers Panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-slate-50 rounded-xl p-3.5 border border-slate-100 text-xs">
        {/* Tanya 1: Apakah pemasukan meningkat? */}
        <div className="p-3 bg-white rounded-lg border border-slate-200/70 space-y-1">
          <div className="flex items-center gap-1.5 text-slate-500 font-medium text-[11px]">
            <HelpCircle className="w-3.5 h-3.5 text-blue-500" />
            <span>Apakah pemasukan meningkat?</span>
          </div>
          <div className="flex items-center gap-1.5 pt-0.5">
            {isIncomeGrowing ? (
              <span className="inline-flex items-center gap-0.5 text-emerald-700 font-bold text-xs bg-emerald-50 px-1.5 py-0.5 rounded">
                <ArrowUpRight className="w-3.5 h-3.5" />
                Meningkat ({incomeGrowth > 0 ? `+${incomeGrowth.toFixed(1)}%` : 'Stabil'})
              </span>
            ) : (
              <span className="inline-flex items-center gap-0.5 text-rose-700 font-bold text-xs bg-rose-50 px-1.5 py-0.5 rounded">
                <ArrowDownRight className="w-3.5 h-3.5" />
                Menurun ({incomeGrowth.toFixed(1)}%)
              </span>
            )}
          </div>
          <p className="text-[10px] text-slate-400">
            {isIncomeGrowing ? 'Pendapatan naik dibanding periode lalu.' : 'Perlu evaluasi strategi penjualan.'}
          </p>
        </div>

        {/* Tanya 2: Apakah pengeluaran meningkat? */}
        <div className="p-3 bg-white rounded-lg border border-slate-200/70 space-y-1">
          <div className="flex items-center gap-1.5 text-slate-500 font-medium text-[11px]">
            <HelpCircle className="w-3.5 h-3.5 text-blue-500" />
            <span>Apakah pengeluaran meningkat?</span>
          </div>
          <div className="flex items-center gap-1.5 pt-0.5">
            {isExpenseGrowing ? (
              <span className="inline-flex items-center gap-0.5 text-rose-700 font-bold text-xs bg-rose-50 px-1.5 py-0.5 rounded">
                <ArrowUpRight className="w-3.5 h-3.5" />
                Meningkat (+{expenseGrowth.toFixed(1)}%)
              </span>
            ) : (
              <span className="inline-flex items-center gap-0.5 text-emerald-700 font-bold text-xs bg-emerald-50 px-1.5 py-0.5 rounded">
                <ArrowDownRight className="w-3.5 h-3.5" />
                Terkendali ({expenseGrowth.toFixed(1)}%)
              </span>
            )}
          </div>
          <p className="text-[10px] text-slate-400">
            {isExpenseGrowing ? 'Waspadai kenaikan biaya operasional.' : 'Pengeluaran lebih efisien dari sebelumnya.'}
          </p>
        </div>

        {/* Tanya 3: Bagaimana kondisi arus kas saya? */}
        <div className="p-3 bg-white rounded-lg border border-slate-200/70 space-y-1">
          <div className="flex items-center gap-1.5 text-slate-500 font-medium text-[11px]">
            <HelpCircle className="w-3.5 h-3.5 text-blue-500" />
            <span>Bagaimana kondisi arus kas saya?</span>
          </div>
          <div className="flex items-center gap-1.5 pt-0.5">
            {isSurplus ? (
              <span className="inline-flex items-center gap-1 text-emerald-700 font-bold text-xs bg-emerald-50 px-1.5 py-0.5 rounded">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Surplus (+{formatRupiah(netCashFlow)})
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-rose-700 font-bold text-xs bg-rose-50 px-1.5 py-0.5 rounded">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                Defisit ({formatRupiah(netCashFlow)})
              </span>
            )}
          </div>
          <p className="text-[10px] text-slate-400">
            {isSurplus ? 'Arus kas sehat, uang masuk melebihi beban.' : 'Biaya melampaui omzet penjualan.'}
          </p>
        </div>
      </div>

      {isEmpty ? (
        <div className="py-14 text-center">
          <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mb-2.5">
            <BarChart3 className="w-6 h-6 stroke-1" />
          </div>
          <p className="text-xs font-bold text-slate-700">Belum ada pergerakan transaksi pada periode ini</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Catat transaksi untuk melihat visualisasi tren pemasukan dan pengeluaran.</p>
        </div>
      ) : (
        <div>
          {/* Trend Bar Chart */}
          <div className="h-60 pt-4 pb-2 flex items-end justify-between gap-2 sm:gap-4 overflow-x-auto border-b border-slate-200 px-2">
            {trendPoints.map((pt, idx) => {
              const incomeHeight = maxBarValue > 0 ? (pt.income / maxBarValue) * 100 : 0;
              const expenseHeight = maxBarValue > 0 ? (pt.expense / maxBarValue) * 100 : 0;
              const isPointSurplus = pt.netCashFlow >= 0;
              const isHovered = activePointIndex === idx;

              return (
                <div
                  key={pt.label + idx}
                  className="flex-1 min-w-[54px] flex flex-col items-center h-full justify-end group cursor-pointer transition-all"
                  onMouseEnter={() => setActivePointIndex(idx)}
                  onMouseLeave={() => setActivePointIndex(null)}
                >
                  {/* Tooltip / Amount summary on hover */}
                  <div className={`text-[10px] font-bold text-center mb-1 transition-opacity ${
                    isHovered ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                  }`}>
                    <span className={isPointSurplus ? 'text-emerald-600' : 'text-rose-600'}>
                      {isPointSurplus ? '+' : ''}{formatRupiah(pt.netCashFlow)}
                    </span>
                  </div>

                  {/* Grouped Bars (Income & Expense) */}
                  <div className="w-full flex items-end justify-center gap-1 h-44 bg-slate-50/50 rounded-t-lg p-1 border-x border-t border-slate-100">
                    {/* Income Bar */}
                    <div className="flex-1 max-w-[20px] bg-emerald-100/70 rounded-t-sm h-full flex items-end">
                      <div
                        className="w-full bg-emerald-500 hover:bg-emerald-600 rounded-t-sm transition-all duration-300"
                        style={{ height: `${Math.max(incomeHeight, pt.income > 0 ? 6 : 0)}%` }}
                        title={`Pemasukan: ${formatRupiah(pt.income)}`}
                      />
                    </div>

                    {/* Expense Bar */}
                    <div className="flex-1 max-w-[20px] bg-rose-100/70 rounded-t-sm h-full flex items-end">
                      <div
                        className="w-full bg-rose-500 hover:bg-rose-600 rounded-t-sm transition-all duration-300"
                        style={{ height: `${Math.max(expenseHeight, pt.expense > 0 ? 6 : 0)}%` }}
                        title={`Pengeluaran: ${formatRupiah(pt.expense)}`}
                      />
                    </div>
                  </div>

                  {/* Label on X-Axis */}
                  <div className="mt-2 text-center">
                    <span className="text-[10px] font-bold text-slate-600 block truncate max-w-[65px]">
                      {pt.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Point Inspector Details */}
          {activePointIndex !== null && trendPoints[activePointIndex] && (
            <div className="mt-3 p-3 bg-blue-50/60 border border-blue-100 rounded-xl text-xs flex flex-wrap items-center justify-between gap-3 animate-in fade-in duration-150">
              <div className="font-bold text-blue-900">
                Detail: {trendPoints[activePointIndex].label}
              </div>
              <div className="flex items-center gap-4">
                <span className="text-emerald-700 font-semibold">
                  Masuk: {formatRupiah(trendPoints[activePointIndex].income)}
                </span>
                <span className="text-rose-700 font-semibold">
                  Keluar: {formatRupiah(trendPoints[activePointIndex].expense)}
                </span>
                <span className={`font-black ${
                  trendPoints[activePointIndex].netCashFlow >= 0 ? 'text-emerald-700' : 'text-rose-700'
                }`}>
                  Arus Bersih: {trendPoints[activePointIndex].netCashFlow >= 0 ? '+' : ''}{formatRupiah(trendPoints[activePointIndex].netCashFlow)}
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

import React from 'react';
import { Layers, AlertCircle, HelpCircle } from 'lucide-react';
import { CategoryBreakdown } from '../../types';
import { formatRupiah } from '../../utils/currency';

interface ExpenseCategoryChartProps {
  categories: CategoryBreakdown[];
  totalExpense: number;
  periodLabel: string;
}

export const ExpenseCategoryChart: React.FC<ExpenseCategoryChartProps> = ({
  categories,
  totalExpense,
  periodLabel
}) => {
  const topCategory = categories.length > 0 ? categories[0] : null;

  return (
    <div id="chart-expense-categories" className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-900">
              Breakdown Kategori Pengeluaran
            </h3>
            <p className="text-[11px] text-slate-500">
              Menjawab: <strong className="text-slate-700">Kategori apa yang paling banyak menghabiskan uang?</strong>
            </p>
          </div>
        </div>

        <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full self-start sm:self-auto">
          Total: {formatRupiah(totalExpense)}
        </span>
      </div>

      {/* Answer Highlight Box */}
      {topCategory && (
        <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-xs flex items-start gap-2.5">
          <HelpCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-amber-900">Pengeluaran Terbanyak: </span>
            <span className="text-amber-800">
              Pos <strong>{topCategory.category}</strong> merupakan beban terbesar usaha Anda pada periode ini, dengan total <strong>{formatRupiah(topCategory.amount)}</strong> ({topCategory.percentage.toFixed(1)}% dari seluruh pengeluaran).
            </span>
          </div>
        </div>
      )}

      {/* Categories Bar List */}
      {categories.length === 0 ? (
        <div className="py-12 text-center text-slate-400">
          <AlertCircle className="w-8 h-8 mx-auto stroke-1 mb-2 text-slate-300" />
          <p className="text-xs font-semibold text-slate-600">Belum ada catatan pengeluaran</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Pengeluaran yang Anda catat akan otomatis dikelompokkan di sini.</p>
        </div>
      ) : (
        <div className="space-y-3.5 pt-1">
          {categories.map((cat, index) => (
            <div key={cat.category} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-slate-100 text-slate-500 font-bold text-[10px] flex items-center justify-center">
                    {index + 1}
                  </span>
                  <span className="font-bold text-slate-800">{cat.category}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-slate-900">{formatRupiah(cat.amount)}</span>
                  <span className="text-[11px] font-semibold text-slate-400 w-12 text-right">
                    {cat.percentage.toFixed(1)}%
                  </span>
                </div>
              </div>

              {/* Progress fill */}
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden flex">
                <div
                  className="bg-gradient-to-r from-rose-500 to-rose-400 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(cat.percentage, 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

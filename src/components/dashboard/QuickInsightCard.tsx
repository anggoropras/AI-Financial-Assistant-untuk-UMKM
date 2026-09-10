import React from 'react';
import { Sparkles, ArrowRight, Lightbulb, CheckCircle2, AlertTriangle } from 'lucide-react';
import { FinancialSummary, CategoryBreakdown } from '../../types';
import { formatRupiah } from '../../utils/currency';

interface QuickInsightCardProps {
  summary: FinancialSummary;
  topExpenses: CategoryBreakdown[];
  onOpenAi: () => void;
}

export const QuickInsightCard: React.FC<QuickInsightCardProps> = ({
  summary,
  topExpenses,
  onOpenAi
}) => {
  const isHealthy = summary.netCashFlow > 0;
  const topExpense = topExpenses[0];

  return (
    <div className="bg-gradient-to-br from-blue-50/70 to-indigo-50/50 rounded-xl border border-blue-100 p-5 shadow-xs flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 text-blue-900 font-bold text-sm">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>Kondisi Keuangan Usaha</span>
          </div>
          <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${
            isHealthy 
              ? 'bg-emerald-100/80 text-emerald-800 border-emerald-200' 
              : 'bg-amber-100/80 text-amber-800 border-amber-200'
          }`}>
            {isHealthy ? 'Kas Positif' : 'Perlu Perhatian'}
          </span>
        </div>

        <div className="space-y-2.5 text-xs text-slate-700">
          <div className="flex items-start gap-2">
            {isHealthy ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            )}
            <p>
              {isHealthy ? (
                <>
                  Pemasukan Anda lebih besar dari pengeluaran dengan surplus kas sebesar{' '}
                  <strong className="text-slate-900">{formatRupiah(summary.netCashFlow)}</strong>.
                </>
              ) : (
                <>
                  Pengeluaran saat ini melampaui pemasukan sebesar{' '}
                  <strong className="text-rose-700">{formatRupiah(Math.abs(summary.netCashFlow))}</strong>.
                </>
              )}
            </p>
          </div>

          {topExpense && (
            <div className="flex items-start gap-2">
              <Lightbulb className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <p>
                Pos pengeluaran terbesar adalah <strong>{topExpense.category}</strong> senilai{' '}
                <strong>{formatRupiah(topExpense.amount)}</strong> ({topExpense.percentage.toFixed(0)}% dari total pengeluaran).
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-5 pt-3 border-t border-blue-200/50 flex items-center justify-between">
        <span className="text-[11px] text-slate-500">Ingin analisa lebih dalam?</span>
        <button
          type="button"
          onClick={onOpenAi}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 hover:text-blue-800 cursor-pointer"
        >
          <span>Tanya AI Assistant</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

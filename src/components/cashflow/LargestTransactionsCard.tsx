import React from 'react';
import { Award, ArrowUpRight, ArrowDownLeft, Calendar } from 'lucide-react';
import { Transaction } from '../../types';
import { formatRupiah } from '../../utils/currency';
import { formatTanggalIndo } from '../../utils/date';
import { Badge } from '../common/Badge';

interface LargestTransactionsCardProps {
  transactions: Transaction[];
  onOpenNewTransaction: () => void;
}

export const LargestTransactionsCard: React.FC<LargestTransactionsCardProps> = ({
  transactions,
  onOpenNewTransaction
}) => {
  return (
    <div id="card-largest-transactions" className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
            <Award className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-900">
              Transaksi Terbesar
            </h3>
            <p className="text-[11px] text-slate-500">
              5 transaksi dengan perputaran dana tertinggi pada periode ini
            </p>
          </div>
        </div>
      </div>

      {transactions.length === 0 ? (
        <div className="py-12 text-center text-slate-400">
          <Calendar className="w-8 h-8 mx-auto stroke-1 mb-2 text-slate-300" />
          <p className="text-xs font-semibold text-slate-600">Belum ada transaksi</p>
          <button
            type="button"
            onClick={onOpenNewTransaction}
            className="mt-3 text-xs font-bold text-blue-600 hover:underline cursor-pointer"
          >
            + Catat transaksi baru
          </button>
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {transactions.map((tx, idx) => {
            const isIncome = tx.type === 'income';

            return (
              <div key={tx.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 font-black text-[11px] flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 truncate">
                        {tx.category}
                      </span>
                      <Badge type={tx.type}>
                        <span className="flex items-center gap-0.5 text-[10px]">
                          {isIncome ? (
                            <ArrowUpRight className="w-2.5 h-2.5" />
                          ) : (
                            <ArrowDownLeft className="w-2.5 h-2.5" />
                          )}
                          {isIncome ? 'Masuk' : 'Keluar'}
                        </span>
                      </Badge>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                      <span>{formatTanggalIndo(tx.date)}</span>
                      {tx.description && (
                        <>
                          <span>•</span>
                          <span className="truncate max-w-[180px] sm:max-w-xs">{tx.description}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className={`font-black text-sm block ${
                    isIncome ? 'text-emerald-700' : 'text-rose-700'
                  }`}>
                    {isIncome ? '+' : '-'}{formatRupiah(tx.amount)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

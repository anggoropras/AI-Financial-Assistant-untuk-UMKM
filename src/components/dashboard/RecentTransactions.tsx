import React from 'react';
import { ArrowUpRight, ArrowDownLeft, ArrowRight, ReceiptText } from 'lucide-react';
import { Transaction } from '../../types';
import { formatRupiah } from '../../utils/currency';
import { formatTanggalIndo } from '../../utils/date';
import { Badge } from '../common/Badge';

interface RecentTransactionsProps {
  transactions: Transaction[];
  onViewAll: () => void;
  onSelectTransaction: (tx: Transaction) => void;
}

export const RecentTransactions: React.FC<RecentTransactionsProps> = ({
  transactions,
  onViewAll,
  onSelectTransaction
}) => {
  const recent = transactions.slice(0, 5);

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-base font-bold text-slate-900">Transaksi Terbaru</h2>
          <p className="text-xs text-slate-500">Catatan keuangan paling akhir yang masuk</p>
        </div>
        <button
          type="button"
          onClick={onViewAll}
          className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
        >
          Lihat Semua
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {recent.length === 0 ? (
        <div className="py-10 text-center text-slate-400 flex flex-col items-center justify-center">
          <ReceiptText className="w-10 h-10 stroke-1 text-slate-300 mb-2" />
          <p className="text-sm font-medium text-slate-600">Belum ada transaksi</p>
          <p className="text-xs text-slate-400 mt-1">Catat transaksi pertama Anda untuk melihat ringkasan.</p>
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {recent.map((tx) => {
            const isIncome = tx.type === 'income';
            return (
              <div
                key={tx.id}
                onClick={() => onSelectTransaction(tx)}
                className="py-3 flex items-center justify-between hover:bg-slate-50/80 px-2 rounded-lg transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      isIncome ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                    }`}
                  >
                    {isIncome ? (
                      <ArrowUpRight className="w-4 h-4" />
                    ) : (
                      <ArrowDownLeft className="w-4 h-4" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-800 truncate">
                        {tx.category}
                      </span>
                      <Badge type={tx.type}>
                        {isIncome ? 'Pemasukan' : 'Pengeluaran'}
                      </Badge>
                    </div>
                    <div className="text-xs text-slate-500 truncate mt-0.5">
                      {tx.description || 'Tidak ada catatan'}
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0 pl-3">
                  <div
                    className={`text-sm font-bold ${
                      isIncome ? 'text-emerald-700' : 'text-rose-700'
                    }`}
                  >
                    {isIncome ? '+' : '-'}{formatRupiah(tx.amount)}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {formatTanggalIndo(tx.date)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

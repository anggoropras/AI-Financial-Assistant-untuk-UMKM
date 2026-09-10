import React from 'react';
import { Modal } from '../common/Modal';
import { Transaction } from '../../types';
import { formatRupiah } from '../../utils/currency';
import { formatTanggalIndo } from '../../utils/date';
import { AlertTriangle, Trash2 } from 'lucide-react';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  transaction: Transaction | null;
  onClose: () => void;
  onConfirm: (id: string) => void;
}

export const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  isOpen,
  transaction,
  onClose,
  onConfirm
}) => {
  if (!transaction) return null;

  const isIncome = transaction.type === 'income';

  return (
    <Modal
      id="modal-confirm-delete"
      isOpen={isOpen}
      onClose={onClose}
      title="Konfirmasi Hapus Transaksi"
    >
      <div className="space-y-4">
        <div className="flex items-start gap-3 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold">Apakah Anda yakin ingin menghapus transaksi ini?</p>
            <p className="text-rose-700 leading-relaxed">
              Tindakan ini akan menghapus data secara permanen dan otomatis memperbarui ringkasan keuangan usaha Anda.
            </p>
          </div>
        </div>

        {/* Transaction Details Box */}
        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Tanggal:</span>
            <span className="font-semibold text-slate-800">{formatTanggalIndo(transaction.date)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Jenis:</span>
            <span className={`font-bold px-2 py-0.5 rounded-md ${
              isIncome ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
            }`}>
              {isIncome ? 'Pemasukan' : 'Pengeluaran'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Kategori:</span>
            <span className="font-semibold text-slate-800">{transaction.category}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Nominal:</span>
            <span className={`font-black text-sm ${isIncome ? 'text-emerald-700' : 'text-rose-700'}`}>
              {isIncome ? '+' : '-'}{formatRupiah(transaction.amount)}
            </span>
          </div>
          {transaction.description && (
            <div className="flex items-start justify-between gap-3 pt-1 border-t border-slate-200">
              <span className="text-slate-500 shrink-0">Keterangan:</span>
              <span className="text-slate-700 text-right truncate">{transaction.description}</span>
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
          >
            Batal
          </button>
          <button
            type="button"
            id="btn-confirm-delete"
            onClick={() => onConfirm(transaction.id)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-xs cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Ya, Hapus Transaksi</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};

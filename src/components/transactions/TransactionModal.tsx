import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { 
  Transaction, 
  TransactionType, 
  INCOME_CATEGORIES, 
  EXPENSE_CATEGORIES 
} from '../../types';
import { getTodayDateString } from '../../utils/date';
import { parseRupiahInput, formatRupiah } from '../../utils/currency';
import { AlertCircle } from 'lucide-react';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    date: string;
    type: TransactionType;
    category: string;
    amount: number;
    description: string;
  }) => void;
  editingTransaction?: Transaction | null;
}

export const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editingTransaction
}) => {
  const [date, setDate] = useState<string>(getTodayDateString());
  const [type, setType] = useState<TransactionType>('income');
  const [category, setCategory] = useState<string>(INCOME_CATEGORIES[0]);
  const [amountStr, setAmountStr] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingTransaction) {
      setDate(editingTransaction.date);
      setType(editingTransaction.type);
      setCategory(editingTransaction.category);
      setAmountStr(String(editingTransaction.amount));
      setDescription(editingTransaction.description || '');
      setErrorMessage(null);
    } else {
      setDate(getTodayDateString());
      setType('income');
      setCategory(INCOME_CATEGORIES[0]);
      setAmountStr('');
      setDescription('');
      setErrorMessage(null);
    }
  }, [editingTransaction, isOpen]);

  // Update default category when type changes
  const handleTypeChange = (newType: TransactionType) => {
    setType(newType);
    if (newType === 'income') {
      setCategory(INCOME_CATEGORIES[0]);
    } else {
      setCategory(EXPENSE_CATEGORIES[0]);
    }
    setErrorMessage(null);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, '');
    setAmountStr(raw);
    if (errorMessage) setErrorMessage(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Validation: Type wajib dipilih
    if (!type || (type !== 'income' && type !== 'expense')) {
      setErrorMessage('Jenis transaksi wajib dipilih (Pemasukan atau Pengeluaran).');
      return;
    }

    // 2. Validation: Date wajib valid
    if (!date || date.trim() === '') {
      setErrorMessage('Tanggal transaksi wajib diisi.');
      return;
    }
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      setErrorMessage('Tanggal transaksi tidak valid.');
      return;
    }

    // 3. Validation: Category wajib dipilih
    if (!category || category.trim() === '') {
      setErrorMessage('Kategori transaksi wajib dipilih.');
      return;
    }

    // 4. Validation: Nominal wajib > 0
    const numericAmount = parseRupiahInput(amountStr);
    if (!numericAmount || numericAmount <= 0) {
      setErrorMessage('Nominal wajib diisi dan harus lebih dari Rp 0.');
      return;
    }

    setIsSubmitting(true);
    try {
      onSubmit({
        date,
        type,
        category,
        amount: numericAmount,
        description: description.trim() // Description opsional
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentCategories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
  const parsedAmount = parseRupiahInput(amountStr);

  return (
    <Modal
      id="modal-transaction"
      isOpen={isOpen}
      onClose={onClose}
      title={editingTransaction ? 'Edit Transaksi' : 'Tambah Transaksi'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {errorMessage && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Jenis Transaksi */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Pilih Jenis Transaksi <span className="text-rose-500">*</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              id="btn-select-income"
              onClick={() => handleTypeChange('income')}
              className={`py-2.5 px-4 rounded-xl border text-sm font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                type === 'income'
                  ? 'bg-emerald-50 border-emerald-500 text-emerald-700 shadow-xs ring-2 ring-emerald-500/20'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Pemasukan
            </button>
            <button
              type="button"
              id="btn-select-expense"
              onClick={() => handleTypeChange('expense')}
              className={`py-2.5 px-4 rounded-xl border text-sm font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                type === 'expense'
                  ? 'bg-rose-50 border-rose-500 text-rose-700 shadow-xs ring-2 ring-rose-500/20'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              Pengeluaran
            </button>
          </div>
        </div>

        {/* Tanggal */}
        <div>
          <label htmlFor="tx-date" className="block text-xs font-bold text-slate-700 mb-1.5">
            Tanggal Transaksi <span className="text-rose-500">*</span>
          </label>
          <input
            id="tx-date"
            type="date"
            value={date}
            onChange={(e) => {
              setDate(e.target.value);
              if (errorMessage) setErrorMessage(null);
            }}
            required
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        {/* Kategori */}
        <div>
          <label htmlFor="tx-category" className="block text-xs font-bold text-slate-700 mb-1.5">
            Kategori {type === 'income' ? 'Pemasukan' : 'Pengeluaran'} <span className="text-rose-500">*</span>
          </label>
          <select
            id="tx-category"
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              if (errorMessage) setErrorMessage(null);
            }}
            required
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
          >
            {currentCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Nominal */}
        <div>
          <label htmlFor="tx-amount" className="block text-xs font-bold text-slate-700 mb-1.5">
            Nominal (Rupiah) <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
              Rp
            </span>
            <input
              id="tx-amount"
              type="text"
              inputMode="numeric"
              placeholder="0"
              value={amountStr ? new Intl.NumberFormat('id-ID').format(parseInt(amountStr, 10)) : ''}
              onChange={handleAmountChange}
              required
              className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>
          {parsedAmount > 0 ? (
            <p className="text-[11px] text-slate-500 mt-1">
              Nominal terbaca: <strong className="text-slate-800">{formatRupiah(parsedAmount)}</strong>
            </p>
          ) : (
            <p className="text-[11px] text-slate-400 mt-1">
              Wajib bernilai lebih dari Rp 0
            </p>
          )}
        </div>

        {/* Deskripsi (Opsional) */}
        <div>
          <label htmlFor="tx-desc" className="block text-xs font-bold text-slate-700 mb-1.5">
            Deskripsi Transaksi <span className="text-slate-400 font-normal">(Opsional)</span>
          </label>
          <input
            id="tx-desc"
            type="text"
            placeholder="Contoh: Penjualan pesanan nasi kotak, beli bahan minyak..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Batal
          </button>
          <button
            id="btn-submit-transaction"
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-2 rounded-xl text-sm font-bold bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white shadow-xs shadow-blue-600/20 transition-all cursor-pointer"
          >
            {isSubmitting ? 'Menyimpan...' : (editingTransaction ? 'Simpan Perubahan' : 'Tambah Transaksi')}
          </button>
        </div>
      </form>
    </Modal>
  );
};

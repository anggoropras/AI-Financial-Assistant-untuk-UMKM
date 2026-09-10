import React, { useState } from 'react';
import { 
  Settings, 
  Store, 
  User, 
  Mail, 
  Database, 
  RotateCcw, 
  Trash2, 
  Download, 
  CheckCircle2, 
  ShieldCheck, 
  Layers
} from 'lucide-react';
import { UserProfile, Transaction } from '../../types';
import { transactionService } from '../../services/firebase/transactionService';

interface SettingsViewProps {
  currentUser: UserProfile | null;
  transactions: Transaction[];
  onReloadData: () => void;
  onOpenAuth: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  currentUser,
  transactions,
  onReloadData,
  onOpenAuth
}) => {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleResetData = () => {
    if (!currentUser) return;
    transactionService.resetToInitial(currentUser.id);
    onReloadData();
    setSuccessMessage('Data transaksi berhasil direset ke contoh awal demo akun Anda.');
    setTimeout(() => setSuccessMessage(null), 3500);
  };

  const handleClearAll = () => {
    if (!currentUser) return;
    if (window.confirm('Yakin ingin menghapus seluruh transaksi Anda? Tindakan ini tidak dapat dibatalkan.')) {
      transactionService.clearAll(currentUser.id);
      onReloadData();
      setSuccessMessage('Semua transaksi telah dikosongkan.');
      setTimeout(() => setSuccessMessage(null), 3500);
    }
  };

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(transactions, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `transaksi_afin_ai_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleExportCsv = () => {
    const headers = ['ID', 'Tanggal', 'Jenis', 'Kategori', 'Nominal', 'Keterangan'];
    const rows = transactions.map((t) => [
      t.id,
      t.date,
      t.type,
      `"${t.category}"`,
      t.amount,
      `"${(t.description || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `transaksi_afin_ai_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-blue-600" />
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Pengaturan & Profil Usaha
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Kelola data profil UMKM, ekspor pembukuan, dan kelola data transaksi
        </p>
      </div>

      {successMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Profil Usaha */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Store className="w-4 h-4 text-blue-600" />
            <h2 className="text-sm font-bold text-slate-900">Identitas Usaha UMKM</h2>
          </div>
          <button
            type="button"
            onClick={onOpenAuth}
            className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
          >
            Ganti / Keluar Akun
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-slate-400 font-medium">Nama Pemilik:</span>
            <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-slate-400" />
              {currentUser?.name || 'Budi Santoso'}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-slate-400 font-medium">Nama Toko / Usaha:</span>
            <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
              <Store className="w-3.5 h-3.5 text-blue-600" />
              {currentUser?.businessName || 'Warung Berkah Jaya'}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-slate-400 font-medium">Jenis Usaha:</span>
            <div className="font-semibold text-slate-800 text-sm">
              {currentUser?.businessType || 'Kuliner & Warung Sembako'}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-slate-400 font-medium">Email Terdaftar:</span>
            <div className="font-semibold text-slate-800 text-sm flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              {currentUser?.email || 'budi.santoso@warungberkah.id'}
            </div>
          </div>
        </div>
      </div>

      {/* Manajemen Data Transaksi */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="pb-3 border-b border-slate-100">
          <h2 className="text-sm font-bold text-slate-900">Penyimpanan & Ekspor Data</h2>
          <p className="text-xs text-slate-500">
            Saat ini terdapat <strong>{transactions.length}</strong> transaksi tersimpan pada akun Anda
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {/* Export CSV */}
          <button
            type="button"
            onClick={handleExportCsv}
            className="p-3.5 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 flex items-center gap-3 text-left transition-colors cursor-pointer"
          >
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-800">Unduh Format CSV (Excel)</div>
              <div className="text-[11px] text-slate-500">Ekspor untuk laporan pembukuan</div>
            </div>
          </button>

          {/* Export JSON */}
          <button
            type="button"
            onClick={handleExportJson}
            className="p-3.5 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 flex items-center gap-3 text-left transition-colors cursor-pointer"
          >
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-800">Unduh Format JSON</div>
              <div className="text-[11px] text-slate-500">Cadangan data struktur utuh</div>
            </div>
          </button>

          {/* Reset to initial mock */}
          <button
            type="button"
            onClick={handleResetData}
            className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/50 hover:bg-amber-100/50 flex items-center gap-3 text-left transition-colors cursor-pointer"
          >
            <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <RotateCcw className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-amber-900">Reset Data Demo Awal</div>
              <div className="text-[11px] text-amber-700">Muat ulang 8 transaksi contoh</div>
            </div>
          </button>

          {/* Clear all */}
          <button
            type="button"
            onClick={handleClearAll}
            className="p-3.5 rounded-xl border border-rose-200 bg-rose-50/50 hover:bg-rose-100/50 flex items-center gap-3 text-left transition-colors cursor-pointer"
          >
            <div className="w-9 h-9 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
              <Trash2 className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-rose-900">Kosongkan Semua Transaksi</div>
              <div className="text-[11px] text-rose-700">Hapus seluruh data saat ini</div>
            </div>
          </button>
        </div>
      </div>

      {/* Roadmap & Arsitektur Status */}
      <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
          <Layers className="w-4 h-4 text-blue-600" />
          <span>Status Rencana Pengembangan (Roadmap Sesuai Petunjuk)</span>
        </div>

        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white border border-emerald-200 text-slate-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <div>
              <strong className="text-emerald-900">Fase 1 (Selesai):</strong> Struktur proyek, UI Dashboard, Transaksi, Arus Kas, AI Assistant mock-rules, Navigasi responsif, kalkulasi matematis akurat.
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white border border-slate-200 text-slate-500">
            <ShieldCheck className="w-4 h-4 text-slate-400 shrink-0" />
            <div>
              <strong className="text-slate-700">Fase 2 (Berikutnya):</strong> Firebase Auth & Firestore rules multi-user persistence.
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white border border-slate-200 text-slate-500">
            <Database className="w-4 h-4 text-slate-400 shrink-0" />
            <div>
              <strong className="text-slate-700">Fase 3 (Berikutnya):</strong> Server-side Gemini 2.5 API integration dengan context grounding.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

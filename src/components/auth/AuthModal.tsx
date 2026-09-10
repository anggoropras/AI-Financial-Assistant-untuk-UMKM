import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { UserProfile } from '../../types';
import { authService } from '../../services/firebase/authService';
import { Store, User, Lock, Mail, Tag, ArrowRight } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (mode === 'login') {
        const user = await authService.login(email || 'budi.santoso@warungberkah.id', password);
        onSuccess(user);
        onClose();
      } else {
        if (!name || !businessName) {
          setError('Nama lengkap dan nama usaha wajib diisi.');
          setIsLoading(false);
          return;
        }
        const user = await authService.register(name, email, password, businessName);
        onSuccess(user);
        onClose();
      }
    } catch {
      setError('Gagal masuk ke sistem. Silakan coba kembali.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemo = async () => {
    setIsLoading(true);
    try {
      const user = await authService.login('budi.santoso@warungberkah.id', 'demo12345');
      onSuccess(user);
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      id="modal-auth"
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'login' ? 'Masuk ke Akun Usaha' : 'Daftar Akun UMKM Baru'}
      maxWidth="sm"
    >
      <div className="space-y-4">
        {/* Toggle Mode */}
        <div className="flex rounded-xl border border-slate-200 p-1 bg-slate-50">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setError(null);
            }}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
              mode === 'login' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            Masuk
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setError(null);
            }}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
              mode === 'register' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            Daftar Baru
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
            {error}
          </div>
        )}

        {/* Demo Fast Login */}
        <button
          type="button"
          onClick={handleQuickDemo}
          disabled={isLoading}
          className="w-full py-2.5 px-3 rounded-xl border border-blue-200 bg-blue-50/80 hover:bg-blue-100/70 text-blue-800 text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <Store className="w-4 h-4 text-blue-600" />
          <span>Gunakan Akun Demo (Warung Berkah Jaya)</span>
        </button>

        <div className="relative flex items-center justify-center">
          <div className="border-t border-slate-200 w-full" />
          <span className="bg-white px-2 text-[11px] text-slate-400 font-medium absolute">
            atau gunakan email
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {mode === 'register' && (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nama Pemilik Usaha
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Budi Santoso"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nama Usaha / Toko
                </label>
                <div className="relative">
                  <Store className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Warung Berkah Jaya"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Alamat Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="email@usaha.id"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Kata Sandi (Password)
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{mode === 'login' ? 'Masuk Sekarang' : 'Daftar Akun'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        <p className="text-[10px] text-slate-400 text-center leading-relaxed">
          Tahap 1: Autentikasi disimulasikan menggunakan Local State untuk demo antarmuka. Integrasi Firebase Auth aktif di Tahap berikutnya.
        </p>
      </div>
    </Modal>
  );
};

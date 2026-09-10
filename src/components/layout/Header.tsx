import React from 'react';
import { PlusCircle, Sparkles, User, LogIn, LogOut, Store } from 'lucide-react';
import { UserProfile } from '../../types';

interface HeaderProps {
  currentUser: UserProfile | null;
  onOpenNewTransaction: () => void;
  onOpenAuth: () => void;
  onLogout: () => void;
  onOpenLanding?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onOpenNewTransaction,
  onOpenAuth,
  onLogout,
  onOpenLanding
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 sm:px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-lg shadow-sm shadow-blue-500/20">
          AF
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-slate-900 tracking-tight text-lg">AFIN.AI</span>
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-100">
              <Sparkles className="w-3 h-3 text-blue-600" />
              UMKM Edition
            </span>
          </div>
          <p className="text-xs text-slate-500 hidden md:block">
            Asisten Keuangan Pintar untuk UMKM Indonesia
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {onOpenLanding && (
          <button
            type="button"
            onClick={onOpenLanding}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <span>Landing Page</span>
          </button>
        )}

        <button
          id="btn-quick-transaction"
          type="button"
          onClick={onOpenNewTransaction}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-semibold shadow-sm shadow-blue-600/20 transition-all cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span className="hidden sm:inline">Catat Transaksi</span>
          <span className="sm:hidden">Catat</span>
        </button>

        {currentUser ? (
          <div className="flex items-center gap-2 border-l border-slate-200 pl-2 sm:pl-3">
            <div className="hidden lg:flex flex-col text-right">
              <span className="text-xs font-bold text-slate-900 leading-tight flex items-center justify-end gap-1">
                <Store className="w-3 h-3 text-blue-600" />
                {currentUser.businessName}
              </span>
              <span className="text-[11px] text-slate-500">{currentUser.name}</span>
            </div>
            
            <button
              type="button"
              onClick={onLogout}
              title="Keluar / Ganti Akun"
              className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-200 transition-colors"
              aria-label="Keluar"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={onOpenAuth}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-300 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-colors"
          >
            <LogIn className="w-4 h-4" />
            <span>Masuk</span>
          </button>
        )}
      </div>
    </header>
  );
};

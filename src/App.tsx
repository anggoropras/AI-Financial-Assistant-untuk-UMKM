import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/layout/Header';
import { Sidebar, NavTab } from './components/layout/Sidebar';
import { MobileNav } from './components/layout/MobileNav';
import { DashboardView } from './components/dashboard/DashboardView';
import { TransactionList } from './components/transactions/TransactionList';
import { TransactionModal } from './components/transactions/TransactionModal';
import { CashFlowView } from './components/cashflow/CashFlowView';
import { AiAssistantView } from './components/ai/AiAssistantView';
import { SettingsView } from './components/settings/SettingsView';
import { AuthModal } from './components/auth/AuthModal';
import { LandingPageView } from './components/landing/LandingPageView';
import { Toast, ToastMessage } from './components/common/Toast';
import { ShieldCheck, Lock } from 'lucide-react';

import { Transaction, UserProfile, TransactionType } from './types';
import { authService } from './services/firebase/authService';
import { transactionService } from './services/firebase/transactionService';
import { calculateTotals, calculateCategoryBreakdown } from './utils/calculations';

export const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => authService.getCurrentUser());
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(false);

  // Modal & Toast states
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({
      id: `toast_${Date.now()}`,
      type,
      message
    });
  };

  // Load transactions for current user
  const loadTransactions = (userId?: string) => {
    const uid = userId || currentUser?.id;
    if (uid) {
      setIsLoadingTransactions(true);
      try {
        const data = transactionService.getTransactions(uid);
        setTransactions(data);
      } catch {
        showToast('Gagal memuat daftar transaksi.', 'error');
      } finally {
        setIsLoadingTransactions(false);
      }
    } else {
      setTransactions([]);
    }
  };

  useEffect(() => {
    if (currentUser) {
      loadTransactions(currentUser.id);
    } else {
      setTransactions([]);
    }
  }, [currentUser]);

  // Financial calculations (Reaktif otomatis saat transaksi berubah)
  const summary = useMemo(() => calculateTotals(transactions), [transactions]);
  const expenseBreakdown = useMemo(() => calculateCategoryBreakdown(transactions, 'expense'), [transactions]);

  // Handlers for transactions
  const handleOpenNewTransaction = () => {
    setEditingTransaction(null);
    setIsTransactionModalOpen(true);
  };

  const handleEditTransaction = (tx: Transaction) => {
    if (!currentUser || tx.userId !== currentUser.id) {
      showToast('Akses ditolak: Anda tidak memiliki wewenang untuk mengubah data transaksi ini.', 'error');
      return;
    }
    setEditingTransaction(tx);
    setIsTransactionModalOpen(true);
  };

  const handleSaveTransaction = (data: {
    date: string;
    type: TransactionType;
    category: string;
    amount: number;
    description: string;
  }) => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      showToast('Silakan masuk terlebih dahulu untuk mencatat transaksi.', 'info');
      return;
    }

    try {
      if (editingTransaction) {
        // Enforce ownership check in update
        const updated = transactionService.updateTransaction(editingTransaction.id, currentUser.id, data);
        if (updated) {
          showToast('Transaksi berhasil diperbarui!', 'success');
        } else {
          showToast('Transaksi tidak ditemukan.', 'error');
        }
      } else {
        transactionService.addTransaction({
          userId: currentUser.id,
          ...data
        });
        showToast('Transaksi baru berhasil dicatat!', 'success');
      }

      // Refresh data & recalculate dashboard otomatis
      loadTransactions(currentUser.id);
      setIsTransactionModalOpen(false);
      setEditingTransaction(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Terjadi kesalahan saat menyimpan transaksi.';
      showToast(msg, 'error');
    }
  };

  const handleDeleteTransaction = (id: string) => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      showToast('Silakan masuk terlebih dahulu.', 'error');
      return;
    }

    try {
      // Enforce ownership check in delete
      const success = transactionService.deleteTransaction(id, currentUser.id);
      if (success) {
        showToast('Transaksi berhasil dihapus.', 'success');
        loadTransactions(currentUser.id);
      } else {
        showToast('Gagal menghapus transaksi atau transaksi tidak ditemukan.', 'error');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Terjadi kesalahan saat menghapus transaksi.';
      showToast(msg, 'error');
    }
  };

  const handleLogout = async () => {
    await authService.logout();
    setCurrentUser(null);
    setIsAuthModalOpen(true);
    showToast('Anda telah berhasil keluar akun.', 'info');
  };

  const handleAuthSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    loadTransactions(user.id);
    showToast(`Selamat datang, ${user.name}!`, 'success');
  };

  if (activeTab === 'landing') {
    return (
      <LandingPageView
        onOpenApp={(tab) => {
          setActiveTab(tab || 'dashboard');
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col antialiased text-slate-900 selection:bg-blue-500 selection:text-white pb-16 md:pb-0">
      {/* Top Header */}
      <Header
        currentUser={currentUser}
        onOpenNewTransaction={handleOpenNewTransaction}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
        onOpenLanding={() => setActiveTab('landing')}
      />

      <div className="flex-1 flex w-full max-w-7xl mx-auto">
        {/* Desktop Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          transactionCount={transactions.length}
        />

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-y-auto">
          {!currentUser ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 text-center max-w-xl mx-auto shadow-xs my-8 space-y-5">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Akses Data Dilindungi & Terenkripsi
                </h2>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Sesuai standar perlindungan data finansial Afin.ai, catatan transaksi dan analisa arus kas usaha hanya dapat diakses setelah Anda masuk ke akun usaha yang sah.
                </p>
              </div>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setIsAuthModalOpen(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition-all cursor-pointer"
                >
                  <Lock className="w-4 h-4" />
                  <span>Masuk ke Akun Usaha Anda</span>
                </button>
              </div>
            </div>
          ) : (
            <>
              {activeTab === 'dashboard' && (
                <DashboardView
                  summary={summary}
                  recentTransactions={transactions}
                  allTransactions={transactions}
                  expenseBreakdown={expenseBreakdown}
                  currentUser={currentUser}
                  onOpenNewTransaction={handleOpenNewTransaction}
                  onOpenTransactions={() => setActiveTab('transactions')}
                  onOpenCashFlow={() => setActiveTab('cashflow')}
                  onOpenAi={() => setActiveTab('ai')}
                  onSelectTransaction={handleEditTransaction}
                />
              )}

              {activeTab === 'transactions' && (
                <TransactionList
                  transactions={transactions}
                  isLoading={isLoadingTransactions}
                  onOpenNew={handleOpenNewTransaction}
                  onEdit={handleEditTransaction}
                  onDelete={handleDeleteTransaction}
                />
              )}

              {activeTab === 'cashflow' && (
                <CashFlowView
                  transactions={transactions}
                  onOpenNewTransaction={handleOpenNewTransaction}
                />
              )}

              {activeTab === 'ai' && (
                <AiAssistantView
                  transactions={transactions}
                  currentUser={currentUser}
                />
              )}

              {activeTab === 'settings' && (
                <SettingsView
                  currentUser={currentUser}
                  transactions={transactions}
                  onReloadData={() => currentUser && loadTransactions(currentUser.id)}
                  onOpenAuth={() => setIsAuthModalOpen(true)}
                />
              )}
            </>
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav activeTab={activeTab} onSelectTab={setActiveTab} />

      {/* Transaction Modal (Add / Edit) */}
      <TransactionModal
        isOpen={isTransactionModalOpen}
        onClose={() => {
          setIsTransactionModalOpen(false);
          setEditingTransaction(null);
        }}
        onSubmit={handleSaveTransaction}
        editingTransaction={editingTransaction}
      />

      {/* Auth Modal (Login / Register) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />

      {/* Toast Feedback Notification */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
};

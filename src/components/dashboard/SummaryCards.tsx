import React from 'react';
import { TrendingUp, TrendingDown, Wallet, Scale, Hash } from 'lucide-react';
import { FinancialSummary } from '../../types';
import { formatRupiah } from '../../utils/currency';
import { StatCard } from '../common/StatCard';

interface SummaryCardsProps {
  summary: FinancialSummary;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({ summary }) => {
  const isNetPositive = summary.netCashFlow >= 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {/* 1. Total Pemasukan */}
      <StatCard
        id="card-total-income"
        title="Total Pemasukan"
        value={formatRupiah(summary.totalIncome)}
        icon={TrendingUp}
        variant="success"
        subtext="Uang masuk usaha"
        badgeText="Inflow"
      />

      {/* 2. Total Pengeluaran */}
      <StatCard
        id="card-total-expense"
        title="Total Pengeluaran"
        value={formatRupiah(summary.totalExpense)}
        icon={TrendingDown}
        variant="danger"
        subtext="Biaya & operasional"
        badgeText="Outflow"
      />

      {/* 3. Saldo */}
      <StatCard
        id="card-balance"
        title="Saldo"
        value={formatRupiah(summary.balance)}
        icon={Wallet}
        variant={summary.balance >= 0 ? 'primary' : 'danger'}
        subtext="Total pemasukan - pengeluaran"
        badgeText="Kas"
      />

      {/* 4. Arus Kas Bersih */}
      <StatCard
        id="card-net-cashflow"
        title="Arus Kas Bersih"
        value={formatRupiah(summary.netCashFlow)}
        icon={Scale}
        variant={isNetPositive ? 'success' : 'danger'}
        subtext={isNetPositive ? 'Kas dalam posisi surplus' : 'Pengeluaran melebihi pemasukan'}
        badgeText={isNetPositive ? 'Surplus' : 'Defisit'}
      />

      {/* 5. Jumlah Transaksi */}
      <StatCard
        id="card-transaction-count"
        title="Jumlah Transaksi"
        value={`${summary.transactionCount} Transaksi`}
        icon={Hash}
        variant="neutral"
        subtext={`Rata-rata: ${formatRupiah(summary.averageTransaction)}`}
        badgeText="Aktivitas"
      />
    </div>
  );
};

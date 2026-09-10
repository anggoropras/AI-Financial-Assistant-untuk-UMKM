export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  type: TransactionType;
  category: string;
  amount: number;
  description: string;
  createdAt: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  businessName: string;
  businessType: string;
}

export type PeriodFilterType = 'today' | 'this_week' | 'this_month' | 'all';
export type CashFlowPeriod = 'week' | 'month' | 'three_months' | 'custom';

export interface CashFlowTrendPoint {
  label: string;
  startDate: string;
  endDate: string;
  income: number;
  expense: number;
  netCashFlow: number;
}

export interface FinancialSummary {
  totalIncome: number;
  totalExpense: number;
  netCashFlow: number;
  balance: number;
  transactionCount: number;
  averageTransaction: number;
  incomeCount?: number;
  expenseCount?: number;
}

export interface PeriodSummary {
  periodKey?: PeriodFilterType;
  periodLabel: string;
  income: number;
  expense: number;
  netCashFlow: number;
  balance?: number;
  transactionCount?: number;
  averageTransaction?: number;
}

export interface CategoryBreakdown {
  category: string;
  amount: number;
  percentage: number;
  type: TransactionType;
}

export interface TransactionFilterOptions {
  searchQuery: string;
  type: 'all' | TransactionType;
  category: string;
  startDate: string;
  endDate: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  dataContextSummary?: {
    totalIncome: number;
    totalExpense: number;
    netCashFlow: number;
    topExpenseCategory?: string;
  };
}

export const INCOME_CATEGORIES = [
  'Penjualan',
  'Pendapatan Jasa',
  'Modal',
  'Lainnya'
] as const;

export const EXPENSE_CATEGORIES = [
  'Bahan Baku',
  'Operasional',
  'Transportasi',
  'Marketing',
  'Gaji',
  'Sewa',
  'Listrik/Internet',
  'Lainnya'
] as const;

export type IncomeCategory = typeof INCOME_CATEGORIES[number];
export type ExpenseCategory = typeof EXPENSE_CATEGORIES[number];

import { 
  Transaction, 
  FinancialSummary, 
  CategoryBreakdown, 
  PeriodSummary, 
  PeriodFilterType,
  CashFlowPeriod,
  CashFlowTrendPoint
} from '../types';
import { formatDateIso, formatDayMonthIndo, formatMonthYearIndo, formatTanggalIndo, parseLocalDate } from './date';

/**
 * FINANCIAL CALCULATION ENGINE (Deterministic, Rule-Based, Non-AI)
 * 
 * Formula:
 * - Total Pemasukan = SUM seluruh transaction.type = 'income'
 * - Total Pengeluaran = SUM seluruh transaction.type = 'expense'
 * - Saldo = Total Pemasukan - Total Pengeluaran
 * - Arus Kas Bersih = Total Pemasukan - Total Pengeluaran
 * - Jumlah Transaksi = COUNT(transactions)
 * - Rata-rata Transaksi = (Total Pemasukan + Total Pengeluaran) / Jumlah Transaksi
 * 
 * Tangani nilai kosong, nilai 0, dan array kosong dengan aman (tidak menghasilkan NaN atau Infinity).
 */
export function calculateTotals(transactions: Transaction[]): FinancialSummary {
  if (!transactions || !Array.isArray(transactions) || transactions.length === 0) {
    return {
      totalIncome: 0,
      totalExpense: 0,
      netCashFlow: 0,
      balance: 0,
      transactionCount: 0,
      averageTransaction: 0,
      incomeCount: 0,
      expenseCount: 0
    };
  }

  let totalIncome = 0;
  let totalExpense = 0;
  let incomeCount = 0;
  let expenseCount = 0;

  for (const tx of transactions) {
    const rawAmount = typeof tx.amount === 'number' ? tx.amount : parseFloat(String(tx.amount || 0));
    const safeAmount = Number.isFinite(rawAmount) ? Math.max(0, rawAmount) : 0;

    if (tx.type === 'income') {
      totalIncome += safeAmount;
      incomeCount += 1;
    } else if (tx.type === 'expense') {
      totalExpense += safeAmount;
      expenseCount += 1;
    }
  }

  // Formula Arus Kas Bersih & Saldo
  const netCashFlow = totalIncome - totalExpense;
  const balance = netCashFlow;
  const transactionCount = transactions.length;

  // Rata-rata transaksi aman dari division by zero
  const totalVolume = totalIncome + totalExpense;
  const averageTransaction = transactionCount > 0 ? Math.round(totalVolume / transactionCount) : 0;

  return {
    totalIncome,
    totalExpense,
    netCashFlow,
    balance,
    transactionCount,
    averageTransaction,
    incomeCount,
    expenseCount
  };
}

/**
 * Filter transaksi berdasarkan periode:
 * - 'today': Hari ini (YYYY-MM-DD lokal)
 * - 'this_week': Minggu ini (Senin s/d Minggu saat ini)
 * - 'this_month': Bulan ini (YYYY-MM saat ini)
 * - 'all': Semua waktu
 */
export function filterTransactionsByPeriod(
  transactions: Transaction[], 
  period: PeriodFilterType
): Transaction[] {
  if (!transactions || transactions.length === 0) return [];
  if (period === 'all') return transactions;

  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const todayStr = `${year}-${month}-${day}`;
  const currentMonthStr = `${year}-${month}`;

  if (period === 'today') {
    return transactions.filter(t => t.date === todayStr);
  }

  if (period === 'this_month') {
    return transactions.filter(t => t.date && t.date.startsWith(currentMonthStr));
  }

  if (period === 'this_week') {
    const dayOfWeek = now.getDay();
    const distanceToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    const monday = new Date(now);
    monday.setDate(now.getDate() - distanceToMonday);
    monday.setHours(0, 0, 0, 0);

    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    sunday.setHours(23, 59, 59, 999);

    const mondayStr = formatDateIso(monday);
    const sundayStr = formatDateIso(sunday);

    return transactions.filter(t => t.date && t.date >= mondayStr && t.date <= sundayStr);
  }

  return transactions;
}

/**
 * Filter khusus untuk Cash Flow:
 * - 'week': 7 hari terakhir
 * - 'month': bulan ini (atau 30 hari terakhir)
 * - 'three_months': 3 bulan terakhir (90 hari)
 * - 'custom': custom date range (startDate s/d endDate)
 * Mengembalikan transaksi periode sekarang DAN periode sebelumnya untuk analisis tren pertumbuhan.
 */
export function filterTransactionsByCashFlowPeriod(
  transactions: Transaction[],
  period: CashFlowPeriod,
  customStartDate?: string,
  customEndDate?: string
): {
  currentTransactions: Transaction[];
  previousTransactions: Transaction[];
  periodLabel: string;
  startDate: string;
  endDate: string;
} {
  if (!transactions) {
    return {
      currentTransactions: [],
      previousTransactions: [],
      periodLabel: '',
      startDate: '',
      endDate: ''
    };
  }

  const now = new Date();
  let currentStart: Date;
  let currentEnd: Date = new Date(now);
  let prevStart: Date;
  let prevEnd: Date;
  let periodLabel = '';

  if (period === 'week') {
    // 7 hari terakhir
    currentStart = new Date(now);
    currentStart.setDate(now.getDate() - 6);
    currentStart.setHours(0, 0, 0, 0);

    prevEnd = new Date(currentStart);
    prevEnd.setDate(currentStart.getDate() - 1);
    prevEnd.setHours(23, 59, 59, 999);

    prevStart = new Date(prevEnd);
    prevStart.setDate(prevEnd.getDate() - 6);
    prevStart.setHours(0, 0, 0, 0);

    periodLabel = '7 Hari Terakhir (Minggu)';
  } else if (period === 'month') {
    // Bulan berjalan (1 s/d akhir bulan ini)
    currentStart = new Date(now.getFullYear(), now.getMonth(), 1);
    currentEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    // Bulan sebelumnya
    prevStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    prevEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    periodLabel = `Bulan Ini (${formatMonthYearIndo(formatDateIso(currentStart))})`;
  } else if (period === 'three_months') {
    // 3 bulan terakhir
    currentStart = new Date(now.getFullYear(), now.getMonth() - 2, 1);
    currentEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    // 3 bulan sebelum itu
    prevStart = new Date(now.getFullYear(), now.getMonth() - 5, 1);
    prevEnd = new Date(now.getFullYear(), now.getMonth() - 2, 0);

    periodLabel = '3 Bulan Terakhir';
  } else {
    // Custom Date Range
    if (customStartDate && customEndDate) {
      let dStart = parseLocalDate(customStartDate);
      let dEnd = parseLocalDate(customEndDate);
      // Swap if user picked inverted range
      if (dStart.getTime() > dEnd.getTime()) {
        const tmp = dStart;
        dStart = dEnd;
        dEnd = tmp;
      }
      currentStart = dStart;
      currentEnd = dEnd;

      const diffTime = Math.max(86400000, currentEnd.getTime() - currentStart.getTime());
      prevEnd = new Date(currentStart.getTime() - (24 * 60 * 60 * 1000));
      prevStart = new Date(prevEnd.getTime() - diffTime);

      periodLabel = `${formatTanggalIndo(formatDateIso(currentStart))} - ${formatTanggalIndo(formatDateIso(currentEnd))}`;
    } else {
      currentStart = new Date(now.getFullYear(), now.getMonth(), 1);
      currentEnd = new Date(now);
      prevStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      prevEnd = new Date(now.getFullYear(), now.getMonth(), 0);
      periodLabel = 'Bulan Ini';
    }
  }

  const startIso = formatDateIso(currentStart);
  const endIso = formatDateIso(currentEnd);
  const prevStartIso = formatDateIso(prevStart);
  const prevEndIso = formatDateIso(prevEnd);

  const currentTransactions = transactions.filter(
    (t) => t.date && t.date >= startIso && t.date <= endIso
  );

  const previousTransactions = transactions.filter(
    (t) => t.date && t.date >= prevStartIso && t.date <= prevEndIso
  );

  return {
    currentTransactions,
    previousTransactions,
    periodLabel,
    startDate: startIso,
    endDate: endIso
  };
}

/**
 * Menghasilkan titik tren (trend points) kronologis untuk grafik pergerakan uang
 * Menjawab: "Apakah pemasukan/pengeluaran saya meningkat sepanjang waktu?"
 */
export function calculateCashFlowTrendPoints(
  transactions: Transaction[],
  period: CashFlowPeriod,
  startDateStr: string,
  endDateStr: string
): CashFlowTrendPoint[] {
  if (!startDateStr || !endDateStr) return [];

  const start = parseLocalDate(startDateStr);
  const end = parseLocalDate(endDateStr);
  const points: CashFlowTrendPoint[] = [];

  if (period === 'week') {
    // 7 hari (harian)
    const curr = new Date(start);
    while (curr <= end) {
      const dayIso = formatDateIso(curr);
      const label = formatDayMonthIndo(dayIso);
      const dayTxs = transactions.filter(t => t.date === dayIso);
      const totals = calculateTotals(dayTxs);

      points.push({
        label,
        startDate: dayIso,
        endDate: dayIso,
        income: totals.totalIncome,
        expense: totals.totalExpense,
        netCashFlow: totals.netCashFlow
      });
      curr.setDate(curr.getDate() + 1);
    }
  } else if (period === 'three_months') {
    // 3 bulan (per bulan)
    const curr = new Date(start.getFullYear(), start.getMonth(), 1);
    while (curr <= end) {
      const monthStartIso = formatDateIso(curr);
      const monthEnd = new Date(curr.getFullYear(), curr.getMonth() + 1, 0);
      const monthEndIso = formatDateIso(monthEnd);
      const label = formatMonthYearIndo(monthStartIso);

      const monthTxs = transactions.filter(
        t => t.date && t.date >= monthStartIso && t.date <= monthEndIso
      );
      const totals = calculateTotals(monthTxs);

      points.push({
        label,
        startDate: monthStartIso,
        endDate: monthEndIso,
        income: totals.totalIncome,
        expense: totals.totalExpense,
        netCashFlow: totals.netCashFlow
      });
      curr.setMonth(curr.getMonth() + 1);
    }
  } else {
    // Month atau Custom: Bagi menjadi 4 interval / segmen mingguan yang rapi
    const totalDays = Math.max(1, Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1);
    
    if (totalDays <= 10) {
      // Jika rentang singkat (<= 10 hari), tampilkan harian
      const curr = new Date(start);
      while (curr <= end) {
        const dayIso = formatDateIso(curr);
        const label = formatDayMonthIndo(dayIso);
        const dayTxs = transactions.filter(t => t.date === dayIso);
        const totals = calculateTotals(dayTxs);

        points.push({
          label,
          startDate: dayIso,
          endDate: dayIso,
          income: totals.totalIncome,
          expense: totals.totalExpense,
          netCashFlow: totals.netCashFlow
        });
        curr.setDate(curr.getDate() + 1);
      }
    } else {
      // Bagi ke 4 segmen (Minggu 1, Minggu 2, Minggu 3, Minggu 4)
      const segmentDays = Math.ceil(totalDays / 4);
      for (let i = 0; i < 4; i++) {
        const segStart = new Date(start);
        segStart.setDate(start.getDate() + i * segmentDays);
        if (segStart > end) break;

        const segEnd = new Date(start);
        segEnd.setDate(start.getDate() + (i + 1) * segmentDays - 1);
        const effectiveEnd = segEnd > end ? end : segEnd;

        const segStartIso = formatDateIso(segStart);
        const segEndIso = formatDateIso(effectiveEnd);
        const label = `Minggu ${i + 1} (${formatDayMonthIndo(segStartIso)})`;

        const segTxs = transactions.filter(
          t => t.date && t.date >= segStartIso && t.date <= segEndIso
        );
        const totals = calculateTotals(segTxs);

        points.push({
          label,
          startDate: segStartIso,
          endDate: segEndIso,
          income: totals.totalIncome,
          expense: totals.totalExpense,
          netCashFlow: totals.netCashFlow
        });
      }
    }
  }

  return points;
}

/**
 * Mendapatkan transaksi dengan nominal terbesar
 */
export function getLargestTransactions(
  transactions: Transaction[],
  limit = 5
): Transaction[] {
  if (!transactions || transactions.length === 0) return [];
  return [...transactions]
    .sort((a, b) => b.amount - a.amount)
    .slice(0, limit);
}

/**
 * Menghitung komposisi pengeluaran atau pemasukan berdasarkan kategori
 * Menghasilkan persentase akurat dan pengurutan deterministik (terbesar ke terkecil)
 */
export function calculateCategoryBreakdown(
  transactions: Transaction[], 
  type: 'income' | 'expense'
): CategoryBreakdown[] {
  if (!transactions || transactions.length === 0) return [];

  const filtered = transactions.filter((t) => t.type === type);
  if (filtered.length === 0) return [];

  let total = 0;
  const groupMap = new Map<string, number>();

  for (const t of filtered) {
    const raw = typeof t.amount === 'number' ? t.amount : parseFloat(String(t.amount || 0));
    const safeAmount = Number.isFinite(raw) ? Math.max(0, raw) : 0;
    
    total += safeAmount;
    const catName = t.category ? t.category.trim() : 'Lainnya';
    const prev = groupMap.get(catName) || 0;
    groupMap.set(catName, prev + safeAmount);
  }

  const result: CategoryBreakdown[] = [];
  for (const [category, amount] of groupMap.entries()) {
    result.push({
      category,
      amount,
      percentage: total > 0 ? (amount / total) * 100 : 0,
      type
    });
  }

  // Deterministic sort: amount descending, lalu nama kategori alfabetis
  return result.sort((a, b) => {
    if (b.amount !== a.amount) {
      return b.amount - a.amount;
    }
    return a.category.localeCompare(b.category);
  });
}

/**
 * Menghitung ringkasan lengkap untuk keempat periode (Hari ini, Minggu ini, Bulan ini, Semua waktu)
 */
export function calculatePeriodSummaries(transactions: Transaction[]): {
  today: PeriodSummary;
  this_week: PeriodSummary;
  this_month: PeriodSummary;
  all: PeriodSummary;
  week: PeriodSummary;
  month: PeriodSummary;
} {
  const calcForPeriod = (periodKey: PeriodFilterType, label: string): PeriodSummary => {
    const filteredTxs = filterTransactionsByPeriod(transactions, periodKey);
    const totals = calculateTotals(filteredTxs);
    return {
      periodKey,
      periodLabel: label,
      income: totals.totalIncome,
      expense: totals.totalExpense,
      netCashFlow: totals.netCashFlow,
      balance: totals.balance,
      transactionCount: totals.transactionCount,
      averageTransaction: totals.averageTransaction
    };
  };

  const today = calcForPeriod('today', 'Hari Ini');
  const this_week = calcForPeriod('this_week', 'Minggu Ini');
  const this_month = calcForPeriod('this_month', 'Bulan Ini');
  const all = calcForPeriod('all', 'Semua Waktu');

  return {
    today,
    this_week,
    this_month,
    all,
    week: this_week,
    month: this_month
  };
}

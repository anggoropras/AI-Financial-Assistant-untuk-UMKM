/**
 * Utility untuk memformat mata uang Rupiah
 * Contoh: 500000 -> "Rp500.000"
 */
export function formatRupiah(amount: number): string {
  const safeAmount = Number.isFinite(amount) ? Math.round(amount) : 0;
  const isNegative = safeAmount < 0;
  const absVal = Math.abs(safeAmount);

  const formatted = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
    minimumFractionDigits: 0
  }).format(absVal);

  // Standarisasi spasi: "Rp 500.000" -> "Rp500.000"
  const clean = formatted.replace(/\s+/g, '');
  return isNegative ? `-${clean}` : clean;
}

/**
 * Mengubah input teks pengguna menjadi angka
 * Contoh: "500.000" atau "500000" -> 500000
 */
export function parseRupiahInput(value: string): number {
  if (!value) return 0;
  const cleaned = value.replace(/[^0-9]/g, '');
  const parsed = parseInt(cleaned, 10);
  return Number.isNaN(parsed) ? 0 : parsed;
}

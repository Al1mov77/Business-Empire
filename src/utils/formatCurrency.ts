/**
 * formatCurrency — converts large numbers to compact human-readable strings.
 * e.g. 1500 → "$1.50K", 2500000 → "$2.50M"
 */
export function formatCurrency(value: number, showSign = false): string {
  const sign = showSign && value > 0 ? '+' : '';
  const abs = Math.abs(value);
  const negative = value < 0 ? '-' : '';

  if (abs >= 1e15) return `${sign}${negative}$${(abs / 1e15).toFixed(2)}Q`;
  if (abs >= 1e12) return `${sign}${negative}$${(abs / 1e12).toFixed(2)}T`;
  if (abs >= 1e9)  return `${sign}${negative}$${(abs / 1e9).toFixed(2)}B`;
  if (abs >= 1e6)  return `${sign}${negative}$${(abs / 1e6).toFixed(2)}M`;
  if (abs >= 1e3)  return `${sign}${negative}$${(abs / 1e3).toFixed(2)}K`;
  return `${sign}${negative}$${abs.toFixed(2)}`;
}

export function formatNumber(value: number): string {
  if (value >= 1e12) return `${(value / 1e12).toFixed(2)}T`;
  if (value >= 1e9)  return `${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6)  return `${(value / 1e6).toFixed(2)}M`;
  if (value >= 1e3)  return `${(value / 1e3).toFixed(2)}K`;
  return value.toFixed(2);
}

export function formatCrypto(value: number): string {
  if (value >= 1e6)  return `${(value / 1e6).toFixed(4)}M`;
  if (value >= 1e3)  return `${(value / 1e3).toFixed(4)}K`;
  return value.toFixed(6);
}

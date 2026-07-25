// Format large numbers (e.g. 1500 -> '1.5K', 2400000 -> '2.4M')
export function formatNumber(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
  return n.toString();
}

// Parse view string like '2.4M views' into a number for sorting
export function parseViewCount(viewStr) {
  const match = viewStr.match(/([\d.]+)([MKB]?)/i);
  if (!match) return 0;
  const num = parseFloat(match[1]);
  const suffix = match[2].toUpperCase();
  if (suffix === 'M') return num * 1000000;
  if (suffix === 'K') return num * 1000;
  if (suffix === 'B') return num * 1000000000;
  return num;
}

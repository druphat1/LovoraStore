const inr = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 });

export const formatINR = (n: number) => `₹${inr.format(Math.round(n))}`;

export const discountPct = (price: number, mrp: number) => (mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0);

export const pad2 = (n: number) => String(n).padStart(2, '0');

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' });

export const initials = (name = '') =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');

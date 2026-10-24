import { STORE } from '../config/store';

export const LUXURY_BOX_FEE = 49;

/** Minimal line shape pricing needs (CartItem satisfies it). */
export interface PricedLine {
  unitPrice: number;
  unitMrp: number;
  qty: number;
  kind: 'product' | 'hamper';
  category: string;
}

interface Coupon {
  code: string;
  label: string;
  min: number;
  compute: (lines: PricedLine[], subtotal: number) => number;
}

// Demo coupon rules. Real validation would happen server-side.
export const COUPONS: Record<string, Coupon> = {
  FIRSTGIFT: { code: 'FIRSTGIFT', label: '₹100 off your first order', min: 499, compute: () => 100 },
  BDAYLOVE: {
    code: 'BDAYLOVE',
    label: '20% off birthday gifts & hampers (up to ₹500)',
    min: 0,
    compute: (lines) => {
      const eligible = lines
        .filter((l) => l.kind === 'hamper' || ['birthday', 'hampers'].includes(l.category))
        .reduce((s, l) => s + l.unitPrice * l.qty, 0);
      return Math.min(500, Math.round(eligible * 0.2));
    },
  },
  FESTIVE10: { code: 'FESTIVE10', label: '10% off sitewide (up to ₹300)', min: 999, compute: (_l, subtotal) => Math.min(300, Math.round(subtotal * 0.1)) },
};

export interface CouponResult {
  ok: boolean;
  discount: number;
  message: string;
}

export function applyCoupon(code: string, lines: PricedLine[], subtotal: number): CouponResult {
  const c = COUPONS[code.trim().toUpperCase()];
  if (!c) return { ok: false, discount: 0, message: 'That code is not valid. Try BDAYLOVE or FIRSTGIFT.' };
  if (subtotal < c.min) return { ok: false, discount: 0, message: `${c.code} needs a minimum order of ₹${c.min}.` };
  const discount = c.compute(lines, subtotal);
  if (discount <= 0) return { ok: false, discount: 0, message: `${c.code} doesn't apply to the items in your bag.` };
  return { ok: true, discount, message: `${c.code} applied! −₹${discount} celebratory savings` };
}

export interface Totals {
  mrpTotal: number;
  subtotal: number;
  productDiscount: number;
  coupon: CouponResult | null;
  couponDiscount: number;
  delivery: number;
  grandTotal: number;
  savings: number;
  toFreeDelivery: number;
}

export function computeTotals(lines: PricedLine[], opts: { couponCode?: string; pickup?: boolean } = {}): Totals {
  const mrpTotal = lines.reduce((s, l) => s + l.unitMrp * l.qty, 0);
  const subtotal = lines.reduce((s, l) => s + l.unitPrice * l.qty, 0);
  const productDiscount = mrpTotal - subtotal;
  const coupon = opts.couponCode ? applyCoupon(opts.couponCode, lines, subtotal) : null;
  const couponDiscount = coupon?.ok ? coupon.discount : 0;
  const afterCoupon = Math.max(0, subtotal - couponDiscount);
  const freeDelivery = !!opts.pickup || afterCoupon >= STORE.freeShippingThreshold || lines.length === 0;
  const delivery = freeDelivery ? 0 : STORE.deliveryFee;
  return {
    mrpTotal,
    subtotal,
    productDiscount,
    coupon,
    couponDiscount,
    delivery,
    grandTotal: afterCoupon + delivery,
    savings: productDiscount + couponDiscount,
    toFreeDelivery: Math.max(0, STORE.freeShippingThreshold - afterCoupon),
  };
}

import { Injectable } from '@angular/core';
import { persistedSignal } from '../lib/persisted-signal';
import { Totals } from '../lib/pricing';

export type OrderStatus = 'placed' | 'packed' | 'dispatched' | 'delivered';

export const ORDER_STATUSES: { id: OrderStatus; label: string; icon: string }[] = [
  { id: 'placed', label: 'Order Placed', icon: 'receipt_long' },
  { id: 'packed', label: 'Gift Packed', icon: 'redeem' },
  { id: 'dispatched', label: 'Dispatched', icon: 'local_shipping' },
  { id: 'delivered', label: 'Delivered', icon: 'task_alt' },
];

export interface OrderLine {
  name: string;
  qty: number;
  unitPrice: number;
  image?: string;
  productId?: string;
  note?: string;
}

export interface Order {
  id: string;
  demo?: boolean;
  createdAt: string;
  deliveredAt?: string;
  status: OrderStatus;
  courier?: string;
  customer: { name: string; phone: string; pincode: string; address: string; landmark?: string };
  delivery: 'standard' | 'pickup';
  payment: 'online' | 'cod' | 'whatsapp';
  giftWrap?: boolean;
  userEmail?: string;
  lines: OrderLine[];
  totals: Partial<Totals> & { grandTotal: number };
}

const hoursAgo = (h: number) => new Date(Date.now() - h * 3_600_000).toISOString();

// Sample orders so the admin portal isn't empty on first load (flagged demo: true).
const SEED_ORDERS: Order[] = [
  {
    id: 'LGC-1082',
    demo: true,
    createdAt: hoursAgo(1),
    status: 'placed',
    customer: { name: 'Ananya R.', phone: '98XXXXXX01', pincode: '145001', address: 'Dhangu Road, Pathankot' },
    delivery: 'standard',
    payment: 'online',
    giftWrap: true,
    lines: [
      { name: 'DIY Ceramic Painting Kit', qty: 1, unitPrice: 399 },
      { name: 'Heart Foil Balloon', qty: 1, unitPrice: 149 },
    ],
    totals: { grandTotal: 548 },
  },
  {
    id: 'LGC-1081',
    demo: true,
    createdAt: hoursAgo(5),
    status: 'dispatched',
    courier: 'BlueDart #BD9842189IN',
    customer: { name: 'Vikram S.', phone: '98XXXXXX02', pincode: '143001', address: 'Lawrence Road, Amritsar' },
    delivery: 'standard',
    payment: 'cod',
    lines: [{ name: 'Gourmet Festive Hamper', qty: 1, unitPrice: 1699 }],
    totals: { grandTotal: 1699 },
  },
  {
    id: 'LGC-1080',
    demo: true,
    createdAt: hoursAgo(9),
    deliveredAt: hoursAgo(2),
    status: 'delivered',
    customer: { name: 'Meera K.', phone: '98XXXXXX03', pincode: '145001', address: 'Mission Road, Pathankot' },
    delivery: 'pickup',
    payment: 'online',
    lines: [{ name: 'Jumbo Cuddly Pastel Pink Teddy', qty: 1, unitPrice: 899 }],
    totals: { grandTotal: 899 },
  },
];

@Injectable({ providedIn: 'root' })
export class OrdersService {
  readonly orders = persistedSignal<Order[]>('orders', SEED_ORDERS);
  private counter = persistedSignal<number>('orderCounter', 1083);

  place(order: Omit<Order, 'id' | 'createdAt' | 'status'>): Order {
    const full: Order = { ...order, id: `LGC-${this.counter()}`, createdAt: new Date().toISOString(), status: 'placed' };
    this.counter.update((c) => c + 1);
    this.orders.update((os) => [full, ...os]);
    return full;
  }

  setStatus(id: string, status: OrderStatus) {
    this.orders.update((os) =>
      os.map((o) => (o.id === id ? { ...o, status, ...(status === 'delivered' ? { deliveredAt: new Date().toISOString() } : {}) } : o)),
    );
  }

  find(id: string) {
    return this.orders().find((o) => o.id.toLowerCase() === id.trim().toLowerCase());
  }
}

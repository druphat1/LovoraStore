import { computed, inject, Injectable } from '@angular/core';
import { cardImage, Product, PRODUCT_BY_ID } from '../data/products';
import { computeTotals, LUXURY_BOX_FEE } from '../lib/pricing';
import { persistedSignal } from '../lib/persisted-signal';
import { InventoryService } from './inventory.service';
import { ToastService } from './toast.service';

export interface GiftOptions {
  occasion: string;
  wrap: 'free' | 'luxury';
  note: string;
}

export interface HamperDetails {
  name: string;
  baseName: string;
  image: string;
  price: number;
  goodies: { name: string; qty: number; price: number }[];
  ribbon: string;
  bedding: string;
  card: { recipient: string; occasion: string; message: string; font: string };
}

export interface StoredLine {
  key: string;
  kind: 'product' | 'hamper';
  qty: number;
  productId?: string;
  options?: GiftOptions;
  hamper?: HamperDetails;
}

export interface CartItem extends StoredLine {
  name: string;
  image: string;
  unitPrice: number;
  unitMrp: number;
  category: string;
  link: string;
  product?: Product;
}

const DEFAULT_OPTIONS: GiftOptions = { occasion: '', wrap: 'free', note: '' };

const lineKey = (productId: string, o: GiftOptions) => [productId, o.occasion, o.wrap, o.note.trim()].join('|');

function resolve(line: StoredLine): CartItem | null {
  if (line.kind === 'hamper' && line.hamper) {
    const h = line.hamper;
    return { ...line, name: h.name, image: h.image, unitPrice: h.price, unitMrp: h.price, category: 'hampers', link: '/hamper-studio' };
  }
  const p = line.productId ? PRODUCT_BY_ID[line.productId] : undefined;
  if (!p) return null;
  const extra = line.options?.wrap === 'luxury' ? LUXURY_BOX_FEE : 0;
  return {
    ...line,
    name: p.shortName,
    image: cardImage(p),
    unitPrice: p.price + extra,
    unitMrp: p.mrp + extra,
    category: p.category,
    link: `/product/${p.id}`,
    product: p,
  };
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private inventory = inject(InventoryService);
  private toast = inject(ToastService);

  private lines = persistedSignal<StoredLine[]>('cart', []);
  private saved = persistedSignal<StoredLine[]>('saved', []);
  readonly couponCode = persistedSignal<string>('coupon', '');

  readonly items = computed(() => this.lines().map(resolve).filter((x): x is CartItem => !!x));
  readonly savedItems = computed(() => this.saved().map(resolve).filter((x): x is CartItem => !!x));
  readonly count = computed(() => this.items().reduce((s, l) => s + l.qty, 0));
  readonly totals = computed(() => computeTotals(this.items(), { couponCode: this.couponCode() }));

  qtyInCart(productId: string) {
    return this.lines()
      .filter((l) => l.productId === productId)
      .reduce((s, l) => s + l.qty, 0);
  }

  addProduct(productId: string, qty = 1, options: Partial<GiftOptions> = {}, silent = false): boolean {
    const p = PRODUCT_BY_ID[productId];
    if (!p) return false;
    const stock = this.inventory.get(productId);
    if (this.qtyInCart(productId) + qty > stock) {
      this.toast.show({
        title: stock === 0 ? 'Out of stock' : `Only ${stock} in stock`,
        message: stock === 0 ? `${p.shortName} will be back soon.` : 'You already have the maximum in your bag.',
        icon: 'inventory_2',
        tone: 'error',
      });
      return false;
    }
    const opts = { ...DEFAULT_OPTIONS, ...options };
    const key = lineKey(productId, opts);
    this.lines.update((ls) =>
      ls.some((l) => l.key === key)
        ? ls.map((l) => (l.key === key ? { ...l, qty: l.qty + qty } : l))
        : [...ls, { key, kind: 'product', productId, qty, options: opts }],
    );
    if (!silent) this.toast.show({ title: 'Added to Cart!', message: `${p.shortName} is waiting in your basket.`, icon: 'shopping_bag' });
    return true;
  }

  addHamper(hamper: HamperDetails) {
    this.lines.update((ls) => [...ls, { key: `hamper|${Date.now()}`, kind: 'hamper', qty: 1, hamper }]);
    this.toast.show({ title: 'Custom hamper added!', message: `${hamper.goodies.length} goodies packed in your ${hamper.baseName}.`, icon: 'redeem' });
  }

  updateQty(key: string, qty: number) {
    const line = this.lines().find((l) => l.key === key);
    if (!line) return;
    if (qty < 1) {
      this.remove(key);
      return;
    }
    if (line.kind === 'product' && line.productId) {
      const stock = this.inventory.get(line.productId);
      const others = this.qtyInCart(line.productId) - line.qty;
      if (others + qty > stock) {
        this.toast.show({ title: `Only ${stock} in stock`, icon: 'inventory_2', tone: 'error' });
        return;
      }
    }
    this.lines.update((ls) => ls.map((l) => (l.key === key ? { ...l, qty } : l)));
  }

  remove(key: string) {
    this.lines.update((ls) => ls.filter((l) => l.key !== key));
  }

  saveForLater(key: string) {
    const line = this.lines().find((l) => l.key === key);
    if (!line) return;
    this.remove(key);
    this.saved.update((s) => [...s.filter((l) => l.key !== key), line]);
    this.toast.show({ title: 'Saved for later', icon: 'bookmark' });
  }

  moveToCart(key: string) {
    const line = this.saved().find((l) => l.key === key);
    if (!line) return;
    this.saved.update((s) => s.filter((l) => l.key !== key));
    this.lines.update((ls) => [...ls.filter((l) => l.key !== key), line]);
  }

  removeSaved(key: string) {
    this.saved.update((s) => s.filter((l) => l.key !== key));
  }

  clear() {
    this.lines.set([]);
    this.couponCode.set('');
  }
}

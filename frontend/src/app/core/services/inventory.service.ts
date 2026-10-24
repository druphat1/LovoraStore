import { Injectable } from '@angular/core';
import { PRODUCTS } from '../data/products';
import { persistedSignal } from '../lib/persisted-signal';

const INITIAL_STOCK: Record<string, number> = Object.fromEntries(PRODUCTS.map((p) => [p.id, p.stock]));

/** Demo stock levels shared by the storefront and the admin portal. */
@Injectable({ providedIn: 'root' })
export class InventoryService {
  readonly stock = persistedSignal<Record<string, number>>('stock', INITIAL_STOCK);

  get(id: string): number {
    return this.stock()[id] ?? INITIAL_STOCK[id] ?? 0;
  }

  adjust(id: string, delta: number) {
    this.stock.update((s) => ({ ...s, [id]: Math.max(0, (s[id] ?? INITIAL_STOCK[id] ?? 0) + delta) }));
  }

  consume(items: { productId?: string; qty: number }[]) {
    this.stock.update((s) => {
      const next = { ...s };
      for (const { productId, qty } of items) {
        if (productId && productId in INITIAL_STOCK) next[productId] = Math.max(0, (next[productId] ?? INITIAL_STOCK[productId]) - qty);
      }
      return next;
    });
  }
}

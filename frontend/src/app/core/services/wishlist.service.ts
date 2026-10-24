import { computed, inject, Injectable } from '@angular/core';
import { PRODUCT_BY_ID } from '../data/products';
import { persistedSignal } from '../lib/persisted-signal';
import { ToastService } from './toast.service';

@Injectable({ providedIn: 'root' })
export class WishlistService {
  private toast = inject(ToastService);
  readonly ids = persistedSignal<string[]>('wishlist', []);
  readonly count = computed(() => this.ids().length);

  has(id: string) {
    return this.ids().includes(id);
  }

  toggle(id: string) {
    const adding = !this.has(id);
    this.ids.update((list) => (adding ? [...list, id] : list.filter((x) => x !== id)));
    this.toast.show({
      title: adding ? 'Saved to Wishlist' : 'Removed from Wishlist',
      message: PRODUCT_BY_ID[id]?.shortName,
      icon: adding ? 'favorite' : 'heart_minus',
    });
  }

  remove(id: string) {
    this.ids.update((list) => list.filter((x) => x !== id));
  }
}

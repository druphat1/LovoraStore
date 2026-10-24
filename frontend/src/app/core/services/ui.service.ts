import { Injectable, signal } from '@angular/core';
import { Product } from '../data/products';

/** App-wide UI state: mobile drawer and the quick-view modal. */
@Injectable({ providedIn: 'root' })
export class UiService {
  readonly drawerOpen = signal(false);
  readonly quickView = signal<Product | null>(null);
}

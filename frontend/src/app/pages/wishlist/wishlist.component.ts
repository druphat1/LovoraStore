import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { PRODUCT_BY_ID } from '../../core/data/products';
import { CartService } from '../../core/services/cart.service';
import { ToastService } from '../../core/services/toast.service';
import { WishlistService } from '../../core/services/wishlist.service';
import { ProductCardComponent } from '../../shared/product/product-card.component';
import { EmptyStateComponent } from '../../shared/ui/empty-state.component';
import { IconComponent } from '../../shared/ui/icon.component';

@Component({
  selector: 'app-wishlist',
  imports: [ProductCardComponent, EmptyStateComponent, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-7xl mx-auto px-margin-mobile md:px-gutter py-6 md:py-10">
      <div class="flex items-center justify-between gap-3 mb-5">
        <h1 class="font-headline-md text-headline-md md:font-headline-lg md:text-headline-lg flex items-center gap-2"><app-icon name="favorite" [fill]="true" class="text-primary" />My Wishlist</h1>
        @if (products().length) {
          <button type="button" (click)="addAll()" class="btn-primary px-4 py-2.5 text-sm"><app-icon name="shopping_bag" [size]="18" />Add all to bag</button>
        }
      </div>
      @if (products().length) {
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          @for (p of products(); track p.id) {
            <app-product-card [product]="p" />
          }
        </div>
      } @else {
        <app-empty-state icon="favorite" title="Your wishlist is empty" message="Tap the heart on any gift to save it here for later." actionLabel="Discover gifts" />
      }
    </div>
  `,
})
export class WishlistComponent {
  private wishlist = inject(WishlistService);
  private cart = inject(CartService);
  private toast = inject(ToastService);
  products = computed(() => this.wishlist.ids().map((id) => PRODUCT_BY_ID[id]).filter(Boolean));

  /** Adds every in-stock wishlist item, with one summary toast instead of one per item. */
  addAll() {
    const added = this.products().filter((p) => this.cart.addProduct(p.id, 1, {}, true)).length;
    if (added) this.toast.show({ title: `${added} item${added === 1 ? '' : 's'} added to your bag`, icon: 'shopping_bag' });
  }
}

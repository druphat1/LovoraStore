import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { InventoryService } from '../../core/services/inventory.service';
import { UiService } from '../../core/services/ui.service';
import { IconComponent } from '../ui/icon.component';
import { ModalComponent } from '../ui/modal.component';
import { PriceComponent } from '../ui/price.component';
import { QtyStepperComponent } from '../ui/qty-stepper.component';
import { StarsComponent } from '../ui/stars.component';
import { WishlistButtonComponent } from './wishlist-button.component';

@Component({
  selector: 'app-quick-view',
  imports: [RouterLink, ModalComponent, IconComponent, PriceComponent, StarsComponent, QtyStepperComponent, WishlistButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-modal [open]="!!ui.quickView()" (closed)="close()" title="Quick View" maxWidth="max-w-3xl" variant="sheet">
      @if (ui.quickView(); as p) {
        <div class="grid md:grid-cols-2 gap-6">
          <div class="relative rounded-2xl overflow-hidden bg-primary-fixed/20 aspect-square">
            <img [src]="p.images[0]" [alt]="p.name" class="w-full h-full object-cover" />
            <app-wishlist-button [productId]="p.id" size="lg" class="absolute top-3 right-3" />
          </div>
          <div class="flex flex-col gap-3">
            <h3 class="font-headline-md text-headline-md text-on-surface">{{ p.name }}</h3>
            <div class="flex items-center gap-2 text-sm text-on-surface-variant">
              <app-stars [value]="p.rating" /><span>{{ p.rating }} · {{ p.reviews }} ratings</span>
            </div>
            <app-price [price]="p.price" [mrp]="p.mrp" [showPct]="true" size="lg" />
            <p class="font-body-sm text-body-sm text-on-surface-variant">{{ p.description }}</p>
            <p class="text-sm font-semibold" [class]="stock() === 0 ? 'text-error' : stock() <= 5 ? 'text-primary' : 'text-emerald-700'">
              {{ stock() === 0 ? 'Out of stock' : stock() <= 5 ? 'Hurry, only ' + stock() + ' left!' : 'In stock · ready to gift-wrap' }}
            </p>
            <div class="flex items-center gap-3 mt-auto pt-2">
              <app-qty-stepper [value]="qty()" (valueChange)="qty.set($event)" [max]="stock() || 1" />
              <button type="button" [disabled]="stock() === 0" (click)="add(p.id)" class="btn-primary flex-1 py-3">
                <app-icon name="shopping_bag" [size]="20" />Add to Cart
              </button>
            </div>
            <a [routerLink]="['/product', p.id]" (click)="close()" class="text-primary font-button-text text-sm inline-flex items-center gap-1 hover:underline">
              View full details &amp; gift options <app-icon name="chevron_right" [size]="18" />
            </a>
          </div>
        </div>
      }
    </app-modal>
  `,
})
export class QuickViewComponent {
  ui = inject(UiService);
  private cart = inject(CartService);
  private inventory = inject(InventoryService);
  qty = signal(1);
  stock = computed(() => {
    const p = this.ui.quickView();
    return p ? this.inventory.get(p.id) : 0;
  });

  constructor() {
    effect(() => {
      this.ui.quickView();
      this.qty.set(1);
    });
  }

  add(id: string) {
    if (this.cart.addProduct(id, this.qty())) this.close();
  }

  close() {
    this.ui.quickView.set(null);
  }
}

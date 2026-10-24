import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CATEGORY_BY_ID, TONE } from '../../core/data/categories';
import { ageLabel, cardImage, Product } from '../../core/data/products';
import { discountPct } from '../../core/lib/format';
import { CartService } from '../../core/services/cart.service';
import { InventoryService } from '../../core/services/inventory.service';
import { UiService } from '../../core/services/ui.service';
import { IconComponent } from '../ui/icon.component';
import { PriceComponent } from '../ui/price.component';
import { WishlistButtonComponent } from './wishlist-button.component';

/**
 * variant "featured": home best-seller card (tinted plate, Add to Cart + Quick View).
 * variant "grid": catalogue card (SAVE % badge, age line, full-width Add to Cart).
 * Both collapse to the dense 2-column mobile layout from the mobile references.
 */
@Component({
  selector: 'app-product-card',
  imports: [RouterLink, IconComponent, PriceComponent, WishlistButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block h-full' },
  templateUrl: './product-card.component.html',
})
export class ProductCardComponent {
  product = input.required<Product>();
  variant = input<'featured' | 'grid'>('grid');

  private cart = inject(CartService);
  private inventory = inject(InventoryService);
  private ui = inject(UiService);

  image = computed(() => cardImage(this.product()));
  link = computed(() => ['/product', this.product().id]);
  soldOut = computed(() => this.inventory.get(this.product().id) === 0);
  tone = computed(() => TONE[CATEGORY_BY_ID[this.product().category]?.tone ?? 'primary']);
  pct = computed(() => discountPct(this.product().price, this.product().mrp));
  age = computed(() => ageLabel(this.product()));

  add() {
    this.cart.addProduct(this.product().id);
  }

  quickView() {
    this.ui.quickView.set(this.product());
  }
}

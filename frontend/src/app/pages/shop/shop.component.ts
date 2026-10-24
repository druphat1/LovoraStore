import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, inject, signal, WritableSignal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { AGE_GROUPS, CATEGORIES, CATEGORY_BY_ID, OCCASIONS, PRICE_RANGES, SORTS } from '../../core/data/categories';
import { CATALOG, cardImage, categoryCount, Product } from '../../core/data/products';
import { discountPct } from '../../core/lib/format';
import { whatsappLink } from '../../core/lib/whatsapp';
import { STORE } from '../../core/config/store';
import { CartService } from '../../core/services/cart.service';
import { InventoryService } from '../../core/services/inventory.service';
import { ProductCardComponent } from '../../shared/product/product-card.component';
import { WishlistButtonComponent } from '../../shared/product/wishlist-button.component';
import { BreadcrumbsComponent, Crumb } from '../../shared/ui/breadcrumbs.component';
import { IconComponent } from '../../shared/ui/icon.component';
import { ModalComponent } from '../../shared/ui/modal.component';
import { PriceComponent } from '../../shared/ui/price.component';

const PAGE_SIZE = 8;

interface Pill {
  label: string;
  clear: () => void;
}

@Component({
  selector: 'app-shop',
  imports: [FormsModule, RouterLink, NgTemplateOutlet, IconComponent, ProductCardComponent, BreadcrumbsComponent, ModalComponent, PriceComponent, WishlistButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './shop.component.html',
})
export class ShopComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private inventory = inject(InventoryService);
  private cart = inject(CartService);

  categories = CATEGORIES;
  ageGroups = AGE_GROUPS;
  priceRanges = PRICE_RANGES;
  occasions = OCCASIONS;
  sorts = SORTS;
  catCount = categoryCount;
  totalCatalog = CATALOG.length;
  image = cardImage;
  store = STORE;
  wa = whatsappLink('Hi! I need help picking the perfect toy or hamper.');

  // URL-backed state (shareable links): category, search, sort
  private params = toSignal(this.route.queryParamMap.pipe(map((q) => ({ cat: q.get('cat') ?? '', q: q.get('q') ?? '', sort: q.get('sort') ?? 'featured' }))), {
    initialValue: { cat: '', q: '', sort: 'featured' },
  });
  cat = computed(() => this.params().cat);
  query = computed(() => this.params().q);
  sort = computed(() => this.params().sort);

  // Local facet state
  inStock = signal(false);
  sameDay = signal(false);
  prices = signal<string[]>([]);
  ages = signal<string[]>([]);
  occ = signal<string[]>([]);
  view = signal<'grid' | 'list'>('grid');
  shown = signal(PAGE_SIZE);
  sheetOpen = signal(false);
  refine = signal('');

  constructor() {
    // keep the refine box in sync with ?q= and reset paging when the URL filter changes
    effect(() => {
      this.refine.set(this.query());
      this.cat();
      this.shown.set(PAGE_SIZE);
    });
  }

  categoryName = computed(() => CATEGORY_BY_ID[this.cat()]?.name);

  crumbs = computed<Crumb[]>(() => {
    const c: Crumb[] = [{ label: 'All Toys & Gifts', link: '/shop' }];
    if (this.categoryName()) c.push({ label: this.categoryName()! });
    else c.push({ label: this.query() ? `Search: “${this.query()}”` : 'Curated Catalog' });
    return c;
  });

  results = computed(() => {
    const q = this.query().trim().toLowerCase();
    const prices = PRICE_RANGES.filter((r) => this.prices().includes(r.id));
    const ages = AGE_GROUPS.filter((a) => this.ages().includes(a.id));
    const stock = this.inventory.stock(); // dependency so stock edits refilter
    let list = CATALOG.filter((p) => {
      if (this.cat() && p.category !== this.cat()) return false;
      if (q && !`${p.name} ${p.subtitle ?? ''} ${CATEGORY_BY_ID[p.category]?.name ?? ''} ${p.description}`.toLowerCase().includes(q)) return false;
      if (this.inStock() && (stock[p.id] ?? p.stock) <= 0) return false;
      if (this.sameDay() && !p.sameDay) return false;
      if (prices.length && !prices.some((r) => p.price >= r.min && p.price <= r.max)) return false;
      if (ages.length && !ages.some((a) => p.ageMin <= a.max && p.ageMax >= a.min)) return false;
      if (this.occ().length && !this.occ().some((o) => p.occasions.includes(o))) return false;
      return true;
    });
    const by: Record<string, (a: Product, b: Product) => number> = {
      'price-asc': (a, b) => a.price - b.price,
      'price-desc': (a, b) => b.price - a.price,
      rating: (a, b) => b.rating - a.rating || b.reviews - a.reviews,
      discount: (a, b) => discountPct(b.price, b.mrp) - discountPct(a.price, a.mrp),
      featured: (a, b) => (a.featured ?? 99) - (b.featured ?? 99),
    };
    list = [...list].sort(by[this.sort()] ?? by['featured']);
    return list;
  });

  visible = computed(() => this.results().slice(0, this.shown()));
  progress = computed(() => (this.results().length ? Math.min(100, (this.visible().length / this.results().length) * 100) : 0));

  pills = computed<Pill[]>(() => {
    const out: Pill[] = [];
    if (this.categoryName()) out.push({ label: this.categoryName()!, clear: () => this.setParam({ cat: null }) });
    if (this.query()) out.push({ label: `“${this.query()}”`, clear: () => this.setParam({ q: null }) });
    if (this.inStock()) out.push({ label: 'In Stock', clear: () => this.inStock.set(false) });
    if (this.sameDay()) out.push({ label: 'Same-Day', clear: () => this.sameDay.set(false) });
    for (const id of this.prices()) out.push({ label: PRICE_RANGES.find((r) => r.id === id)!.label, clear: () => this.toggle(this.prices, id) });
    for (const id of this.ages()) out.push({ label: `Age: ${AGE_GROUPS.find((a) => a.id === id)!.label}`, clear: () => this.toggle(this.ages, id) });
    for (const id of this.occ()) out.push({ label: OCCASIONS.find((o) => o.id === id)!.label, clear: () => this.toggle(this.occ, id) });
    return out;
  });

  facetCount = computed(() => this.pills().filter((p) => !p.label.startsWith('“')).length);

  toggle(sig: WritableSignal<string[]>, id: string) {
    sig.update((list) => (list.includes(id) ? list.filter((x) => x !== id) : [...list, id]));
    this.shown.set(PAGE_SIZE);
  }

  setParam(params: Record<string, string | null>) {
    this.router.navigate([], { relativeTo: this.route, queryParams: params, queryParamsHandling: 'merge' });
  }

  submitRefine(e: Event) {
    e.preventDefault();
    this.setParam({ q: this.refine().trim() || null });
  }

  clearAll() {
    this.inStock.set(false);
    this.sameDay.set(false);
    this.prices.set([]);
    this.ages.set([]);
    this.occ.set([]);
    this.router.navigate([], { relativeTo: this.route, queryParams: { sort: this.sort() === 'featured' ? null : this.sort() } });
  }

  loadMore() {
    this.shown.update((n) => n + PAGE_SIZE);
  }

  stockOf(p: Product) {
    return this.inventory.get(p.id);
  }

  add(p: Product) {
    this.cart.addProduct(p.id);
  }
}

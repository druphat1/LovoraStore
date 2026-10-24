import { ChangeDetectionStrategy, Component, computed, effect, inject, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { STORE } from '../../core/config/store';
import { CATEGORY_BY_ID } from '../../core/data/categories';
import { ADDON_IDS, CATALOG, PRODUCT_BY_ID } from '../../core/data/products';
import { PRODUCT_REVIEWS, Review } from '../../core/data/reviews';
import { discountPct, formatINR } from '../../core/lib/format';
import { persistedSignal } from '../../core/lib/persisted-signal';
import { LUXURY_BOX_FEE } from '../../core/lib/pricing';
import { openWhatsApp } from '../../core/lib/whatsapp';
import { CartService, GiftOptions } from '../../core/services/cart.service';
import { InventoryService } from '../../core/services/inventory.service';
import { ToastService } from '../../core/services/toast.service';
import { ProductCardComponent } from '../../shared/product/product-card.component';
import { WishlistButtonComponent } from '../../shared/product/wishlist-button.component';
import { AccordionComponent } from '../../shared/ui/accordion.component';
import { BreadcrumbsComponent, Crumb } from '../../shared/ui/breadcrumbs.component';
import { EmptyStateComponent } from '../../shared/ui/empty-state.component';
import { IconComponent } from '../../shared/ui/icon.component';
import { InrPipe } from '../../shared/ui/inr.pipe';
import { ModalComponent } from '../../shared/ui/modal.component';
import { QtyStepperComponent } from '../../shared/ui/qty-stepper.component';
import { StarsComponent } from '../../shared/ui/stars.component';

const OCCASION_CHOICES = [
  { id: 'Birthday', label: '🎂 Birthday' },
  { id: 'Anniversary', label: '💍 Anniversary' },
  { id: 'Get Well', label: '🌷 Get Well' },
  { id: 'Just Because', label: '✨ Just Because' },
];

const NOTE_IDEAS = ['Happy Birthday sweet soul! 🎈', 'Big warm hugs from far away 🤗', 'You make every day brighter ☀️'];

@Component({
  selector: 'app-product',
  imports: [
    FormsModule,
    RouterLink,
    IconComponent,
    InrPipe,
    StarsComponent,
    QtyStepperComponent,
    AccordionComponent,
    BreadcrumbsComponent,
    EmptyStateComponent,
    ModalComponent,
    ProductCardComponent,
    WishlistButtonComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './product.component.html',
})
export class ProductComponent {
  /** Route param :id (bound via withComponentInputBinding). */
  id = input.required<string>();

  private cart = inject(CartService);
  private inventory = inject(InventoryService);
  private toast = inject(ToastService);

  store = STORE;
  occasionChoices = OCCASION_CHOICES;
  noteIdeas = NOTE_IDEAS;
  luxuryFee = LUXURY_BOX_FEE;
  addons = ADDON_IDS.map((id) => PRODUCT_BY_ID[id]);

  product = computed(() => {
    const p = PRODUCT_BY_ID[this.id()];
    return p && !p.hidden ? p : undefined;
  });
  category = computed(() => CATEGORY_BY_ID[this.product()?.category ?? '']);
  stock = computed(() => (this.product() ? this.inventory.get(this.product()!.id) : 0));
  pct = computed(() => (this.product() ? discountPct(this.product()!.price, this.product()!.mrp) : 0));
  related = computed(() => {
    const p = this.product();
    return p ? CATALOG.filter((x) => x.category === p.category && x.id !== p.id).slice(0, 4) : [];
  });
  crumbs = computed<Crumb[]>(() => [
    { label: this.category()?.name ?? 'Shop', link: '/shop', query: { cat: this.category()?.id ?? '' } },
    { label: this.product()?.shortName ?? '' },
  ]);

  // gallery
  active = signal(0);
  zoom = signal<string | null>(null);

  // gift studio
  qty = signal(1);
  occasion = signal('Birthday');
  wrap = signal<GiftOptions['wrap']>('free');
  note = signal('');

  unitPrice = computed(() => (this.product()?.price ?? 0) + (this.wrap() === 'luxury' ? LUXURY_BOX_FEE : 0));

  // pincode
  pin = signal('');
  pinResult = signal<{ ok: boolean; text: string } | null>(null);

  // reviews (sample reviews + any written in this browser)
  private localReviews = persistedSignal<Record<string, Review[]>>('reviews', {});
  reviews = computed(() => [...(this.localReviews()[this.id()] ?? []), ...PRODUCT_REVIEWS]);
  reviewOpen = signal(false);
  draft = { name: '', city: '', rating: 5, text: '' };
  reviewError = signal('');

  constructor() {
    // reset per-product UI state when navigating between products
    effect(() => {
      this.id();
      this.active.set(0);
      this.qty.set(1);
      this.note.set('');
      this.wrap.set('free');
      this.pinResult.set(null);
    });
  }

  onZoom(e: MouseEvent) {
    const el = e.currentTarget as HTMLElement;
    const r = el.getBoundingClientRect();
    this.zoom.set(`${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`);
  }

  onCarouselScroll(e: Event) {
    const el = e.target as HTMLElement;
    this.active.set(Math.round(el.scrollLeft / el.clientWidth));
  }

  checkPin(e?: Event) {
    e?.preventDefault();
    const pin = this.pin().trim();
    if (!/^[1-9]\d{5}$/.test(pin)) {
      this.pinResult.set({ ok: false, text: 'Please enter a valid 6-digit Indian pincode.' });
      return;
    }
    const p2 = pin.slice(0, 2);
    const p3 = pin.slice(0, 3);
    let text: string;
    if (p3 === '145') text = 'Same-day delivery or free pickup from our Super Bazar store, Pathankot.';
    else if (['14', '15', '16', '17', '18', '19'].includes(p2)) text = 'Delivery in 1-2 days across Punjab, J&K & Himachal.';
    else if (['11', '40', '56', '60', '70', '50'].includes(p2)) text = 'Express delivery in 2-3 days to metro cities.';
    else text = 'Standard delivery in 4-6 days. Cash on Delivery available.';
    this.pinResult.set({ ok: true, text: `${text} (estimate)` });
  }

  options(): GiftOptions {
    return { occasion: this.occasion(), wrap: this.wrap(), note: this.note().trim() };
  }

  addToCart() {
    const p = this.product();
    if (p) this.cart.addProduct(p.id, this.qty(), this.options());
  }

  buyOnWhatsApp() {
    const p = this.product();
    if (!p) return;
    const o = this.options();
    openWhatsApp(
      `Hi Lovely Gift Center! I'd like to order:\n• ${p.name} (SKU ${p.sku}) × ${this.qty()} — ${formatINR(this.unitPrice() * this.qty())}\nOccasion: ${o.occasion}\nWrap: ${
        o.wrap === 'luxury' ? 'Luxury Keepsake Box' : 'Complimentary wrap'
      }${o.note ? `\nCard note: "${o.note}"` : ''}`,
    );
  }

  addAddon(id: string) {
    this.cart.addProduct(id, 1, {}, false);
  }

  async share() {
    const p = this.product();
    if (!p) return;
    const data = { title: p.name, text: `${p.shortName} at ${STORE.name}`, url: location.href };
    try {
      if (navigator.share) await navigator.share(data);
      else {
        await navigator.clipboard.writeText(location.href);
        this.toast.show({ title: 'Link copied!', icon: 'link' });
      }
    } catch {
      /* user cancelled share */
    }
  }

  submitReview(e: Event) {
    e.preventDefault();
    const d = this.draft;
    if (d.name.trim().length < 2) return this.reviewError.set('Please add your name.');
    if (d.text.trim().length < 10) return this.reviewError.set('Tell us a little more (at least 10 characters).');
    const review: Review = { name: d.name.trim(), city: d.city.trim() || 'India', when: 'Just now', rating: d.rating, text: d.text.trim() };
    this.localReviews.update((all) => ({ ...all, [this.id()]: [review, ...(all[this.id()] ?? [])] }));
    this.draft = { name: '', city: '', rating: 5, text: '' };
    this.reviewError.set('');
    this.reviewOpen.set(false);
    this.toast.show({ title: 'Thank you for your review!', message: 'Saved in this browser (demo).', icon: 'rate_review' });
  }
}

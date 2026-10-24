import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BEDDINGS, GOODIE_TABS, GOODIES, HAMPER_BASES, HAMPER_OCCASIONS, RIBBONS, WRAP_FEE, WRAP_WAIVER } from '../../core/data/hamper';
import { formatINR } from '../../core/lib/format';
import { persistedSignal } from '../../core/lib/persisted-signal';
import { openWhatsApp } from '../../core/lib/whatsapp';
import { CartService } from '../../core/services/cart.service';
import { ToastService } from '../../core/services/toast.service';
import { BreadcrumbsComponent } from '../../shared/ui/breadcrumbs.component';
import { IconComponent } from '../../shared/ui/icon.component';
import { InrPipe } from '../../shared/ui/inr.pipe';
import { QtyStepperComponent } from '../../shared/ui/qty-stepper.component';

interface HamperDraft {
  base: string;
  goodies: Record<string, number>;
  ribbon: string;
  bedding: string;
  recipient: string;
  occasion: string;
  message: string;
  font: string;
}

const EMPTY: HamperDraft = {
  base: 'pink-basket',
  goodies: {},
  ribbon: RIBBONS[0].id,
  bedding: BEDDINGS[0].id,
  recipient: '',
  occasion: HAMPER_OCCASIONS[0],
  message: '',
  font: 'Classic Cursive',
};

@Component({
  selector: 'app-hamper',
  imports: [FormsModule, IconComponent, InrPipe, QtyStepperComponent, BreadcrumbsComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './hamper.component.html',
})
export class HamperComponent {
  private cart = inject(CartService);
  private toast = inject(ToastService);
  private router = inject(Router);

  bases = HAMPER_BASES;
  tabs = GOODIE_TABS;
  ribbons = RIBBONS;
  beddings = BEDDINGS;
  occasions = HAMPER_OCCASIONS;
  waiver = WRAP_WAIVER;
  fonts = ['Classic Cursive', 'Whimsical Script'];

  draft = signal<HamperDraft>({ ...EMPTY, goodies: {} });
  tab = signal('all');
  private template = persistedSignal<HamperDraft | null>('hamperTemplate', null);
  hasTemplate = computed(() => !!this.template());
  attempted = signal(false);

  base = computed(() => HAMPER_BASES.find((b) => b.id === this.draft().base));
  ribbon = computed(() => RIBBONS.find((r) => r.id === this.draft().ribbon)!);
  bedding = computed(() => BEDDINGS.find((b) => b.id === this.draft().bedding)!);
  visibleGoodies = computed(() => (this.tab() === 'all' ? GOODIES : GOODIES.filter((g) => g.tab === this.tab())));
  picked = computed(() =>
    GOODIES.filter((g) => (this.draft().goodies[g.id] ?? 0) > 0).map((g) => ({ ...g, qty: this.draft().goodies[g.id] })),
  );
  itemCount = computed(() => this.picked().reduce((s, g) => s + g.qty, 0));
  capacity = computed(() => this.base()?.capacity ?? 8);
  fill = computed(() => Math.min(100, Math.round((this.itemCount() / this.capacity()) * 100)));
  goodiesTotal = computed(() => this.picked().reduce((s, g) => s + g.price * g.qty, 0));
  subtotal = computed(() => (this.base()?.price ?? 0) + this.goodiesTotal() + this.bedding().price);
  wrapFee = computed(() => (this.subtotal() >= WRAP_WAIVER ? 0 : WRAP_FEE));
  total = computed(() => this.subtotal() + this.wrapFee());

  steps = computed(() => [
    { n: 1, label: 'Hamper Box', done: !!this.base(), note: this.base() ? 'Selected' : 'Choose a box' },
    { n: 2, label: 'Pick Goodies', done: this.itemCount() > 0, note: `${this.itemCount()} added` },
    { n: 3, label: 'Ribbons & Bedding', done: this.itemCount() > 0, note: this.ribbon().label },
    { n: 4, label: 'Calligraphy Note', done: this.draft().message.trim().length > 0, note: this.draft().message ? 'Written' : 'Optional' },
  ]);
  activeStep = computed(() => this.steps().find((s) => !s.done)?.n ?? 4);

  patch(p: Partial<HamperDraft>) {
    this.draft.update((d) => ({ ...d, ...p }));
  }

  qtyOf(id: string) {
    return this.draft().goodies[id] ?? 0;
  }

  setQty(id: string, qty: number) {
    const current = this.qtyOf(id);
    if (qty > current && this.itemCount() >= this.capacity()) {
      this.toast.show({ title: 'Your hamper is full!', message: 'Remove an item or pick a bigger box.', icon: 'inventory_2', tone: 'error' });
      return;
    }
    this.draft.update((d) => {
      const goodies = { ...d.goodies };
      if (qty <= 0) delete goodies[id];
      else goodies[id] = qty;
      return { ...d, goodies };
    });
  }

  addToCart() {
    this.attempted.set(true);
    const base = this.base();
    if (!base || this.itemCount() === 0) {
      this.toast.show({ title: 'Add at least one goodie', message: 'Pick a few treats to fill your hamper.', icon: 'redeem', tone: 'error' });
      document.getElementById('goodies')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    const d = this.draft();
    this.cart.addHamper({
      name: `Custom ${base.name} Hamper`,
      baseName: base.name,
      image: base.image,
      price: this.total(),
      goodies: this.picked().map((g) => ({ name: g.name, qty: g.qty, price: g.price })),
      ribbon: this.ribbon().label,
      bedding: this.bedding().label,
      card: { recipient: d.recipient.trim(), occasion: d.occasion, message: d.message.trim(), font: d.font },
    });
    this.draft.set({ ...EMPTY, goodies: {} });
    this.attempted.set(false);
    this.router.navigateByUrl('/cart');
  }

  saveTemplate() {
    this.template.set(this.draft());
    this.toast.show({ title: 'Template saved', message: 'Load it any time from this page (this browser only).', icon: 'bookmark' });
  }

  loadTemplate() {
    const t = this.template();
    if (t) this.draft.set(t);
  }

  share() {
    const lines = this.picked().map((g) => `• ${g.name} × ${g.qty}`).join('\n');
    openWhatsApp(
      `Hi! I designed a custom hamper:\nBox: ${this.base()?.name}\n${lines || '(no goodies yet)'}\nRibbon: ${this.ribbon().label}, Bedding: ${this.bedding().label}\nTotal: ${formatINR(this.total())}`,
    );
  }
}

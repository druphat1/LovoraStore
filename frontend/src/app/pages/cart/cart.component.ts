import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { STORE } from '../../core/config/store';
import { formatINR } from '../../core/lib/format';
import { persistedSignal } from '../../core/lib/persisted-signal';
import { applyCoupon, computeTotals } from '../../core/lib/pricing';
import { openWhatsApp } from '../../core/lib/whatsapp';
import { AuthService } from '../../core/services/auth.service';
import { CartService, HamperDetails } from '../../core/services/cart.service';
import { InventoryService } from '../../core/services/inventory.service';
import { OrdersService } from '../../core/services/orders.service';
import { ToastService } from '../../core/services/toast.service';
import { EmptyStateComponent } from '../../shared/ui/empty-state.component';
import { IconComponent } from '../../shared/ui/icon.component';
import { InrPipe } from '../../shared/ui/inr.pipe';
import { QtyStepperComponent } from '../../shared/ui/qty-stepper.component';

interface Address {
  name: string;
  phone: string;
  pincode: string;
  address: string;
  landmark: string;
}

type Errors = Partial<Record<keyof Address, string>>;

@Component({
  selector: 'app-cart',
  imports: [FormsModule, NgTemplateOutlet, RouterLink, IconComponent, InrPipe, QtyStepperComponent, EmptyStateComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './cart.component.html',
})
export class CartComponent {
  cart = inject(CartService);
  private auth = inject(AuthService);
  private orders = inject(OrdersService);
  private inventory = inject(InventoryService);
  private toast = inject(ToastService);
  private router = inject(Router);

  store = STORE;
  suggestions = ['BDAYLOVE', 'FIRSTGIFT', 'FESTIVE10'];

  couponInput = signal(this.cart.couponCode());
  couponMsg = signal<{ ok: boolean; text: string } | null>(null);

  private savedAddress = persistedSignal<Address>('address', { name: '', phone: '', pincode: '', address: '', landmark: '' });
  addr: Address = { ...this.savedAddress(), name: this.savedAddress().name || this.auth.user()?.name || '', phone: this.savedAddress().phone || this.auth.user()?.phone || '' };
  errors = signal<Errors>({});

  delivery = signal<'standard' | 'pickup'>('standard');
  payment = signal<'online' | 'cod' | 'whatsapp'>('online');
  placing = signal(false);

  totals = computed(() => computeTotals(this.cart.items(), { couponCode: this.cart.couponCode(), pickup: this.delivery() === 'pickup' }));
  freeProgress = computed(() => {
    const t = this.totals();
    return Math.min(100, ((t.subtotal - t.couponDiscount) / STORE.freeShippingThreshold) * 100);
  });

  goodieNames(h: HamperDetails) {
    return h.goodies.map((g) => g.name).join(', ');
  }

  applyCode(code = this.couponInput()) {
    const c = code.trim().toUpperCase();
    if (!c) return;
    this.couponInput.set(c);
    const res = applyCoupon(c, this.cart.items(), this.cart.totals().subtotal);
    this.couponMsg.set({ ok: res.ok, text: res.message });
    this.cart.couponCode.set(res.ok ? c : '');
  }

  removeCoupon() {
    this.cart.couponCode.set('');
    this.couponInput.set('');
    this.couponMsg.set(null);
  }

  private validate(): boolean {
    const a = this.addr;
    const e: Errors = {};
    if (a.name.trim().length < 2) e.name = 'Please enter the recipient’s full name.';
    if (!/^[6-9]\d{9}$/.test(a.phone.replace(/\s|-/g, '').replace(/^\+?91/, ''))) e.phone = 'Enter a valid 10-digit Indian mobile number.';
    if (this.delivery() === 'standard') {
      if (!/^[1-9]\d{5}$/.test(a.pincode.trim())) e.pincode = 'Enter a valid 6-digit pincode.';
      if (a.address.trim().length < 8) e.address = 'Please add house/flat, street and area.';
    }
    this.errors.set(e);
    return Object.keys(e).length === 0;
  }

  async placeOrder() {
    if (!this.cart.items().length || this.placing()) return;
    if (!this.validate()) {
      this.toast.show({ title: 'Please check your delivery details', icon: 'error', tone: 'error' });
      document.getElementById('delivery')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    this.placing.set(true);
    this.savedAddress.set({ ...this.addr });
    if (this.payment() === 'online') await new Promise((r) => setTimeout(r, 1200)); // simulated demo payment step

    const items = this.cart.items();
    const totals = this.totals();
    const order = this.orders.place({
      customer: { ...this.addr, phone: this.addr.phone.trim() },
      delivery: this.delivery(),
      payment: this.payment(),
      giftWrap: true,
      userEmail: this.auth.user()?.email,
      lines: items.map((l) => ({
        name: l.name,
        qty: l.qty,
        unitPrice: l.unitPrice,
        image: l.image,
        productId: l.productId,
        note: l.kind === 'hamper' ? l.hamper?.card.message : l.options?.note,
      })),
      totals,
    });
    this.inventory.consume(items.filter((l) => l.kind === 'product').map((l) => ({ productId: l.productId, qty: l.qty })));

    if (this.payment() === 'whatsapp') {
      const lines = items.map((l) => `• ${l.name} × ${l.qty} — ${formatINR(l.unitPrice * l.qty)}`).join('\n');
      openWhatsApp(
        `Hi Lovely Gift Center! Order ${order.id}\n${lines}\nTotal: ${formatINR(totals.grandTotal)}\n${
          this.delivery() === 'pickup' ? 'Store pickup' : `Deliver to: ${this.addr.name}, ${this.addr.address}, ${this.addr.pincode}`
        }\nPhone: ${this.addr.phone}`,
      );
    }
    this.cart.clear();
    this.placing.set(false);
    this.router.navigate(['/order', order.id]);
  }
}

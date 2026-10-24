import { ChangeDetectionStrategy, Component, effect, inject, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { formatDate } from '../../core/lib/format';
import { whatsappLink } from '../../core/lib/whatsapp';
import { Order, OrdersService } from '../../core/services/orders.service';
import { IconComponent } from '../../shared/ui/icon.component';
import { InrPipe } from '../../shared/ui/inr.pipe';
import { OrderTimelineComponent } from '../../shared/ui/order-timeline.component';

@Component({
  selector: 'app-track',
  imports: [FormsModule, RouterLink, IconComponent, InrPipe, OrderTimelineComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-2xl mx-auto px-margin-mobile md:px-gutter py-8 md:py-12">
      <div class="text-center mb-6">
        <span class="mx-auto w-16 h-16 rounded-full bg-secondary-fixed text-secondary flex items-center justify-center"><app-icon name="local_shipping" [size]="32" /></span>
        <h1 class="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg mt-3">Track Your Gift</h1>
        <p class="text-on-surface-variant mt-1">Enter the order ID from your confirmation (e.g. LGC-1083).</p>
      </div>
      <form (submit)="lookup($event)" class="card p-4 md:p-6 flex flex-col sm:flex-row gap-3" novalidate>
        <label class="flex-1"><span class="sr-only">Order ID</span>
          <input class="field uppercase" name="orderId" [ngModel]="query()" (ngModelChange)="query.set($event)" placeholder="Order ID, e.g. LGC-1083" [class.field-error]="error()" />
        </label>
        <button type="submit" class="btn-primary px-6 py-3">Track Order</button>
      </form>
      @if (error()) {
        <p class="text-error text-sm mt-3 text-center" role="alert">{{ error() }}</p>
      }
      @if (result(); as o) {
        <section class="card p-5 md:p-6 mt-5">
          <div class="flex items-center justify-between mb-5">
            <div><p class="text-xs text-on-surface-variant">Order</p><p class="font-headline-sm text-headline-sm text-primary">{{ o.id }}</p></div>
            <div class="text-right"><p class="text-xs text-on-surface-variant">Placed</p><p class="text-sm font-semibold">{{ when(o.createdAt) }}</p></div>
          </div>
          <app-order-timeline [status]="o.status" />
          @if (o.courier) { <p class="text-sm mt-4 flex items-center gap-2"><app-icon name="local_shipping" [size]="18" class="text-secondary" />{{ o.courier }}</p> }
          <ul class="mt-4 text-sm flex flex-col gap-1 border-t border-surface-container pt-4">
            @for (l of o.lines; track $index) { <li class="flex justify-between"><span>{{ l.name }} × {{ l.qty }}</span><span>{{ l.unitPrice * l.qty | inr }}</span></li> }
          </ul>
          <p class="text-xs text-on-surface-variant mt-4">Status updates in this demo come from the Admin Portal. For real-time help, <a [href]="wa" target="_blank" rel="noopener" class="text-emerald-700 font-semibold">message us on WhatsApp</a>.</p>
        </section>
      }
      <p class="text-center text-sm text-on-surface-variant mt-6">Signed in? See all orders in <a routerLink="/account" class="text-primary font-semibold">My Account</a>.</p>
    </div>
  `,
})
export class TrackComponent {
  /** optional ?id= query param */
  id = input<string>();
  private orders = inject(OrdersService);
  query = signal('');
  result = signal<Order | null>(null);
  error = signal('');
  when = formatDate;
  wa = whatsappLink('Hi! I need an update on my order.');

  constructor() {
    effect(() => {
      const id = this.id();
      if (id) {
        this.query.set(id);
        this.find(id);
      }
    });
  }

  lookup(e: Event) {
    e.preventDefault();
    this.find(this.query());
  }

  private find(q: string) {
    if (!q.trim()) {
      this.error.set('Please enter your order ID.');
      this.result.set(null);
      return;
    }
    const o = this.orders.find(q);
    this.result.set(o ?? null);
    this.error.set(o ? '' : `No order “${q.trim().toUpperCase()}” found in this browser.`);
  }
}

import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FULL_ADDRESS, STORE } from '../../core/config/store';
import { formatDate } from '../../core/lib/format';
import { whatsappLink } from '../../core/lib/whatsapp';
import { OrdersService } from '../../core/services/orders.service';
import { EmptyStateComponent } from '../../shared/ui/empty-state.component';
import { IconComponent } from '../../shared/ui/icon.component';
import { InrPipe } from '../../shared/ui/inr.pipe';
import { OrderTimelineComponent } from '../../shared/ui/order-timeline.component';

const PAYMENT_LABEL = { online: 'Online payment (demo — not charged)', cod: 'Cash on Delivery / Pay at Shop', whatsapp: 'Confirm & pay via WhatsApp' };

@Component({
  selector: 'app-order',
  imports: [RouterLink, IconComponent, InrPipe, EmptyStateComponent, OrderTimelineComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-3xl mx-auto px-margin-mobile md:px-gutter py-8 md:py-12">
      @if (order(); as o) {
        <div class="card p-6 md:p-8 text-center relative overflow-hidden">
          <div class="absolute -top-20 -right-20 w-60 h-60 bg-primary-fixed/50 rounded-full blur-3xl"></div>
          <span class="relative mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary text-white flex items-center justify-center shadow-lg animate-toast-in"><app-icon name="celebration" [size]="40" /></span>
          <h1 class="relative font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg mt-4">Yay! Your order is placed 🎉</h1>
          <p class="relative text-on-surface-variant mt-2">Order <b class="text-primary">{{ o.id }}</b> · {{ when(o.createdAt) }}</p>
          <p class="relative mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary-fixed/50 text-xs text-secondary font-semibold"><app-icon name="info" [size]="16" />Demo order — saved in this browser only, no payment was taken.</p>
          <div class="relative mt-6"><app-order-timeline [status]="o.status" /></div>
        </div>

        <div class="grid md:grid-cols-2 gap-4 mt-5">
          <section class="card p-5">
            <h2 class="font-headline-sm text-base font-semibold mb-3">{{ o.delivery === 'pickup' ? 'Store Pickup' : 'Delivering to' }}</h2>
            @if (o.delivery === 'pickup') {
              <p class="text-sm text-on-surface-variant">{{ address }}<br />Open {{ store.hours }} — we'll WhatsApp you when it's gift-wrapped and ready.</p>
            } @else {
              <p class="text-sm text-on-surface-variant"><b class="text-on-surface">{{ o.customer.name }}</b><br />{{ o.customer.address }}{{ o.customer.landmark ? ', ' + o.customer.landmark : '' }}<br />PIN {{ o.customer.pincode }} · +91 {{ o.customer.phone }}</p>
            }
            <p class="text-xs text-on-surface-variant mt-3 flex items-center gap-1"><app-icon name="payments" [size]="16" />{{ payment(o.payment) }}</p>
          </section>
          <section class="card p-5">
            <h2 class="font-headline-sm text-base font-semibold mb-3">Items</h2>
            <ul class="flex flex-col gap-2 text-sm">
              @for (l of o.lines; track $index) {
                <li class="flex items-center gap-3">
                  @if (l.image) { <img [src]="l.image" alt="" class="w-10 h-10 rounded-lg object-cover" /> }
                  <span class="flex-1 line-clamp-1">{{ l.name }} × {{ l.qty }}</span>
                  <span class="font-semibold">{{ l.unitPrice * l.qty | inr }}</span>
                </li>
              }
            </ul>
            <p class="flex justify-between border-t border-surface-container mt-3 pt-3 font-bold"><span>Total</span><span class="text-primary">{{ o.totals.grandTotal | inr }}</span></p>
          </section>
        </div>
        <div class="flex flex-col sm:flex-row gap-3 justify-center mt-6">
          <a routerLink="/track-order" [queryParams]="{ id: o.id }" class="btn-secondary px-6 py-3"><app-icon name="local_shipping" [size]="20" />Track this order</a>
          <a [href]="wa(o.id)" target="_blank" rel="noopener" class="btn-whatsapp px-6 py-3"><app-icon name="chat" [size]="20" />Message the store</a>
          <a routerLink="/shop" class="btn-primary px-6 py-3">Continue shopping</a>
        </div>
      } @else {
        <app-empty-state icon="receipt_long" title="Order not found" message="We couldn't find that order in this browser." actionLabel="Go shopping" />
      }
    </div>
  `,
})
export class OrderComponent {
  id = input.required<string>();
  private orders = inject(OrdersService);
  order = computed(() => this.orders.find(this.id()));
  store = STORE;
  address = FULL_ADDRESS;
  when = formatDate;
  payment = (p: keyof typeof PAYMENT_LABEL) => PAYMENT_LABEL[p];
  wa = (id: string) => whatsappLink(`Hi! I just placed order ${id} on the website.`);
}

import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { discountPct } from '../../core/lib/format';
import { InrPipe } from './inr.pipe';

/** Pricing cluster: current price (Inter bold), struck MRP, optional % OFF pill. */
@Component({
  selector: 'app-price',
  imports: [InrPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex items-baseline flex-wrap gap-x-2 gap-y-1' },
  template: `
    <span class="font-label-price font-bold" [class]="bigClass() + ' ' + tone()">{{ price() | inr }}</span>
    @if (pct() > 0) {
      <span class="text-[#8D8BA7] line-through" [class]="size() === 'lg' ? 'text-base' : 'text-xs'">{{ mrp() | inr }}</span>
      @if (showPct()) {
        <span class="text-[11px] font-bold font-label-badge text-secondary bg-secondary-fixed/60 px-1.5 py-0.5 rounded" [class]="pctClass()">{{ pct() }}% OFF</span>
      }
    }
  `,
})
export class PriceComponent {
  price = input.required<number>();
  mrp = input.required<number>();
  size = input<'sm' | 'md' | 'lg'>('md');
  showPct = input(false);
  pctClass = input('');
  tone = input('text-primary');
  pct = computed(() => discountPct(this.price(), this.mrp()));
  bigClass = computed(() => (this.size() === 'lg' ? 'text-[2rem] leading-none' : this.size() === 'sm' ? 'text-base' : 'text-label-price'));
}

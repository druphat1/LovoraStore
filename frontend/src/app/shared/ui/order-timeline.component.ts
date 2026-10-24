import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { ORDER_STATUSES, OrderStatus } from '../../core/services/orders.service';
import { IconComponent } from './icon.component';

@Component({
  selector: 'app-order-timeline',
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ol class="grid grid-cols-4 gap-1" aria-label="Order progress">
      @for (s of steps; track s.id; let i = $index) {
        <li class="flex flex-col items-center text-center gap-1.5 relative" [attr.aria-current]="i === current() ? 'step' : null">
          @if (i > 0) {
            <span class="absolute top-4 right-1/2 w-full h-0.5 -z-0" [class]="i <= current() ? 'bg-primary' : 'bg-surface-container-high'"></span>
          }
          <span class="relative z-10 w-8 h-8 rounded-full flex items-center justify-center" [class]="i <= current() ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-on-surface-variant'">
            <app-icon [name]="s.icon" [size]="16" />
          </span>
          <span class="text-[11px] font-semibold" [class]="i <= current() ? 'text-primary' : 'text-on-surface-variant'">{{ s.label }}</span>
        </li>
      }
    </ol>
  `,
})
export class OrderTimelineComponent {
  status = input.required<OrderStatus>();
  steps = ORDER_STATUSES;
  current = computed(() => ORDER_STATUSES.findIndex((s) => s.id === this.status()));
}

import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { IconComponent } from './icon.component';

/** Pill quantity control. size 'sm' (cards) | 'md' (cart, product page). */
@Component({
  selector: 'app-qty-stepper',
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="inline-flex items-center rounded-full bg-surface-container-low" [class]="size() === 'sm' ? 'gap-1 p-0.5' : 'gap-2 p-1'" role="group" [attr.aria-label]="label()">
      <button type="button" (click)="valueChange.emit(value() - 1)" [disabled]="value() <= min()" [class]="btn()" class="bg-surface-container-lowest text-on-surface hover:text-primary" aria-label="Decrease quantity">
        <app-icon name="remove" [size]="size() === 'sm' ? 14 : 18" />
      </button>
      <span class="min-w-[1.5rem] text-center font-label-price" [class]="size() === 'sm' ? 'text-xs' : 'text-sm'" aria-live="polite">{{ value() }}</span>
      <button type="button" (click)="valueChange.emit(value() + 1)" [disabled]="value() >= max()" [class]="btn()" class="bg-primary text-on-primary hover:bg-primary-container" aria-label="Increase quantity">
        <app-icon name="add" [size]="size() === 'sm' ? 14 : 18" />
      </button>
    </div>
  `,
})
export class QtyStepperComponent {
  value = input.required<number>();
  min = input(1);
  max = input(99);
  size = input<'sm' | 'md'>('md');
  label = input('Quantity');
  valueChange = output<number>();

  btn = computed(
    () =>
      `${this.size() === 'sm' ? 'w-6 h-6' : 'w-9 h-9'} rounded-full flex items-center justify-center shadow-sm active:scale-90 transition-all disabled:opacity-40`,
  );
}

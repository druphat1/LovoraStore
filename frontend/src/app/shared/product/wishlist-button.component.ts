import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { WishlistService } from '../../core/services/wishlist.service';
import { IconComponent } from '../ui/icon.component';

@Component({
  selector: 'app-wishlist-button',
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      type="button"
      (click)="onClick($event)"
      [attr.aria-pressed]="active()"
      [attr.aria-label]="active() ? 'Remove from wishlist' : 'Add to wishlist'"
      class="rounded-full bg-surface-container-lowest/90 backdrop-blur shadow-sm flex items-center justify-center transition-colors hover:text-primary active:scale-90"
      [class]="(size() === 'lg' ? 'w-11 h-11 ' : 'w-8 h-8 ') + (active() ? 'text-primary' : 'text-on-surface')"
    >
      @for (p of [pop()]; track p) {
        <app-icon name="favorite" [fill]="active()" [size]="size() === 'lg' ? 22 : 18" [class.animate-heart-pop]="p > 0" />
      }
    </button>
  `,
})
export class WishlistButtonComponent {
  productId = input.required<string>();
  size = input<'md' | 'lg'>('md');
  private wishlist = inject(WishlistService);
  active = computed(() => this.wishlist.ids().includes(this.productId()));
  pop = signal(0);

  onClick(e: Event) {
    e.preventDefault();
    e.stopPropagation();
    this.wishlist.toggle(this.productId());
    this.pop.update((n) => n + 1);
  }
}

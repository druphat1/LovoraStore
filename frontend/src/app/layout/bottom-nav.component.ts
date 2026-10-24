import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CartService } from '../core/services/cart.service';
import { WishlistService } from '../core/services/wishlist.service';
import { IconComponent } from '../shared/ui/icon.component';

@Component({
  selector: 'app-bottom-nav',
  imports: [RouterLink, RouterLinkActive, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'md:hidden fixed bottom-0 inset-x-0 z-40' },
  template: `
    <nav class="bg-surface/90 backdrop-blur-xl shadow-[0_-1px_12px_rgba(124,58,237,0.08)] pb-[env(safe-area-inset-bottom)]" aria-label="Primary">
      <div class="flex justify-around items-center h-[4.5rem] px-space-xs">
        @for (t of tabs; track t.label) {
          <a [routerLink]="t.link" routerLinkActive="!text-primary font-bold" [routerLinkActiveOptions]="{ exact: t.link === '/' }"
            class="flex flex-col items-center justify-center gap-1 w-16 h-16 text-on-surface-variant transition-colors">
            <span class="relative flex">
              <app-icon [name]="t.icon" />
              @if (t.badge === 'wishlist' && wishlist.count()) {
                <span class="absolute -top-1 -right-2 bg-primary text-on-primary text-[10px] font-bold px-1 rounded-full min-w-[14px] h-[14px] flex items-center justify-center">{{ wishlist.count() }}</span>
              }
              @if (t.badge === 'cart' && cart.count()) {
                <span class="absolute -top-1 -right-2 bg-secondary text-on-secondary text-[10px] font-bold px-1 rounded-full min-w-[14px] h-[14px] flex items-center justify-center">{{ cart.count() }}</span>
              }
            </span>
            <span class="font-label-badge text-[11px]">{{ t.label }}</span>
          </a>
        }
      </div>
    </nav>
  `,
})
export class BottomNavComponent {
  cart = inject(CartService);
  wishlist = inject(WishlistService);
  tabs = [
    { label: 'Home', icon: 'home', link: '/' },
    { label: 'Shop', icon: 'grid_view', link: '/shop' },
    { label: 'Wishlist', icon: 'favorite', link: '/wishlist', badge: 'wishlist' },
    { label: 'Cart', icon: 'shopping_bag', link: '/cart', badge: 'cart' },
    { label: 'Account', icon: 'person', link: '/account' },
  ];
}

import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter, map } from 'rxjs';
import { INSTAGRAM } from '../core/config/instagram';
import { STORE } from '../core/config/store';
import { CATEGORIES } from '../core/data/categories';
import { AuthService } from '../core/services/auth.service';
import { CartService } from '../core/services/cart.service';
import { UiService } from '../core/services/ui.service';
import { WishlistService } from '../core/services/wishlist.service';
import { IconComponent } from '../shared/ui/icon.component';
import { InrPipe } from '../shared/ui/inr.pipe';
import { InstagramIconComponent } from '../shared/ui/instagram-icon.component';
import { LogoComponent } from '../shared/ui/logo.component';
import { SearchBoxComponent } from './search-box.component';

@Component({
  selector: 'app-header',
  imports: [RouterLink, IconComponent, InrPipe, InstagramIconComponent, LogoComponent, SearchBoxComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block sticky top-0 z-50' },
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  /** When set (product page, admin), mobile shows a back-arrow title bar instead of the full header. */
  mobileTitle = input<string | undefined>();

  store = STORE;
  categories = CATEGORIES;

  /** Items in the scrolling announcement ticker. */
  announcements: { icon: string; text: string; href?: string }[] = [
    { icon: 'redeem', text: `Free Gift Wrapping on orders over ₹${STORE.freeShippingThreshold}` },
    { icon: 'instagram', text: `Follow us on Instagram @${INSTAGRAM.handle}`, href: INSTAGRAM.url },
    { icon: 'chat', text: `WhatsApp Support: ${STORE.phoneDisplay}`, href: `https://wa.me/${STORE.whatsappNumber}` },
    { icon: 'schedule', text: `Hours: ${STORE.hoursShort}` },
    { icon: 'local_shipping', text: 'Same-day delivery in Pathankot' },
    { icon: 'celebration', text: 'Use code BDAYLOVE for 20% off birthday gifts & hampers' },
  ];
  cart = inject(CartService);
  wishlist = inject(WishlistService);
  auth = inject(AuthService);
  ui = inject(UiService);
  private location = inject(Location);
  private router = inject(Router);

  private url = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map((e) => e.urlAfterRedirects),
    ),
    { initialValue: this.router.url },
  );

  /** Which category pill is highlighted: 'all' | category id | 'hamper' | 'offers' | ''. */
  active = computed(() => {
    const tree = this.router.parseUrl(this.url());
    const path = tree.root.children['primary']?.segments.map((s) => s.path).join('/') ?? '';
    const q = tree.queryParams;
    if (path === 'hamper-studio') return 'hamper';
    if (path !== 'shop') return '';
    if (q['sort'] === 'discount') return 'offers';
    return q['cat'] || 'all';
  });

  back() {
    if (history.length > 1) this.location.back();
    else this.router.navigateByUrl('/');
  }
}

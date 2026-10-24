import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { STORE } from '../core/config/store';
import { UiService } from '../core/services/ui.service';
import { whatsappLink } from '../core/lib/whatsapp';
import { IconComponent } from '../shared/ui/icon.component';
import { LogoComponent } from '../shared/ui/logo.component';

@Component({
  selector: 'app-mobile-drawer',
  imports: [RouterLink, IconComponent, LogoComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '(document:keydown.escape)': 'ui.drawerOpen.set(false)' },
  template: `
    @if (ui.drawerOpen()) {
      <div class="fixed inset-0 bg-inverse-surface/40 backdrop-blur-sm z-[55] animate-fade-in" (click)="close()" aria-hidden="true"></div>
    }
    <aside
      class="fixed top-0 bottom-0 left-0 w-[290px] max-w-[85vw] bg-surface-bright z-[56] shadow-level-3 flex flex-col transition-transform duration-300"
      [class]="ui.drawerOpen() ? 'translate-x-0' : '-translate-x-full invisible'"
      aria-label="Main menu"
      [attr.aria-hidden]="!ui.drawerOpen()"
    >
      <div class="p-space-md flex items-center justify-between">
        <app-logo [compact]="true" (navigated)="close()" />
        <button type="button" (click)="close()" class="w-11 h-11 flex items-center justify-center rounded-full hover:bg-surface-container" aria-label="Close menu">
          <app-icon name="close" />
        </button>
      </div>
      <nav class="flex-1 px-space-md py-space-sm space-y-1 overflow-y-auto">
        @for (l of links; track l.label) {
          <a [routerLink]="l.link" [queryParams]="l.query" [fragment]="l.fragment" (click)="close()"
            class="flex items-center gap-3 px-4 py-3 rounded-full font-headline-sm text-base text-on-surface hover:bg-surface-container active:scale-[0.98] transition-all">
            <app-icon [name]="l.icon" [size]="22" [class]="l.admin ? 'text-secondary' : 'text-primary'" />{{ l.label }}
          </a>
        }
      </nav>
      <div class="p-space-md border-t border-surface-container">
        <a [href]="wa" target="_blank" rel="noopener" class="btn-whatsapp w-full py-3"><app-icon name="chat" [size]="20" />Chat on WhatsApp</a>
        <p class="text-center text-xs text-on-surface-variant mt-2">Open daily · {{ store.hours }}</p>
      </div>
    </aside>
  `,
})
export class MobileDrawerComponent {
  ui = inject(UiService);
  store = STORE;
  wa = whatsappLink('Hi Lovely Gift Center! I need help choosing a gift.');
  links: { label: string; icon: string; link: string; query?: Record<string, string>; fragment?: string; admin?: boolean }[] = [
    { label: 'Home', icon: 'home', link: '/' },
    { label: 'Shop All', icon: 'category', link: '/shop' },
    { label: 'Diwali Lights & Décor', icon: 'emoji_objects', link: '/shop', query: { cat: 'diwali' } },
    { label: 'Toys & Plushies', icon: 'smart_toy', link: '/shop', query: { cat: 'soft-toys' } },
    { label: 'Curated Hampers', icon: 'featured_seasonal_and_gifts', link: '/shop', query: { cat: 'hampers' } },
    { label: 'Custom Hamper Studio', icon: 'auto_awesome', link: '/hamper-studio' },
    { label: 'Birthday Special', icon: 'cake', link: '/shop', query: { cat: 'birthday' } },
    { label: 'Festive Offers', icon: 'local_activity', link: '/shop', query: { sort: 'discount' } },
    { label: 'Track Order', icon: 'local_shipping', link: '/track-order' },
    { label: 'About & Store', icon: 'storefront', link: '/about' },
    { label: 'Help & FAQs', icon: 'contact_support', link: '/help' },
    { label: 'Admin Portal', icon: 'admin_panel_settings', link: '/admin', admin: true },
  ];

  close() {
    this.ui.drawerOpen.set(false);
  }
}

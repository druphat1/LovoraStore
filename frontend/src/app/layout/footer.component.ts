import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { FULL_ADDRESS, STORE } from '../core/config/store';
import { whatsappLink } from '../core/lib/whatsapp';
import { ToastService } from '../core/services/toast.service';
import { IconComponent } from '../shared/ui/icon.component';

@Component({
  selector: 'app-footer',
  imports: [FormsModule, RouterLink, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './footer.component.html',
})
export class FooterComponent {
  private toast = inject(ToastService);
  store = STORE;
  address = FULL_ADDRESS;
  year = new Date().getFullYear();
  wa = whatsappLink('Hi Lovely Gift Center! I need help with a custom hamper.');
  email = signal('');
  emailError = signal('');

  shopLinks = [
    { label: 'Diwali Lights, Diyas & Décor', query: { cat: 'diwali' } },
    { label: 'Soft Toys & Jumbo Teddies', query: { cat: 'soft-toys' } },
    { label: 'Remote Control & Action Toys', query: { cat: 'rc-action' } },
    { label: 'STEM Kits, Puzzles & Games', query: { cat: 'stem' } },
    { label: 'Festive & Corporate Hampers', query: { cat: 'hampers' } },
    { label: 'Birthday Return Gifts & Packs', query: { cat: 'birthday' } },
    { label: 'Festive Sale & Bundles', query: { sort: 'discount' } },
  ];
  careLinks = [
    { label: 'Track Your Consignment', link: '/track-order' },
    { label: 'Shipping Policy', link: '/help', fragment: 'shipping' },
    { label: 'Easy Returns & Replacement', link: '/help', fragment: 'returns' },
    { label: 'Frequently Asked Questions', link: '/help', fragment: 'faq' },
    { label: 'Contact Store Support', link: '/about', fragment: 'find-us' },
    { label: 'Terms of Service & Privacy', link: '/help', fragment: 'terms' },
  ];

  join(e: Event) {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email().trim())) {
      this.emailError.set('Enter a valid email address');
      return;
    }
    this.emailError.set('');
    this.email.set('');
    this.toast.show({ title: "You're in the Festive Discount Club!", message: 'Demo signup saved in this browser only.', icon: 'celebration' });
  }
}

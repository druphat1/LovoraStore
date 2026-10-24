import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { STORE } from '../../core/config/store';
import { CATEGORIES, TONE } from '../../core/data/categories';
import { CATALOG, categoryCount, trending } from '../../core/data/products';
import { HOME_TESTIMONIALS } from '../../core/data/reviews';
import { midnightCountdown } from '../../core/lib/countdown';
import { pad2, initials } from '../../core/lib/format';
import { whatsappLink } from '../../core/lib/whatsapp';
import { ToastService } from '../../core/services/toast.service';
import { ProductCardComponent } from '../../shared/product/product-card.component';
import { IconComponent } from '../../shared/ui/icon.component';
import { HeroToylandComponent } from './hero-toyland.component';

@Component({
  selector: 'app-home',
  imports: [RouterLink, IconComponent, ProductCardComponent, HeroToylandComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './home.component.html',
})
export class HomeComponent {
  private toast = inject(ToastService);
  store = STORE;
  categories = CATEGORIES;
  tone = TONE;
  count = categoryCount;
  best = trending().slice(0, 6);
  diwali = CATALOG.filter((p) => p.category === 'diwali').slice(0, 4);
  diwaliChips = [
    { label: '✨ LED & Fairy Lights', q: 'LED' },
    { label: '🪔 Diyas', q: 'diya' },
    { label: '🌼 Toran & Rangoli', q: 'toran' },
    { label: '🙏 Idols & Murtis', q: 'idol' },
  ];
  waWholesale = whatsappLink('Hi! I want wholesale Diwali lights / bulbs. Please share the rates.');
  /** Warm/colourful bulbs for the hanging string, with staggered twinkle. */
  bulbs = Array.from({ length: 22 }, (_, i) => ({
    y: Math.round(8 + 22 * Math.abs(Math.sin((i / 21) * Math.PI * 2))),
    delay: (i % 5) * 0.35,
    color: ['#fde68a', '#f472b6', '#fbbf24', '#a78bfa', '#fde68a', '#fb923c'][i % 6],
  }));
  testimonials = HOME_TESTIMONIALS;
  initials = initials;
  pad = pad2;
  countdown = midnightCountdown();
  year = new Date().getFullYear();
  wa = whatsappLink('Hi Lovely Gift Center! Can you help me choose the perfect gift?');

  universes = [
    { label: '🧸 Plushies & Soft Bears', cat: 'soft-toys', hover: 'hover:bg-primary-fixed hover:text-on-primary-fixed-variant' },
    { label: '🏎️ RC & Racing Stunt Cars', cat: 'rc-action', hover: 'hover:bg-secondary-fixed hover:text-on-secondary-fixed' },
    { label: '🚀 STEM & Space Gadgets', cat: 'stem', hover: 'hover:bg-tertiary-fixed hover:text-on-tertiary-fixed' },
  ];

  features = [
    { icon: 'verified', title: 'Curated with Care', text: 'Every plushie and toy is checked for non-toxic, child-safe materials and gentle cuddles.', disc: 'bg-primary-fixed text-primary' },
    { icon: 'featured_seasonal_and_gifts', title: 'Festive Gift Wrapping', text: 'Complimentary crepe wrapping, handmade satin ribbons, and handwritten cards with every order.', disc: 'bg-secondary-fixed text-secondary' },
    { icon: 'savings', title: 'Fair & Affordable', text: 'Direct partnerships with trusted toy makers keep our pricing honest, with wholesale bundle savings.', disc: 'bg-tertiary-fixed text-tertiary' },
    { icon: 'support_agent', title: 'WhatsApp Concierge', text: 'Want a live video of a toy or a custom hamper idea? Our in-store team helps you in real time.', disc: 'bg-primary-fixed-dim text-on-primary-fixed-variant' },
  ];

  async copyCoupon(code: string) {
    try {
      await navigator.clipboard.writeText(code);
      this.toast.show({ title: `Coupon ${code} copied!`, message: 'Apply it in your bag at checkout.', icon: 'content_copy' });
    } catch {
      this.toast.show({ title: `Use code ${code}`, message: 'Apply it in your bag at checkout.', icon: 'local_offer' });
    }
  }
}

import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { FULL_ADDRESS, MAPS_EMBED, MAPS_LINK, STORE } from '../../core/config/store';
import { openWhatsApp, whatsappLink } from '../../core/lib/whatsapp';
import { ToastService } from '../../core/services/toast.service';
import { AccordionComponent } from '../../shared/ui/accordion.component';
import { IconComponent } from '../../shared/ui/icon.component';

@Component({
  selector: 'app-about',
  imports: [FormsModule, IconComponent, AccordionComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './about.component.html',
})
export class AboutComponent {
  private toast = inject(ToastService);
  store = STORE;
  address = FULL_ADDRESS;
  mapsLink = MAPS_LINK;
  // Static, trusted Google Maps embed URL built from our own config.
  mapsEmbed = inject(DomSanitizer).bypassSecurityTrustResourceUrl(MAPS_EMBED);
  wa = whatsappLink('Hi Lovely Gift Center! I have a question.');
  years = new Date().getFullYear() - STORE.since;

  photos = [
    { src: '/images/store/storefront.jpg', alt: 'Lovely Gift Centre shop front in Super Bazar, Pathankot, with toys hanging at the entrance', caption: 'Our Super Bazar shop front' },
    { src: '/images/store/flowers-and-frames.jpg', alt: 'Shelves of artificial flower pots, photo frames and gift boxes', caption: 'Flowers, frames & gift boxes' },
    { src: '/images/store/gifts-and-keepsakes.jpg', alt: 'Glass shelves with couple figurines, photo frames, teddy bears and gift sets', caption: 'Keepsakes & romantic gifts' },
    { src: '/images/store/idols-and-figurines.jpg', alt: 'Shelves of decorative idols, laughing Buddha figures and showpieces', caption: 'Idols & décor showpieces' },
    { src: '/images/store/idol-gallery.jpg', alt: 'Wall display of devotional idols and lamps', caption: 'Festive & devotional gifts' },
  ];

  guarantees = [
    { icon: 'verified_user', title: 'Curated with Care', text: 'Safe, non-toxic and genuine toys chosen for gentle little hands.', disc: 'bg-primary-fixed text-primary' },
    { icon: 'redeem', title: 'Gifting Made Effortless', text: 'Signature pastel wrapping, hand-tied satin bows and heartfelt message cards.', disc: 'bg-secondary-fixed text-secondary' },
    { icon: 'volunteer_activism', title: 'Warm Community Spirit', text: 'Serving Pathankot families with tailored recommendations and joyful smiles.', disc: 'bg-tertiary-fixed text-tertiary' },
  ];

  faqs = [
    { q: 'Do you provide bulk toys for birthday return gifts?', a: 'Yes! We curate themed return-gift packs with age-appropriate toys, art kits and puzzles, with child-name gift tags. Wholesale pricing applies to orders above 15 units.' },
    { q: 'Can you pack and deliver surprises directly to the recipient?', a: 'Absolutely. We pack your present in our signature wrap with a hand-written note and never include the price or invoice inside the package.' },
    { q: 'What is the return policy for toys?', a: 'We offer a hassle-free 7-day replacement for manufacturing defects or transit damage. Send a quick photo on WhatsApp for a doorstep replacement or in-store swap.' },
    { q: 'Do you also sell décor, idols and photo frames?', a: 'Yes — our Super Bazar store stocks idols, showpieces, artificial flowers, photo frames, lamps and much more. Ask us on WhatsApp for current designs.' },
  ];

  occasions = ['Birthday Special Hamper', 'Bulk Birthday Return Gifts', 'Baby Shower & Newborn Welcome', 'Festive / Corporate Hampers', 'Anniversary & Love Surprises', 'Other Special Request'];
  inquiry = { name: '', phone: '', occasion: this.occasions[0], message: '' };
  errors = signal<{ name?: string; phone?: string }>({});
  lightbox = signal<number | null>(null);

  sendInquiry(e: Event) {
    e.preventDefault();
    const i = this.inquiry;
    const errs: { name?: string; phone?: string } = {};
    if (i.name.trim().length < 2) errs.name = 'Please tell us your name.';
    if (!/^[6-9]\d{9}$/.test(i.phone.replace(/\s|-/g, '').replace(/^\+?91/, ''))) errs.phone = 'Enter a valid 10-digit mobile number.';
    this.errors.set(errs);
    if (Object.keys(errs).length) return;
    openWhatsApp(`Hi Lovely Gift Center!\nName: ${i.name}\nPhone: ${i.phone}\nOccasion: ${i.occasion}\n${i.message ? `Details: ${i.message}` : ''}`);
    this.toast.show({ title: 'Opening WhatsApp…', message: 'Send the prefilled message to reach our gifting team.', icon: 'chat' });
  }
}

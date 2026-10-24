import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FULL_ADDRESS, STORE } from '../../core/config/store';
import { whatsappLink } from '../../core/lib/whatsapp';
import { AccordionComponent } from '../../shared/ui/accordion.component';
import { IconComponent } from '../../shared/ui/icon.component';

@Component({
  selector: 'app-help',
  imports: [RouterLink, IconComponent, AccordionComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-4xl mx-auto px-margin-mobile md:px-gutter py-8 md:py-12 flex flex-col gap-8">
      <header class="text-center">
        <span class="mx-auto w-16 h-16 rounded-full bg-primary-fixed text-primary flex items-center justify-center"><app-icon name="contact_support" [size]="32" /></span>
        <h1 class="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg mt-3">Help &amp; Store Policies</h1>
        <p class="text-on-surface-variant mt-1">Quick answers about delivery, returns and your orders.</p>
        <nav class="flex flex-wrap justify-center gap-2 mt-4" aria-label="Help sections">
          @for (s of sections; track s.id) {
            <a routerLink="/help" [fragment]="s.id" class="chip">{{ s.label }}</a>
          }
        </nav>
      </header>

      <section id="shipping" class="card p-5 md:p-7">
        <h2 class="font-headline-md text-headline-md flex items-center gap-2 mb-3"><app-icon name="local_shipping" class="text-primary" />Shipping &amp; Delivery</h2>
        <ul class="list-disc pl-5 text-on-surface-variant flex flex-col gap-1.5 text-sm md:text-base">
          <li>Same-day delivery within Pathankot (PIN 145xxx) on orders placed before 5 PM, subject to availability.</li>
          <li>1-2 days across Punjab, J&amp;K and Himachal; 2-6 days to the rest of India via tracked courier.</li>
          <li>Free delivery on orders of ₹{{ store.freeShippingThreshold }} and above; otherwise a flat ₹{{ store.deliveryFee }}.</li>
          <li>Free store pickup from {{ address }}.</li>
        </ul>
      </section>

      <section id="returns" class="card p-5 md:p-7">
        <h2 class="font-headline-md text-headline-md flex items-center gap-2 mb-3"><app-icon name="autorenew" class="text-primary" />Returns &amp; Replacement</h2>
        <p class="text-on-surface-variant text-sm md:text-base">We offer a 7-day replacement for manufacturing defects or transit damage. Message a photo of the item and packaging on WhatsApp and we'll arrange a doorstep replacement or an in-store swap. Personalised items (engraved lamps, custom hampers) can be replaced only if damaged in transit.</p>
      </section>

      <section id="faq" class="flex flex-col gap-3">
        <h2 class="font-headline-md text-headline-md flex items-center gap-2"><app-icon name="quiz" class="text-primary" />Frequently Asked Questions</h2>
        @for (f of faqs; track f.q) {
          <app-accordion [title]="f.q">{{ f.a }}</app-accordion>
        }
      </section>

      <section id="terms" class="card p-5 md:p-7">
        <h2 class="font-headline-md text-headline-md flex items-center gap-2 mb-3"><app-icon name="gavel" class="text-primary" />Terms &amp; Privacy</h2>
        <p class="text-on-surface-variant text-sm md:text-base">This website is currently a frontend demonstration. No payments are processed and no personal data is sent to a server — your cart, wishlist, account profile and demo orders are stored only in your own browser (localStorage) and can be cleared at any time from your browser settings. Prices and availability shown are indicative; please confirm with the store before visiting.</p>
        <p class="text-xs text-on-surface-variant mt-3">{{ store.name }} · {{ store.legalName }} · GSTIN {{ store.gstin }}</p>
      </section>

      <div class="rounded-3xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-6 flex flex-col sm:flex-row items-center gap-4 justify-between">
        <p class="font-headline-sm text-headline-sm">Still need help? We reply fast on WhatsApp.</p>
        <a [href]="wa" target="_blank" rel="noopener" class="px-5 py-3 rounded-full bg-white text-emerald-700 font-button-text flex items-center gap-2"><app-icon name="chat" [size]="18" />Chat with us</a>
      </div>
    </div>
  `,
})
export class HelpComponent {
  store = STORE;
  address = FULL_ADDRESS;
  wa = whatsappLink('Hi! I have a question about my order.');
  sections = [
    { id: 'shipping', label: 'Shipping' },
    { id: 'returns', label: 'Returns' },
    { id: 'faq', label: 'FAQs' },
    { id: 'terms', label: 'Terms & Privacy' },
  ];
  faqs = [
    { q: 'How do I track my order?', a: 'Use the Track Order page with the order ID shown on your confirmation (e.g. LGC-1083), or open My Account.' },
    { q: 'Is gift wrapping really free?', a: 'Yes — every order gets complimentary festive wrapping and a handwritten card. A luxury keepsake box is available for ₹49.' },
    { q: 'Which coupon codes can I use?', a: 'BDAYLOVE (20% off birthday gifts & hampers, up to ₹500), FIRSTGIFT (₹100 off orders above ₹499) and FESTIVE10 (10% off orders above ₹999, up to ₹300).' },
    { q: 'Can I pay cash?', a: 'Yes, choose Cash on Delivery / Pay at Shop at checkout, or order via WhatsApp and pay when you collect.' },
    { q: 'Do you deliver outside Punjab?', a: 'Yes, we ship pan-India by tracked courier. Check the delivery estimate for your pincode on any product page.' },
  ];
}

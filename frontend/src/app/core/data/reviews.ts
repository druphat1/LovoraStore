// Sample reviews shown on the storefront. They are labelled as samples in the UI.
import { Tone } from './categories';

export interface Review { name: string; city: string; when: string; rating: number; text: string }

export const HOME_TESTIMONIALS: { name: string; meta: string; tone: Tone; text: string }[] = [
  {
    name: 'Pooja Sharma',
    meta: 'Verified Buyer • Pathankot',
    tone: 'primary',
    text: "The Jumbo Pink Teddy arrived on my niece's 5th birthday right on time! The gift wrap with real satin ribbons and her name card made everyone tear up with joy.",
  },
  {
    name: 'Rohit Varma',
    meta: 'Bulk Gifting • Jalandhar',
    tone: 'secondary',
    text: "We ordered 25 magnetic castle kits for our society's Diwali return gifts. The store helped on WhatsApp with custom gift tags and dispatched within 24 hours. Incredible service!",
  },
  {
    name: 'Ananya Mukherjee',
    meta: 'Verified Buyer • Amritsar',
    tone: 'tertiary',
    text: 'The luxury hamper quality was beyond expectations. Solid keepsake box, fresh chocolates, and high-end aesthetics at half the price of online luxury gift boutiques.',
  },
];

export const PRODUCT_REVIEWS: Review[] = [
  { name: 'Pooja Sharma', city: 'Pathankot', when: '2 days ago', rating: 5, text: 'Bigger and softer than I expected. The handwritten card was penned with such neat calligraphy. Loved it!' },
  { name: 'Rohit Verma', city: 'Jammu', when: '1 week ago', rating: 5, text: "Ordered this for my niece's 3rd birthday. Delivered on time, zero chemical smell, beautifully wrapped." },
  { name: 'Ananya Sen', city: 'Amritsar', when: '2 weeks ago', rating: 5, text: 'The keepsake box is well worth the extra ₹49! High quality packaging. Lovely Gift Center is my go-to now.' },
];

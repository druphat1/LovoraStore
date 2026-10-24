export type Tone = 'primary' | 'secondary' | 'tertiary';

export interface Category {
  id: string;
  name: string;
  short: string;
  icon: string;
  tone: Tone;
  image: string;
}

export const CATEGORIES: Category[] = [
  { id: 'diwali', name: 'Diwali Lights & Décor', short: 'Diwali Décor', icon: 'emoji_objects', tone: 'secondary', image: '/images/diwali/clay-diyas.svg' },
  { id: 'soft-toys', name: 'Soft Toys & Teddies', short: 'Soft Toys', icon: 'cruelty_free', tone: 'primary', image: '/images/catalog/cat-teddy.jpg' },
  { id: 'rc-action', name: 'RC & Action Toys', short: 'RC & Cars', icon: 'sports_esports', tone: 'secondary', image: '/images/catalog/cat-rc-truck.jpg' },
  { id: 'stem', name: 'STEM & Learning', short: 'STEM', icon: 'psychology', tone: 'tertiary', image: '/images/catalog/magnetic-tiles.jpg' },
  { id: 'dolls', name: 'Dolls & Pretend Play', short: 'Dolls', icon: 'styler', tone: 'primary', image: '/images/catalog/cat-doll.jpg' },
  { id: 'birthday', name: 'Birthday Gifts', short: 'Birthday', icon: 'cake', tone: 'secondary', image: '/images/catalog/cat-birthday-box.jpg' },
  { id: 'hampers', name: 'Festive Hampers', short: 'Hampers', icon: 'card_giftcard', tone: 'primary', image: '/images/catalog/cat-wicker-basket.jpg' },
  { id: 'baby', name: 'Baby & Montessori', short: 'Baby', icon: 'child_care', tone: 'tertiary', image: '/images/catalog/cat-montessori.jpg' },
  { id: 'arts', name: 'Creative Arts & Crafts', short: 'Arts & Crafts', icon: 'palette', tone: 'secondary', image: '/images/catalog/cat-stationery.jpg' },
];

export const CATEGORY_BY_ID: Record<string, Category> = Object.fromEntries(CATEGORIES.map((c) => [c.id, c]));

// Full class strings (not interpolated) so Tailwind's scanner picks them up.
export const TONE: Record<Tone, { disc: string; solid: string; text: string; soft: string; hoverSolid: string }> = {
  primary: { disc: 'bg-primary-fixed text-primary', solid: 'bg-primary text-on-primary', text: 'text-primary', soft: 'bg-primary-fixed/30', hoverSolid: 'group-hover:bg-primary group-hover:text-on-primary' },
  secondary: { disc: 'bg-secondary-fixed text-secondary', solid: 'bg-secondary text-on-secondary', text: 'text-secondary', soft: 'bg-secondary-fixed/30', hoverSolid: 'group-hover:bg-secondary group-hover:text-on-secondary' },
  tertiary: { disc: 'bg-tertiary-fixed text-tertiary', solid: 'bg-tertiary text-on-tertiary', text: 'text-tertiary', soft: 'bg-tertiary-fixed/30', hoverSolid: 'group-hover:bg-tertiary group-hover:text-on-tertiary' },
};

export const AGE_GROUPS = [
  { id: '0-2', label: '0-2 Yrs', min: 0, max: 2 },
  { id: '3-5', label: '3-5 Yrs', min: 3, max: 5 },
  { id: '6-8', label: '6-8 Yrs', min: 6, max: 8 },
  { id: '9-12', label: '9-12 Yrs', min: 9, max: 12 },
  { id: 'teens', label: 'Teens & Adults', min: 13, max: 99 },
];

export const PRICE_RANGES = [
  { id: 'under-499', label: 'Under ₹499', hint: 'Pocket Friendly', min: 0, max: 498 },
  { id: '500-999', label: '₹500 - ₹999', hint: 'Most Popular', min: 499, max: 999 },
  { id: '1000-1999', label: '₹1,000 - ₹1,999', hint: 'Premium Kits', min: 1000, max: 1999 },
  { id: '2000-plus', label: '₹2,000+', hint: 'Luxury Hampers', min: 2000, max: Number.POSITIVE_INFINITY },
];

export const OCCASIONS = [
  { id: 'birthday', label: 'Birthday Surprise' },
  { id: 'anniversary', label: 'Anniversary & Couples' },
  { id: 'newborn', label: 'Newborn Baby Welcome' },
  { id: 'return-gifts', label: 'Bulk Birthday Return Gifts' },
  { id: 'festive', label: 'Festive & Diwali' },
];

export const SORTS = [
  { id: 'featured', label: 'Featured & Trending' },
  { id: 'price-asc', label: 'Price: Low to High' },
  { id: 'price-desc', label: 'Price: High to Low' },
  { id: 'rating', label: 'Top Rated' },
  { id: 'discount', label: 'Biggest Savings' },
];

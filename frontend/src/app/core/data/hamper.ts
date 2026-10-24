const img = (name: string) => `/images/catalog/${name}`;

export interface HamperBase { id: string; name: string; note: string; price: number; capacity: number; image: string }
export interface Goodie { id: string; name: string; note: string; price: number; tab: string; image: string }

// capacity = number of goodies that fit, drives the "Basket Fill Level" meter.
export const HAMPER_BASES: HamperBase[] = [
  { id: 'pink-basket', name: 'Pastel Pink Woven Basket', note: 'Ideal for plushies & baby gifts', price: 399, capacity: 8, image: img('hamper-base-pink-basket.jpg') },
  { id: 'velvet-trunk', name: 'Royal Velvet Trunk Box', note: 'Luxury gold foil embossing', price: 599, capacity: 10, image: img('hamper-base-velvet-trunk.jpg') },
  { id: 'kraft-crate', name: 'Eco Kraft Wood Crate', note: 'Rustic festive brass clasp', price: 449, capacity: 6, image: img('hamper-base-kraft-crate.jpg') },
  { id: 'carousel', name: 'Carousel Gift Tower', note: 'Grand birthday celebration', price: 699, capacity: 7, image: img('hamper-base-carousel.jpg') },
];

export const GOODIE_TABS = [
  { id: 'all', label: 'All Goodies', icon: null },
  { id: 'plush', label: 'Plushies & Soft Toys', icon: 'cruelty_free' },
  { id: 'treats', label: 'Chocolates & Treats', icon: 'cookie' },
  { id: 'keepsakes', label: 'Keepsakes & Nightlights', icon: 'light' },
  { id: 'mini-toys', label: 'Mini Toys & Crafts', icon: 'toys' },
];

export const GOODIES: Goodie[] = [
  { id: 'g-bunny', name: 'Mini Blush Bunny Plushie (20cm)', note: 'Hypoallergenic & child-safe cotton', price: 349, tab: 'plush', image: img('bunny-plush.jpg') },
  { id: 'g-ferrero', name: 'Ferrero Rocher Box (8 pcs)', note: 'Crispy hazelnut & smooth cocoa', price: 320, tab: 'treats', image: img('ferrero-box.jpg') },
  { id: 'g-nightlight', name: 'Custom Wooden Photo Nightlight', note: 'Warm amber glow, USB rechargeable', price: 599, tab: 'keepsakes', image: img('photo-nightlight-hamper.jpg') },
  { id: 'g-candle', name: 'Vanilla Soy Scented Candle', note: '35-hr burn, calming Madagascar aroma', price: 280, tab: 'keepsakes', image: img('vanilla-candle.jpg') },
  { id: 'g-drift', name: 'High-Speed Mini RC Drift Car', note: '360° spin stunts, 2.4GHz remote', price: 499, tab: 'mini-toys', image: img('mini-drift-car.jpg') },
  { id: 'g-brittle', name: 'Honey & Almond Brittles (150g)', note: 'Preservative-free gourmet snack', price: 240, tab: 'treats', image: img('honey-almond-brittle.jpg') },
  { id: 'g-ceramic', name: 'DIY Ceramic Painting Kit', note: 'Non-toxic colors, mugs & brushes', price: 399, tab: 'mini-toys', image: img('ceramic-paint-kit.jpg') },
  { id: 'g-popper', name: 'Celebration Confetti Popper', note: 'Biodegradable shimmer petals', price: 120, tab: 'treats', image: img('confetti-popper.jpg') },
  { id: 'g-unicorn', name: 'Pastel Unicorn Squishy Charm', note: 'Slow-rising sensory stress relief', price: 160, tab: 'plush', image: img('unicorn-squishy.jpg') },
  { id: 'g-silk', name: 'Cadbury Dairy Milk Silk Pack', note: 'Festive ribbon-wrapped pack', price: 175, tab: 'treats', image: img('silk-pack.jpg') },
  { id: 'g-galaxy', name: 'Galaxy Crystal Ball Nightlight', note: '3D laser engraved, wooden base', price: 449, tab: 'keepsakes', image: img('galaxy-ball.jpg') },
  { id: 'g-diyas', name: 'Hand-painted Clay Diyas (4 pcs)', note: 'Terracotta with golden dots', price: 99, tab: 'keepsakes', image: '/images/diwali/clay-diyas.svg' },
  { id: 'g-balloon', name: 'Heart Foil Balloon', note: 'Shimmering with curl ribbon', price: 149, tab: 'mini-toys', image: img('heart-balloon.jpg') },
];

export const RIBBONS = [
  { id: 'rosy-magenta', label: 'Rosy Magenta', color: '#b20a68' },
  { id: 'royal-violet', label: 'Royal Violet', color: '#712ae2' },
  { id: 'marigold-gold', label: 'Marigold Gold', color: '#d4a017' },
  { id: 'sky-teal', label: 'Sky Teal', color: '#007cb1' },
  { id: 'emerald', label: 'Festive Emerald', color: '#0f766e' },
];

export const BEDDINGS = [
  { id: 'blush-crinkle', label: 'Blush & Ivory Crinkle', note: 'Complimentary', price: 0 },
  { id: 'silk-drape', label: 'Silk Satin Drape', note: 'Soft Touch', price: 79 },
  { id: 'golden-straw', label: 'Golden Straw', note: 'Warm Rustic', price: 49 },
];

export const HAMPER_OCCASIONS = ['Birthday Special', 'Anniversary', 'Festive / Diwali', 'Baby Welcome', 'Thank You', 'Just Because'];

export const WRAP_WAIVER = 1499;
export const WRAP_FEE = 99;

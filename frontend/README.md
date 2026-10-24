# Lovely Gift Center — Angular storefront

A responsive e-commerce website for **Lovely Gift Center (Super Bazar, Pathankot)**, built from the Stitch design references (desktop and mobile screens, DESIGN.md, hero animation) and the shop's own photos.

This is a **frontend demo**. Cart, wishlist, account, orders and stock are stored in the browser's localStorage. No payment gateway, backend or real authentication is connected. See [What needs a backend](#what-needs-a-backend).

## Run it

Requires **Node.js 18.19+ / 20 / 22**.

The app lives in the `frontend/` folder of the repository:

```bash
cd frontend
npm install
npm start            # dev server → http://localhost:4200
npm run build        # production build → dist/lovely-gift-center/browser
```

No environment variables are needed.

The production build is a static site. On a static host, configure a fallback to `index.html` so deep links like `/product/jumbo-pink-teddy` work (Netlify: `/* /index.html 200`; Vercel/Firebase: SPA rewrite).

## Tech

- Angular 19: standalone components, signals, new control flow, lazy-loaded routes
- Tailwind CSS 3, using the design tokens from `DESIGN.md` (see `tailwind.config.js`)
- Google Fonts: Quicksand, Nunito Sans and Inter, plus Material Symbols icons
- No other runtime dependencies

## Pages

| Route | Page | Reference screen |
|---|---|---|
| `/` | Home: hero with the animated "Magical Toyland" on the right, categories, live-countdown offer, best-sellers, why-us, testimonials | desktop + mobile homepage, animated_svg_2 |
| `/shop` | Catalogue: search, category, price, age, occasion, stock and same-day filters; sort; grid/list view; load more; mobile filter sheet | desktop + mobile shop |
| `/product/:id` | Product details: gallery with zoom or mobile swipe, pincode check, Custom Gift Studio, add-ons, specs, reviews, sticky mobile buy bar | desktop + mobile product details |
| `/hamper-studio` | Custom hamper builder: base box, goodies with capacity meter, ribbon and bedding, calligraphy card, live summary | desktop hamper builder |
| `/cart` | Bag and express checkout: gift options, save for later, coupons, free-delivery meter, validated address, pickup/delivery, payment options | cart_express_checkout |
| `/order/:id` | Order confirmation | (added to complete the journey) |
| `/track-order` | Order tracking | (added) |
| `/wishlist` | Wishlist | (added) |
| `/account` | Demo sign-in, registration and order history | (added) |
| `/about` | About, real store photos, map, contact, WhatsApp inquiry form, FAQ | about_us_store_contact |
| `/help` | Shipping, returns, FAQ, terms and privacy | (added for footer links) |
| `/admin` | Admin portal: KPIs, order status workflow, stock adjustments, CSV export, coupons | admin_portal |

## Project structure

```
src/app/
  core/
    config/store.ts        ← store name, address, phone, WhatsApp, hours (edit here)
    data/                  ← products, categories, hamper items, sample reviews
    lib/                   ← pricing & coupons, formatting, WhatsApp links, persisted signals
    services/              ← cart, wishlist, auth (demo), orders, inventory, toast, UI state
  shared/ui/               ← icon, price, stars, qty stepper, modal, accordion, breadcrumbs…
  shared/product/          ← product card, wishlist button, quick view
  layout/                  ← header + search, category nav, mobile drawer, bottom tab bar, footer
  pages/                   ← one folder per route
public/images/catalog/     ← product images from the Stitch references (downloaded locally)
public/images/store/       ← photos of the real shop
```

## Editing content

- **Store details** (phone, WhatsApp number, hours, email): `src/app/core/config/store.ts`
- **Products, prices, stock, images:** `src/app/core/data/products.ts`
- **Coupons** (`BDAYLOVE`, `FIRSTGIFT`, `FESTIVE10`): `src/app/core/lib/pricing.ts`
- **Hamper boxes and goodies:** `src/app/core/data/hamper.ts`

## What needs a backend

| Feature | Current demo behaviour | For production |
|---|---|---|
| Payments | "Online payment" is simulated; nothing is charged | Payment gateway such as Razorpay (UPI/cards) |
| Orders | Saved in this browser only | Database + API; order notifications |
| Accounts | Profile remembered locally; password never stored | Real authentication |
| Admin portal | No login; edits local data; "Add product" and "Upload banner" show a notice | Protected admin + CMS/database |
| Reviews and newsletter | Saved locally / confirmation only | API + email service |
| Delivery estimates | Rules based on pincode prefix | Courier API |

WhatsApp ordering (prefilled `wa.me` links), phone and email links, and the Google Maps embed work as-is.

## Notes on the references

- Store name, address (Super Bazar, Pathankot), phone and GSTIN come from the shop-front photo. The references used Mumbai placeholders. Opening hours (10 AM to 9:30 PM), the support email, and whether +91 98880 78357 is on WhatsApp are assumptions; please confirm them.
- The hero animation (`animated_svg_2`) had lower-cased SVG tags and CSS animations that overrode element positions. Both are fixed in `pages/home/hero-toyland.component.ts`.
- Testimonials and reviews are sample content and are labelled as such.
- One shop photo that clearly shows a person's face was left out of the gallery.

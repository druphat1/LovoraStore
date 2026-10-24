import { Routes } from '@angular/router';

const page = (title: string) => `${title} · Lovely Gift Center`;

export const routes: Routes = [
  { path: '', title: 'Lovely Gift Center — Curated Joy & Toys', loadComponent: () => import('./pages/home/home.component').then((m) => m.HomeComponent) },
  { path: 'shop', title: page('Shop All Toys & Gifts'), loadComponent: () => import('./pages/shop/shop.component').then((m) => m.ShopComponent) },
  {
    path: 'product/:id',
    title: page('Product Details'),
    data: { mobileTitle: 'Product Details', hideBottomNav: true },
    loadComponent: () => import('./pages/product/product.component').then((m) => m.ProductComponent),
  },
  { path: 'hamper-studio', title: page('Custom Gift Hamper Studio'), loadComponent: () => import('./pages/hamper/hamper.component').then((m) => m.HamperComponent) },
  { path: 'cart', title: page('Shopping Bag & Checkout'), loadComponent: () => import('./pages/cart/cart.component').then((m) => m.CartComponent) },
  { path: 'order/:id', title: page('Order Confirmed'), loadComponent: () => import('./pages/order/order.component').then((m) => m.OrderComponent) },
  { path: 'wishlist', title: page('Wishlist'), loadComponent: () => import('./pages/wishlist/wishlist.component').then((m) => m.WishlistComponent) },
  { path: 'account', title: page('My Account'), loadComponent: () => import('./pages/account/account.component').then((m) => m.AccountComponent) },
  { path: 'track-order', title: page('Track Order'), loadComponent: () => import('./pages/track/track.component').then((m) => m.TrackComponent) },
  { path: 'about', title: page('About Us & Store'), loadComponent: () => import('./pages/about/about.component').then((m) => m.AboutComponent) },
  { path: 'help', title: page('Help & Policies'), loadComponent: () => import('./pages/help/help.component').then((m) => m.HelpComponent) },
  {
    path: 'admin',
    title: page('Admin Portal'),
    data: { mobileTitle: 'Admin Portal' },
    loadComponent: () => import('./pages/admin/admin.component').then((m) => m.AdminComponent),
  },
  { path: '**', title: page('Page not found'), loadComponent: () => import('./pages/not-found/not-found.component').then((m) => m.NotFoundComponent) },
];

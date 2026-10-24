import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { formatDate, initials } from '../../core/lib/format';
import { AuthService } from '../../core/services/auth.service';
import { OrdersService } from '../../core/services/orders.service';
import { ToastService } from '../../core/services/toast.service';
import { WishlistService } from '../../core/services/wishlist.service';
import { IconComponent } from '../../shared/ui/icon.component';
import { InrPipe } from '../../shared/ui/inr.pipe';

type Field = 'name' | 'email' | 'phone' | 'password';

@Component({
  selector: 'app-account',
  imports: [FormsModule, RouterLink, IconComponent, InrPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './account.component.html',
})
export class AccountComponent {
  auth = inject(AuthService);
  wishlist = inject(WishlistService);
  private orders = inject(OrdersService);
  private toast = inject(ToastService);

  mode = signal<'login' | 'register'>('login');
  form = { name: '', email: '', phone: '', password: '' };
  errors = signal<Partial<Record<Field, string>>>({});
  initials = initials;
  when = formatDate;

  myOrders = computed(() => {
    const email = this.auth.user()?.email;
    return this.orders.orders().filter((o) => !o.demo && (!o.userEmail || o.userEmail === email));
  });

  switchMode(m: 'login' | 'register') {
    this.mode.set(m);
    this.errors.set({});
  }

  submit(e: Event) {
    e.preventDefault();
    const f = this.form;
    const errs: Partial<Record<Field, string>> = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim())) errs.email = 'Enter a valid email address.';
    if (f.password.length < 6) errs.password = 'Password must be at least 6 characters.';
    if (this.mode() === 'register') {
      if (f.name.trim().length < 2) errs.name = 'Please enter your name.';
      if (f.phone && !/^[6-9]\d{9}$/.test(f.phone.replace(/\s/g, ''))) errs.phone = 'Enter a valid 10-digit mobile number.';
    }
    this.errors.set(errs);
    if (Object.keys(errs).length) return;

    const user = this.mode() === 'register' ? this.auth.register(f) : this.auth.login(f.email);
    this.form = { name: '', email: '', phone: '', password: '' };
    this.toast.show({ title: `Welcome, ${user.name}!`, message: 'Demo account — stored in this browser only.', icon: 'waving_hand' });
  }

  logout() {
    this.auth.logout();
    this.toast.show({ title: 'Signed out', icon: 'logout' });
  }
}

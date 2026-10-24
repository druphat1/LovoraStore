import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, map } from 'rxjs';
import { BottomNavComponent } from './layout/bottom-nav.component';
import { FooterComponent } from './layout/footer.component';
import { HeaderComponent } from './layout/header.component';
import { MobileDrawerComponent } from './layout/mobile-drawer.component';
import { ScrollButtonsComponent } from './layout/scroll-buttons.component';
import { QuickViewComponent } from './shared/product/quick-view.component';
import { ToastOutletComponent } from './shared/ui/toast-outlet.component';

interface ShellData {
  mobileTitle?: string;
  hideBottomNav?: boolean;
  /** Page has its own mobile bottom bar above the tab bar; lift floating buttons above it. */
  raiseFloating?: boolean;
}

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, FooterComponent, MobileDrawerComponent, BottomNavComponent, QuickViewComponent, ToastOutletComponent, ScrollButtonsComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <a href="#main" class="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[80] btn-primary px-4 py-2">Skip to content</a>
    <app-header [mobileTitle]="shell().mobileTitle" />
    <app-mobile-drawer />
    <main id="main" class="min-h-[60vh]">
      <router-outlet />
    </main>
    <app-footer />
    @if (!shell().hideBottomNav) {
      <app-bottom-nav />
    }
    <app-scroll-buttons [raised]="!!shell().raiseFloating" />
    <app-quick-view />
    <app-toast-outlet />
  `,
})
export class AppComponent {
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  /** Data of the deepest active route — drives the mobile title bar and bottom nav. */
  shell = toSignal(
    this.router.events.pipe(
      filter((e) => e instanceof NavigationEnd),
      map(() => {
        let r = this.route.snapshot;
        while (r.firstChild) r = r.firstChild;
        return r.data as ShellData;
      }),
    ),
    { initialValue: {} as ShellData },
  );
}

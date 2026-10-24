import { ChangeDetectionStrategy, Component, DestroyRef, inject, input, NgZone, signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

/**
 * Two floating buttons that stay hidden while the hero is on screen:
 *  - bottom-left: mouse icon inside a scroll-progress ring; click scrolls down one screen
 *  - bottom-right: navy back-to-top arrow; click returns to the hero
 * The hero is the element with id="hero" (homepage); other pages use ~one screen of scrolling.
 */
@Component({
  selector: 'app-scroll-buttons',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- Scroll-progress / scroll-down -->
    <button
      type="button"
      (click)="scrollDown()"
      class="fixed z-40 left-3 md:left-6 w-10 h-10 md:w-14 md:h-14 rounded-full bg-surface-container-lowest flex items-center justify-center shadow-level-1 transition-all duration-300"
      [class]="(visible() ? 'opacity-100 translate-y-0 ' : 'opacity-0 translate-y-4 pointer-events-none ') + offset()"
      [attr.aria-hidden]="!visible()"
      [attr.tabindex]="visible() ? 0 : -1"
      aria-label="Scroll down"
      title="Scroll down"
    >
      <svg class="absolute inset-0 -rotate-90" viewBox="0 0 56 56" aria-hidden="true">
        <circle cx="28" cy="28" r="26" fill="none" stroke="#d2bbff" stroke-width="1.5" />
        <circle cx="28" cy="28" r="26" fill="none" stroke="#712ae2" stroke-width="2" stroke-linecap="round" [attr.stroke-dasharray]="circ" [attr.stroke-dashoffset]="circ * (1 - progress())" />
      </svg>
      <svg class="w-[13px] h-5 md:w-[18px] md:h-7" viewBox="0 0 18 28" aria-hidden="true">
        <rect x="1.25" y="1.25" width="15.5" height="25.5" rx="7.75" fill="none" stroke="#1c192c" stroke-width="1.6" />
        <rect class="scroll-wheel" x="7.5" y="6" width="3" height="6" rx="1.5" fill="#1c192c" />
      </svg>
    </button>

    <!-- Back to top -->
    <button
      type="button"
      (click)="toTop()"
      class="fixed z-40 right-3 md:right-6 w-10 h-10 md:w-12 md:h-12 rounded-full bg-surface-container-lowest border-2 border-[#1e2a5c] text-[#1e2a5c] flex items-center justify-center shadow-level-1 hover:bg-[#1e2a5c] hover:text-white transition-all duration-300"
      [class]="(visible() ? 'opacity-100 translate-y-0 ' : 'opacity-0 translate-y-4 pointer-events-none ') + offset()"
      [attr.aria-hidden]="!visible()"
      [attr.tabindex]="visible() ? 0 : -1"
      aria-label="Back to top"
      title="Back to top"
    >
      <svg class="w-4 h-4 md:w-5 md:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M12 19V5M5.5 11.5L12 5l6.5 6.5" />
      </svg>
    </button>
  `,
})
export class ScrollButtonsComponent {
  /** Lift the buttons on mobile when a page has its own bottom bar (product, hamper studio). */
  raised = input(false);

  visible = signal(false);
  progress = signal(0);
  circ = 2 * Math.PI * 26;

  private zone = inject(NgZone);
  private reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  constructor() {
    let frame = 0;
    const update = () => {
      frame = 0;
      const hero = document.getElementById('hero');
      const threshold = hero ? hero.offsetTop + hero.offsetHeight - 80 : window.innerHeight * 0.9;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const y = window.scrollY;
      // Signals are zone-agnostic; only touch them when the value changes.
      const show = y > threshold;
      if (show !== this.visible()) this.visible.set(show);
      const p = max > 0 ? Math.min(1, y / max) : 0;
      if (Math.abs(p - this.progress()) > 0.005) this.progress.set(p);
    };
    const onScroll = () => (frame ||= requestAnimationFrame(update));
    // Listen outside Angular's zone: scroll fires constantly and doesn't need change detection.
    this.zone.runOutsideAngular(() => {
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onScroll, { passive: true });
    });
    // Re-evaluate after each navigation (new page, possibly no hero).
    const sub = inject(Router)
      .events.pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe(() => setTimeout(update, 50));
    inject(DestroyRef).onDestroy(() => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      sub.unsubscribe();
    });
  }

  offset() {
    // Mobile: clear the bottom tab bar (4.5rem), or the page's own bar when raised.
    return this.raised() ? 'bottom-[9.25rem] md:bottom-6' : 'bottom-[5.25rem] md:bottom-6';
  }

  scrollDown() {
    window.scrollBy({ top: window.innerHeight * 0.85, behavior: this.reduceMotion ? 'auto' : 'smooth' });
  }

  toTop() {
    window.scrollTo({ top: 0, behavior: this.reduceMotion ? 'auto' : 'smooth' });
  }
}

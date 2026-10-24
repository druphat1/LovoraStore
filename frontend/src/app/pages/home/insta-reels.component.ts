import { AfterViewInit, ChangeDetectionStrategy, Component, DestroyRef, ElementRef, inject, signal, viewChild, viewChildren } from '@angular/core';
import { INSTAGRAM, Reel, REELS } from '../../core/config/instagram';
import { IconComponent } from '../../shared/ui/icon.component';
import { InstagramIconComponent } from '../../shared/ui/instagram-icon.component';
import { SoundIconComponent } from '../../shared/ui/sound-icon.component';

/**
 * Edge-to-edge row of Instagram reels (self-hosted files in public/videos, listed in
 * core/config/instagram.ts). Previews play muted on loop only while visible; the round button
 * toggles a preview's sound. Clicking a reel opens it full screen with sound (Esc / × / backdrop closes).
 * With no videos configured it shows a Follow banner instead.
 */
@Component({
  selector: 'app-insta-reels',
  imports: [IconComponent, InstagramIconComponent, SoundIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block', '(document:keydown.escape)': 'closeViewer()' },
  template: `
    <section class="w-full py-8 md:py-12" aria-labelledby="reels-title">
      <!-- Instagram heading: title between rules, handle + Follow -->
      <div class="max-w-7xl mx-auto px-margin-mobile md:px-gutter flex flex-col items-center text-center">
        <div class="w-full flex items-center gap-3 md:gap-6">
          <span class="flex-1 h-px bg-on-surface/25" aria-hidden="true"></span>
          <h2 id="reels-title" class="font-headline-md text-xl md:text-[2rem] md:leading-tight font-medium uppercase tracking-wide text-on-surface">Watch Us on Instagram</h2>
          <span class="flex-1 h-px bg-on-surface/25" aria-hidden="true"></span>
        </div>
        <div class="mt-3 mb-5 md:mb-7 flex flex-wrap items-center justify-center gap-3">
          <a [href]="ig.url" target="_blank" rel="noopener" class="font-semibold text-on-surface hover:text-[#dc2743]">&#64;{{ ig.handle }}</a>
          <a [href]="ig.url" target="_blank" rel="noopener" class="ig-gradient inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-white text-sm font-button-text shadow-md hover:-translate-y-0.5 transition-all">
            <app-instagram-icon [size]="16" />Follow
          </a>
        </div>
      </div>

      @if (reels.length) {
        <div class="relative">
          <div #track class="flex gap-3 md:gap-5 overflow-x-auto no-scrollbar snap-x snap-mandatory px-margin-mobile md:px-6 pb-2 scroll-smooth" [class]="few ? 'md:justify-center' : ''">
            @for (r of reels; track r.src; let i = $index) {
              <!-- Desktop: height-capped so heading + reels fit one screen at any window size/zoom -->
              <figure class="relative snap-start shrink-0 w-[58vw] max-w-[230px] md:w-auto md:max-w-none md:h-[clamp(300px,calc(100vh-300px),520px)] aspect-[9/16] rounded-2xl overflow-hidden bg-inverse-surface shadow-level-2 group">
                <video
                  #vid
                  class="w-full h-full object-cover cursor-pointer transition-transform duration-300 group-hover:scale-[1.02]"
                  [src]="r.src"
                  [poster]="r.poster ?? ''"
                  [muted]="true"
                  loop
                  playsinline
                  preload="metadata"
                  [attr.aria-label]="r.caption"
                  (click)="openViewer(i)"
                ></video>
                <button
                  type="button"
                  (click)="toggleSound(i)"
                  class="absolute top-3 right-3 w-11 h-11 md:w-12 md:h-12 rounded-full bg-black/40 backdrop-blur-sm text-white flex items-center justify-center shadow-[0_2px_8px_rgba(0,0,0,0.25)] hover:bg-black/55 transition-colors"
                  [attr.aria-label]="unmuted() === i ? 'Mute video' : 'Play with sound'"
                >
                  <app-sound-icon [muted]="unmuted() !== i" [size]="24" />
                </button>
                @if (r.caption) {
                  <figcaption class="absolute inset-x-0 bottom-0 p-3 pt-10 bg-gradient-to-t from-black/70 to-transparent text-white text-sm font-semibold leading-snug pointer-events-none">
                    <span class="line-clamp-2">{{ r.caption }}</span>
                  </figcaption>
                }
                @if (r.link) {
                  <a [href]="r.link" target="_blank" rel="noopener" class="absolute top-3 left-3 w-9 h-9 rounded-full bg-black/55 backdrop-blur text-white flex items-center justify-center" aria-label="Open this reel on Instagram">
                    <app-instagram-icon [size]="18" />
                  </a>
                }
              </figure>
            }
          </div>
          <!-- Desktop scroll arrows (only when the row overflows) -->
          @if (!few) {
            <button type="button" (click)="scroll(-1)" class="hidden md:flex absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-surface-container-lowest/95 shadow-level-2 items-center justify-center hover:text-primary" aria-label="Previous reels"><app-icon name="chevron_left" /></button>
            <button type="button" (click)="scroll(1)" class="hidden md:flex absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-surface-container-lowest/95 shadow-level-2 items-center justify-center hover:text-primary" aria-label="Next reels"><app-icon name="chevron_right" /></button>
          }
        </div>
      } @else {
        <div class="max-w-7xl mx-auto px-margin-mobile md:px-gutter">
          <a [href]="ig.url" target="_blank" rel="noopener" class="ig-gradient flex items-center gap-4 rounded-3xl p-5 md:p-6 text-white shadow-level-2 hover:-translate-y-0.5 transition-all">
            <span class="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center shrink-0"><app-instagram-icon [size]="30" /></span>
            <span class="flex-1">
              <span class="block font-headline-sm text-headline-sm">See our latest reels &amp; store tours</span>
              <span class="block text-sm opacity-90">Follow &#64;{{ ig.handle }} for new arrivals, Diwali lights and gift ideas.</span>
            </span>
            <app-icon name="arrow_forward" />
          </a>
        </div>
      }
    </section>

    <!-- Full-screen viewer -->
    @if (viewing(); as r) {
      <div class="fixed inset-0 z-[80] bg-black/75 backdrop-blur-md flex items-center justify-center animate-fade-in" (click)="closeViewer()" role="dialog" aria-modal="true" [attr.aria-label]="r.caption || 'Instagram reel'">
        <div #panel tabindex="-1" class="relative aspect-[9/16] rounded-3xl overflow-hidden bg-black shadow-level-3 animate-toast-in outline-none focus:outline-none" [style.height]="'min(92vh, 167vw)'" (click)="$event.stopPropagation()">
          <video #viewerVideo class="w-full h-full object-cover" [src]="r.src" [poster]="r.poster ?? ''" loop playsinline (click)="togglePlay()"></video>
          <button
            type="button"
            (click)="toggleViewerSound()"
            class="viewer-btn absolute top-4 left-4 w-12 h-12 rounded-full bg-black/45 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/60 transition-colors"
            [attr.aria-label]="viewerMuted() ? 'Unmute' : 'Mute'"
          >
            <app-sound-icon [muted]="viewerMuted()" [size]="26" />
          </button>
          <button
            type="button"
            (click)="closeViewer()"
            class="viewer-btn absolute top-4 right-4 w-12 h-12 rounded-full bg-black/45 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/60 transition-colors"
            aria-label="Close video"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
          </button>
          @if (r.caption) {
            <p class="absolute inset-x-0 bottom-0 p-4 pt-12 bg-gradient-to-t from-black/70 to-transparent text-white text-base font-semibold pointer-events-none">{{ r.caption }}</p>
          }
        </div>
      </div>
    }
  `,
})
export class InstaReelsComponent implements AfterViewInit {
  ig = INSTAGRAM;
  reels = REELS;
  /** Up to four reels fit a desktop row; with that few, center them and skip the arrows. */
  few = REELS.length <= 4;
  unmuted = signal<number | null>(null);
  viewing = signal<Reel | null>(null);
  viewerMuted = signal(false);

  private videos = viewChildren<ElementRef<HTMLVideoElement>>('vid');
  private track = viewChild<ElementRef<HTMLElement>>('track');
  private viewerVideo = viewChild<ElementRef<HTMLVideoElement>>('viewerVideo');
  private panel = viewChild<ElementRef<HTMLElement>>('panel');
  private destroyRef = inject(DestroyRef);
  private visible = new Set<HTMLVideoElement>();
  private reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  private lastFocus: HTMLElement | null = null;

  ngAfterViewInit() {
    const els = this.cards();
    if (!els.length) return;
    // A plain `muted` attribute is ignored on script-created <video>s, and browsers only
    // autoplay muted video — so set the property explicitly.
    els.forEach((v) => (v.muted = true));
    // Play previews only while on screen to save data and battery; never autoplay for reduced-motion users.
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          const v = e.target as HTMLVideoElement;
          if (e.isIntersecting) this.visible.add(v);
          else this.visible.delete(v);
          if (e.isIntersecting && !this.reduceMotion && !this.viewing()) v.play().catch(() => {});
          else v.pause();
        }),
      { threshold: 0.5 },
    );
    els.forEach((el) => io.observe(el));
    this.destroyRef.onDestroy(() => {
      io.disconnect();
      document.body.style.overflow = '';
    });
  }

  /** Tap a preview's sound button: play it with sound (muting any other); tap again to mute. */
  toggleSound(i: number) {
    const els = this.cards();
    const turnOn = this.unmuted() !== i;
    els.forEach((v, j) => (v.muted = !(turnOn && j === i)));
    if (turnOn) els[i].play().catch(() => {});
    this.unmuted.set(turnOn ? i : null);
  }

  /** Open a reel full screen, continuing from where its preview was, with sound on. */
  openViewer(i: number) {
    const els = this.cards();
    const startAt = els[i]?.currentTime ?? 0;
    els.forEach((v) => {
      v.pause();
      v.muted = true;
    });
    this.unmuted.set(null);
    this.lastFocus = document.activeElement as HTMLElement | null;
    this.viewerMuted.set(false);
    this.viewing.set(this.reels[i]);
    document.body.style.overflow = 'hidden';
    // The viewer <video> exists after this change-detection pass.
    setTimeout(() => {
      const v = this.viewerVideo()?.nativeElement;
      if (!v) return;
      v.currentTime = startAt;
      v.muted = false;
      v.play().catch(() => {
        // Browser refused sound without interaction — fall back to muted playback.
        v.muted = true;
        this.viewerMuted.set(true);
        v.play().catch(() => {});
      });
      // Focus the viewer itself (no visible outline) so keyboard users land inside it.
      this.panel()?.nativeElement.focus();
    });
  }

  closeViewer() {
    if (!this.viewing()) return;
    this.viewerVideo()?.nativeElement.pause();
    this.viewing.set(null);
    document.body.style.overflow = '';
    this.lastFocus?.focus?.();
    if (!this.reduceMotion) this.visible.forEach((v) => v.play().catch(() => {}));
  }

  toggleViewerSound() {
    const v = this.viewerVideo()?.nativeElement;
    if (!v) return;
    v.muted = !v.muted;
    if (!v.muted) v.play().catch(() => {});
    this.viewerMuted.set(v.muted);
  }

  togglePlay() {
    const v = this.viewerVideo()?.nativeElement;
    if (v) v.paused ? v.play().catch(() => {}) : v.pause();
  }

  scroll(dir: 1 | -1) {
    const el = this.track()?.nativeElement;
    el?.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: 'smooth' });
  }

  private cards() {
    return this.videos().map((v) => v.nativeElement);
  }
}

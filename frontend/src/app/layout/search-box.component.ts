import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CATEGORIES } from '../core/data/categories';
import { CATALOG, cardImage } from '../core/data/products';
import { IconComponent } from '../shared/ui/icon.component';
import { InrPipe } from '../shared/ui/inr.pipe';

/** Capsule search with category scope (desktop) and live product suggestions. */
@Component({
  selector: 'app-search-box',
  imports: [FormsModule, RouterLink, IconComponent, InrPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block relative' },
  template: `
    <form role="search" (submit)="submit($event)" class="w-full flex items-center rounded-full transition-all"
      [class]="variant() === 'desktop'
        ? 'bg-surface-container-low px-space-sm py-space-xs focus-within:ring-2 focus-within:ring-primary shadow-inner'
        : 'bg-surface-container-lowest h-11 shadow-[0_2px_10px_rgba(124,58,237,0.06)] focus-within:ring-2 focus-within:ring-primary/30'">
      @if (variant() === 'desktop') {
        <label class="flex items-center pl-space-sm pr-space-xs text-on-surface-variant border-r border-outline-variant/30">
          <app-icon name="category" [size]="18" class="mr-1 text-primary" />
          <span class="sr-only">Search in category</span>
          <select [(ngModel)]="scope" name="scope" class="bg-transparent text-on-surface focus:outline-none cursor-pointer pr-space-xs font-body-sm text-body-sm max-w-[8.5rem]">
            <option value="">All Items</option>
            @for (c of categories; track c.id) {
              <option [value]="c.id">{{ c.short }}</option>
            }
          </select>
        </label>
      } @else {
        <app-icon name="search" [size]="20" class="ml-3.5 text-on-surface-variant" />
      }
      <input
        type="search"
        name="q"
        [ngModel]="query()"
        (ngModelChange)="query.set($event); open.set(true)"
        (focus)="open.set(true)"
        (blur)="closeSoon()"
        (keydown.escape)="open.set(false)"
        autocomplete="off"
        aria-label="Search products"
        placeholder="Search toys, teddy bears, hampers, games..."
        class="w-full bg-transparent px-space-sm py-space-xs text-on-surface font-body-sm text-body-sm placeholder:text-on-surface-variant/70 focus:outline-none"
      />
      @if (variant() === 'desktop') {
        <button type="submit" class="w-9 h-9 rounded-full bg-primary text-on-primary flex items-center justify-center hover:bg-primary-container transition-all hover:scale-105 shrink-0" aria-label="Search">
          <app-icon name="search" [size]="18" />
        </button>
      }
    </form>

    @if (open() && suggestions().length) {
      <ul class="absolute left-0 right-0 top-full mt-2 z-50 card p-2 shadow-level-2 max-h-96 overflow-y-auto" role="listbox">
        @for (p of suggestions(); track p.id) {
          <li>
            <a [routerLink]="['/product', p.id]" (mousedown)="$event.preventDefault()" (click)="pick()" class="flex items-center gap-3 p-2 rounded-2xl hover:bg-surface-container-low">
              <img [src]="image(p)" alt="" class="w-12 h-12 rounded-xl object-cover" />
              <span class="flex-1 min-w-0">
                <span class="block font-headline-sm text-sm font-semibold text-on-surface line-clamp-1">{{ p.shortName }}</span>
                <span class="block text-xs text-on-surface-variant">{{ p.subtitle }}</span>
              </span>
              <span class="font-label-price text-sm font-bold text-primary">{{ p.price | inr }}</span>
            </a>
          </li>
        }
        <li>
          <button type="button" (mousedown)="$event.preventDefault()" (click)="go()" class="w-full text-left px-3 py-2 text-sm font-button-text text-secondary hover:underline">
            See all results for “{{ query() }}”
          </button>
        </li>
      </ul>
    }
  `,
})
export class SearchBoxComponent {
  variant = input<'desktop' | 'mobile'>('desktop');
  private router = inject(Router);
  categories = CATEGORIES;
  scope = '';
  query = signal('');
  open = signal(false);
  image = cardImage;

  suggestions = computed(() => {
    const q = this.query().trim().toLowerCase();
    if (q.length < 2) return [];
    return CATALOG.filter((p) => `${p.name} ${p.subtitle ?? ''} ${p.category}`.toLowerCase().includes(q)).slice(0, 5);
  });

  submit(e: Event) {
    e.preventDefault();
    this.go();
  }

  go() {
    const q = this.query().trim();
    this.router.navigate(['/shop'], { queryParams: { q: q || null, cat: this.scope || null } });
    this.open.set(false);
  }

  pick() {
    this.open.set(false);
    this.query.set('');
  }

  closeSoon() {
    setTimeout(() => this.open.set(false), 150);
  }
}

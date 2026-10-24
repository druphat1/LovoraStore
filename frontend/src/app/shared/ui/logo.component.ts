import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { STORE } from '../../core/config/store';
import { IconComponent } from './icon.component';

@Component({
  selector: 'app-logo',
  imports: [RouterLink, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <a routerLink="/" (click)="navigated.emit()" class="flex items-center gap-space-sm group shrink-0" [attr.aria-label]="store.name + ' home'">
      <span
        class="rounded-full bg-primary-fixed flex items-center justify-center text-primary shadow-[0_2px_8px_rgba(178,10,104,0.15)] transition-transform group-hover:scale-105"
        [class]="compact() ? 'w-9 h-9' : 'w-11 h-11'"
      >
        <app-icon name="featured_seasonal_and_gifts" [size]="compact() ? 20 : 24" />
      </span>
      <span class="flex flex-col">
        <span class="font-headline-sm text-primary tracking-tight font-bold" [class]="compact() ? 'text-lg leading-tight' : 'text-headline-sm'">{{ store.name }}</span>
        @if (!compact()) {
          <span class="font-label-badge text-label-badge text-on-surface-variant uppercase tracking-wider">{{ store.tagline }}</span>
        }
      </span>
    </a>
  `,
})
export class LogoComponent {
  compact = input(false);
  navigated = output<void>();
  store = STORE;
}

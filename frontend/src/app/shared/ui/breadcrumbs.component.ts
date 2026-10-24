import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IconComponent } from './icon.component';

export interface Crumb {
  label: string;
  link?: string;
  query?: Record<string, string>;
}

@Component({
  selector: 'app-breadcrumbs',
  imports: [RouterLink, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nav aria-label="Breadcrumb" class="flex items-center flex-wrap gap-1 font-body-sm text-xs md:text-sm text-on-surface-variant">
      <a routerLink="/" class="flex items-center gap-1 hover:text-primary"><app-icon name="home" [size]="16" />Home</a>
      @for (it of items(); track it.label; let last = $last) {
        <span class="flex items-center gap-1">
          <app-icon name="chevron_right" [size]="16" class="opacity-50" />
          @if (it.link && !last) {
            <a [routerLink]="it.link" [queryParams]="it.query" class="hover:text-primary">{{ it.label }}</a>
          } @else {
            <span class="text-primary font-semibold line-clamp-1" aria-current="page">{{ it.label }}</span>
          }
        </span>
      }
    </nav>
  `,
})
export class BreadcrumbsComponent {
  items = input.required<Crumb[]>();
}

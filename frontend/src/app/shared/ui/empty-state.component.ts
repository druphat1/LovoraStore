import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IconComponent } from './icon.component';

@Component({
  selector: 'app-empty-state',
  imports: [RouterLink, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="card flex flex-col items-center text-center px-6 py-14 gap-3">
      <div class="w-20 h-20 rounded-full bg-primary-fixed flex items-center justify-center text-primary mb-2">
        <app-icon [name]="icon()" [size]="40" />
      </div>
      <h2 class="font-headline-md text-headline-md text-on-surface">{{ title() }}</h2>
      @if (message()) {
        <p class="font-body-md text-on-surface-variant max-w-md">{{ message() }}</p>
      }
      @if (actionLabel()) {
        <a [routerLink]="actionLink()" class="btn-primary px-6 py-3 mt-2">{{ actionLabel() }} <app-icon name="arrow_forward" [size]="20" /></a>
      }
    </div>
  `,
})
export class EmptyStateComponent {
  icon = input.required<string>();
  title = input.required<string>();
  message = input('');
  actionLabel = input('');
  actionLink = input('/shop');
}

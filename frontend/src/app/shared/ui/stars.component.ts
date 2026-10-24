import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { IconComponent } from './icon.component';

@Component({
  selector: 'app-stars',
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'inline-flex items-center gap-0.5 text-marigold', role: 'img', '[attr.aria-label]': 'value() + " out of 5 stars"' },
  template: `
    @for (i of [1, 2, 3, 4, 5]; track i) {
      <app-icon [name]="value() >= i - 0.25 || value() < i - 0.75 ? 'star' : 'star_half'" [fill]="value() >= i - 0.75" [size]="size()" [class.opacity-30]="value() < i - 0.75" />
    }
  `,
})
export class StarsComponent {
  value = input(5);
  size = input(16);
}

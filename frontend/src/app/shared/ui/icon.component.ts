import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** Material Symbols Outlined glyph. Decorative (aria-hidden). */
@Component({
  selector: 'app-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'inline-flex shrink-0', 'aria-hidden': 'true' },
  template: `<span class="material-symbols-outlined" [class.icon-fill]="fill()" [style.font-size.px]="size()">{{ name() }}</span>`,
})
export class IconComponent {
  name = input.required<string>();
  size = input(24);
  fill = input(false);
}

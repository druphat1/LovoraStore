import { ChangeDetectionStrategy, Component, input, linkedSignal } from '@angular/core';
import { IconComponent } from './icon.component';

let nextId = 0;

@Component({
  selector: 'app-accordion',
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block rounded-2xl bg-surface-container-low overflow-hidden' },
  template: `
    <button
      type="button"
      (click)="open.set(!open())"
      [attr.aria-expanded]="open()"
      [attr.aria-controls]="id"
      class="w-full flex items-center gap-3 px-4 py-3.5 text-left font-headline-sm text-sm md:text-base text-on-surface hover:bg-surface-container transition-colors"
    >
      @if (icon()) {
        <app-icon [name]="icon()" [size]="20" class="text-primary" />
      }
      <span class="flex-1">{{ title() }}</span>
      <app-icon name="expand_more" class="transition-transform" [class.rotate-180]="open()" />
    </button>
    @if (open()) {
      <div [id]="id" class="px-4 pb-4 font-body-sm text-body-sm text-on-surface-variant"><ng-content /></div>
    }
  `,
})
export class AccordionComponent {
  title = input.required<string>();
  icon = input('');
  defaultOpen = input(false);
  open = linkedSignal(() => this.defaultOpen());
  id = `acc-${++nextId}`;
}

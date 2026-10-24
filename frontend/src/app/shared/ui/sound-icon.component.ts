import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** Solid speaker glyph: with a small "×" when muted, with sound waves when on. Inherits currentColor. */
@Component({
  selector: 'app-sound-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'inline-flex shrink-0', 'aria-hidden': 'true' },
  template: `
    <svg [attr.width]="size()" [attr.height]="size()" viewBox="0 0 24 24" fill="none">
      <path d="M3.5 9.2c0-.6.5-1.1 1.1-1.1H7l4.1-3.6c.7-.6 1.9-.1 1.9.9v13.2c0 1-1.2 1.5-1.9.9L7 15.9H4.6c-.6 0-1.1-.5-1.1-1.1V9.2z" fill="currentColor" />
      @if (muted()) {
        <path d="M16.2 10l4 4m0-4l-4 4" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" />
      } @else {
        <path d="M16 9.2a4 4 0 010 5.6M18.6 6.8a7.4 7.4 0 010 10.4" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" />
      }
    </svg>
  `,
})
export class SoundIconComponent {
  muted = input(true);
  size = input(22);
}

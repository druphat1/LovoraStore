import { ChangeDetectionStrategy, Component, effect, ElementRef, input, output, viewChild } from '@angular/core';
import { IconComponent } from './icon.component';

/**
 * Accessible dialog. variant 'center' or 'sheet' (bottom sheet on mobile,
 * centered on md+). Closes on Escape and backdrop click; restores focus.
 */
@Component({
  selector: 'app-modal',
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '(document:keydown.escape)': 'open() && closed.emit()' },
  template: `
    @if (open()) {
      <div class="fixed inset-0 z-[60] flex justify-center md:p-6" [class]="variant() === 'sheet' ? 'items-end md:items-center' : 'items-center'">
        <div class="absolute inset-0 bg-inverse-surface/40 backdrop-blur-sm animate-fade-in" (click)="closed.emit()" aria-hidden="true"></div>
        <div
          #panel
          tabindex="-1"
          role="dialog"
          aria-modal="true"
          [attr.aria-label]="title()"
          class="relative w-full bg-surface-container-lowest shadow-level-3 outline-none overflow-y-auto"
          [class]="maxWidth() + ' ' + (variant() === 'sheet' ? 'rounded-t-[2rem] md:rounded-3xl max-h-[88vh] animate-sheet-up md:animate-toast-in' : 'rounded-3xl max-h-[90vh] mx-4 animate-toast-in')"
        >
          <div class="sticky top-0 z-10 flex items-center justify-between gap-4 px-5 py-4 bg-surface-container-lowest/95 backdrop-blur border-b border-surface-container">
            <h2 class="font-headline-sm text-headline-sm text-on-surface">{{ title() }}</h2>
            <button type="button" (click)="closed.emit()" class="w-10 h-10 rounded-full flex items-center justify-center hover:bg-surface-container" aria-label="Close">
              <app-icon name="close" />
            </button>
          </div>
          <div class="p-5"><ng-content /></div>
        </div>
      </div>
    }
  `,
})
export class ModalComponent {
  open = input(false);
  title = input('');
  variant = input<'center' | 'sheet'>('center');
  maxWidth = input('max-w-2xl');
  closed = output<void>();

  private panel = viewChild<ElementRef<HTMLElement>>('panel');
  private previousFocus: Element | null = null;

  constructor() {
    effect(() => {
      if (this.open()) {
        this.previousFocus = document.activeElement;
        document.body.style.overflow = 'hidden';
        queueMicrotask(() => this.panel()?.nativeElement.focus());
      } else {
        document.body.style.overflow = '';
        (this.previousFocus as HTMLElement | null)?.focus?.();
      }
    });
  }
}

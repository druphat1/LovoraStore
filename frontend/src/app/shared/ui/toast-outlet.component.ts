import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ToastService } from '../../core/services/toast.service';
import { IconComponent } from './icon.component';

@Component({
  selector: 'app-toast-outlet',
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="fixed z-[70] left-1/2 -translate-x-1/2 top-24 md:top-auto md:left-auto md:translate-x-0 md:right-6 md:bottom-6 flex flex-col gap-2 w-[calc(100%-2rem)] max-w-sm pointer-events-none"
      role="status"
      aria-live="polite"
    >
      @for (t of toast.toasts(); track t.id) {
        <div class="animate-toast-in pointer-events-auto flex items-center gap-3 rounded-2xl bg-inverse-surface text-inverse-on-surface px-4 py-3 shadow-level-3">
          <span class="w-8 h-8 shrink-0 rounded-full flex items-center justify-center" [class]="t.tone === 'error' ? 'bg-error text-on-error' : 'bg-primary text-on-primary'">
            <app-icon [name]="t.icon" [size]="18" />
          </span>
          <div class="min-w-0 flex-1">
            <p class="font-button-text text-sm">{{ t.title }}</p>
            @if (t.message) {
              <p class="text-xs opacity-80 line-clamp-2">{{ t.message }}</p>
            }
          </div>
          <button type="button" (click)="toast.dismiss(t.id)" class="opacity-70 hover:opacity-100" aria-label="Dismiss"><app-icon name="close" [size]="18" /></button>
        </div>
      }
    </div>
  `,
})
export class ToastOutletComponent {
  toast = inject(ToastService);
}

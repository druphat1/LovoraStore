import { Injectable, signal } from '@angular/core';

export interface Toast {
  id: number;
  title: string;
  message?: string;
  icon: string;
  tone: 'success' | 'error';
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  readonly toasts = signal<Toast[]>([]);
  private nextId = 0;

  show(t: { title: string; message?: string; icon?: string; tone?: 'success' | 'error' }) {
    const id = ++this.nextId;
    this.toasts.update((list) => [...list.slice(-2), { id, icon: 'check', tone: 'success', ...t }]);
    setTimeout(() => this.dismiss(id), 2800);
  }

  dismiss(id: number) {
    this.toasts.update((list) => list.filter((t) => t.id !== id));
  }
}

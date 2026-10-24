import { effect, signal, WritableSignal } from '@angular/core';

// localStorage can be unavailable (private mode, blocked site data) — never let that crash the app.
const PREFIX = 'lgc:';

function load<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(PREFIX + key);
    return raw == null ? fallback : (JSON.parse(raw) as T);
  } catch {
    return fallback;
  }
}

/** A signal that survives page refreshes. Must be created in an injection context. */
export function persistedSignal<T>(key: string, initial: T): WritableSignal<T> {
  const s = signal<T>(load(key, initial));
  effect(() => {
    const value = s();
    try {
      window.localStorage.setItem(PREFIX + key, JSON.stringify(value));
    } catch {
      /* storage full or blocked — state still lives in memory */
    }
  });
  return s;
}

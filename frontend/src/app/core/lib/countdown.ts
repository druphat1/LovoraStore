import { computed, DestroyRef, inject, signal } from '@angular/core';

const secondsToMidnight = () => {
  const now = new Date();
  const end = new Date(now);
  end.setHours(24, 0, 0, 0);
  return Math.max(0, Math.floor((end.getTime() - now.getTime()) / 1000));
};

/** Live countdown to local midnight — the "offer ends in" timers. Call in an injection context. */
export function midnightCountdown() {
  const left = signal(secondsToMidnight());
  const t = setInterval(() => left.set(secondsToMidnight()), 1000);
  inject(DestroyRef).onDestroy(() => clearInterval(t));
  return computed(() => {
    const s = left();
    return { hours: Math.floor(s / 3600), mins: Math.floor((s % 3600) / 60), secs: s % 60 };
  });
}

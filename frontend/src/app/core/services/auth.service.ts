import { Injectable } from '@angular/core';
import { persistedSignal } from '../lib/persisted-signal';

export interface Profile {
  name: string;
  email: string;
  phone: string;
}

/**
 * Frontend-only demo account. Nothing is sent to a server and no password is
 * stored — signing in simply remembers the profile in this browser.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  readonly user = persistedSignal<Profile | null>('user', null);
  private profiles = persistedSignal<Record<string, Profile>>('profiles', {});

  register(p: { name: string; email: string; phone?: string }) {
    const profile: Profile = { name: p.name.trim(), email: p.email.trim().toLowerCase(), phone: p.phone?.trim() ?? '' };
    this.profiles.update((all) => ({ ...all, [profile.email]: profile }));
    this.user.set(profile);
    return profile;
  }

  login(email: string) {
    const key = email.trim().toLowerCase();
    const profile = this.profiles()[key] ?? { name: key.split('@')[0], email: key, phone: '' };
    this.user.set(profile);
    return profile;
  }

  logout() {
    this.user.set(null);
  }
}

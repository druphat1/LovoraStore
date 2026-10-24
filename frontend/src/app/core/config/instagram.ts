export const INSTAGRAM = {
  handle: 'lovelygiftcenter',
  url: 'https://www.instagram.com/lovelygiftcenter/',
};

export interface Reel {
  /** Video file inside public/videos, e.g. '/videos/diwali-lights.mp4' */
  src: string;
  /** Optional still image shown before the video loads, e.g. '/videos/diwali-lights.jpg' */
  poster?: string;
  /** Short caption shown on the card */
  caption: string;
  /** Optional link to the original reel on Instagram */
  link?: string;
}

/**
 * Homepage "Watch us on Instagram" reels.
 * 1. Download your reel from Instagram (open the reel → ⋯ → Download, or
 *    Settings → Your activity → Download your information).
 * 2. Put the .mp4 in frontend/public/videos/ (short lowercase names, no spaces).
 * 3. Add a line below. Until this list has videos, the homepage shows a Follow banner instead.
 *
 * Example:
 *   { src: '/videos/diwali-lights.mp4', caption: 'Diwali lights are here ✨', link: 'https://www.instagram.com/reel/XXXX/' },
 */
export const REELS: Reel[] = [
  { src: '/videos/store-introduction-2.mp4', poster: '/videos/store-introduction-2.jpg', caption: 'Diwali lights starting from just ₹10 ✨' },
  { src: '/videos/store-introduction-1.mp4', poster: '/videos/store-introduction-1.jpg', caption: 'Artificial flowers & home décor — store tour 🌸' },
];

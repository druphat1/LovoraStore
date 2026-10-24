import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Animated toy scene from the reference "animated_svg_2" (ANIMATION_15).
 * Differences from the source: SVG tag/attribute casing fixed, and elements that had both a
 * transform attribute and a CSS animation are wrapped, because a CSS transform overrides the
 * attribute and would snap them to the origin. Keyframes live in styles.css (.toyland).
 */
@Component({
  selector: 'app-hero-toyland',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  template: `
    <svg class="toyland w-full h-full" fill="none" viewBox="0 0 600 280" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Animated teddy bear, toy race car and space rocket">
      <defs>
        <linearGradient id="tl-cloud" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0.95" />
          <stop offset="100%" stop-color="#fdf2f8" stop-opacity="0.7" />
        </linearGradient>
        <linearGradient id="tl-bear" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stop-color="#ffb6d5" />
          <stop offset="100%" stop-color="#f472b6" />
        </linearGradient>
        <linearGradient id="tl-rocket" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stop-color="#818cf8" />
          <stop offset="100%" stop-color="#6366f1" />
        </linearGradient>
        <linearGradient id="tl-car" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stop-color="#38bdf8" />
          <stop offset="100%" stop-color="#0284c7" />
        </linearGradient>
        <linearGradient id="tl-star" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stop-color="#fde047" />
          <stop offset="100%" stop-color="#f59e0b" />
        </linearGradient>
        <filter id="tl-glow" height="140%" width="140%" x="-20%" y="-20%">
          <feDropShadow dx="0" dy="4" flood-color="#ec4899" flood-opacity="0.18" stdDeviation="6" />
        </filter>
      </defs>

      <!-- Cloud cushions -->
      <path d="M30 240 Q60 180 130 190 Q180 170 230 200 Q260 190 290 240 Z" fill="url(#tl-cloud)" opacity="0.85" />
      <path d="M330 245 Q380 195 450 200 Q500 185 570 245 Z" fill="url(#tl-cloud)" opacity="0.85" />

      <!-- Twinkling sparkles -->
      <g transform="translate(160, 40)"><g class="star-1"><polygon fill="url(#tl-star)" points="12,0 15,9 24,12 15,15 12,24 9,15 0,12 9,9" /></g></g>
      <g transform="translate(320, 25)"><g class="star-2"><polygon fill="url(#tl-star)" points="10,0 13,7 20,10 13,13 10,20 7,13 0,10 7,7" /></g></g>
      <g transform="translate(425, 65)"><g class="star-3"><polygon fill="url(#tl-star)" points="9,0 11,7 18,9 11,11 9,18 7,11 0,9 7,7" /></g></g>
      <circle class="star-2" cx="140" cy="95" fill="#f43f5e" opacity="0.4" r="4" />
      <circle class="star-1" cx="280" cy="75" fill="#a855f7" opacity="0.4" r="5" />
      <circle class="star-3" cx="395" cy="130" fill="#38bdf8" opacity="0.5" r="4.5" />

      <!-- Teddy bear -->
      <g class="bear-group" filter="url(#tl-glow)">
        <circle cx="65" cy="85" fill="url(#tl-bear)" r="20" />
        <circle cx="65" cy="85" fill="#fbcfe8" r="11" />
        <circle cx="135" cy="85" fill="url(#tl-bear)" r="20" />
        <circle cx="135" cy="85" fill="#fbcfe8" r="11" />
        <ellipse cx="100" cy="110" fill="url(#tl-bear)" rx="38" ry="34" />
        <ellipse cx="100" cy="120" fill="#fff1f2" rx="16" ry="12" />
        <polygon fill="#831843" points="100,115 94,111 106,111" />
        <path d="M100 115 L100 123 M95 123 Q100 126 105 123" stroke="#831843" stroke-linecap="round" stroke-width="2" />
        <ellipse cx="88" cy="105" fill="#374151" rx="4" ry="5" />
        <circle cx="89" cy="103" fill="#ffffff" r="1.5" />
        <ellipse cx="112" cy="105" fill="#374151" rx="4" ry="5" />
        <circle cx="113" cy="103" fill="#ffffff" r="1.5" />
        <ellipse cx="78" cy="118" fill="#f43f5e" opacity="0.35" rx="6" ry="3" />
        <ellipse cx="122" cy="118" fill="#f43f5e" opacity="0.35" rx="6" ry="3" />
        <ellipse cx="100" cy="170" fill="url(#tl-bear)" rx="35" ry="32" />
        <ellipse cx="100" cy="172" fill="#fbcfe8" rx="20" ry="20" />
        <path d="M100 142 L80 134 Q70 142 82 152 Z" fill="#db2777" />
        <path d="M100 142 L120 134 Q130 142 118 152 Z" fill="#db2777" />
        <circle cx="100" cy="142" fill="#be185d" r="6" />
        <circle cx="70" cy="165" fill="url(#tl-bear)" r="11" />
        <circle cx="130" cy="165" fill="url(#tl-bear)" r="11" />
        <ellipse cx="78" cy="198" fill="url(#tl-bear)" rx="13" ry="10" />
        <ellipse cx="78" cy="198" fill="#fbcfe8" rx="7" ry="5" />
        <ellipse cx="122" cy="198" fill="url(#tl-bear)" rx="13" ry="10" />
        <ellipse cx="122" cy="198" fill="#fbcfe8" rx="7" ry="5" />
      </g>

      <!-- Race car & blocks -->
      <g class="car-group" filter="url(#tl-glow)">
        <g transform="translate(225, 120)">
          <rect fill="#fbbf24" height="36" rx="7" width="36" x="0" y="0" />
          <rect fill="#fef08a" height="30" rx="5" width="30" x="3" y="3" />
          <text fill="#d97706" font-family="Quicksand, sans-serif" font-size="20" font-weight="bold" text-anchor="middle" x="18" y="24">A</text>
        </g>
        <g transform="translate(330, 115) rotate(10)">
          <rect fill="#ec4899" height="34" rx="7" width="34" x="0" y="0" />
          <rect fill="#fbcfe8" height="28" rx="5" width="28" x="3" y="3" />
          <text fill="#be185d" font-family="Quicksand, sans-serif" font-size="16" font-weight="bold" text-anchor="middle" x="17" y="23">★</text>
        </g>
        <path d="M250 178 Q250 162 268 158 L285 145 Q295 138 315 138 L330 138 Q345 138 355 148 L370 162 Q382 165 382 178 L380 188 L252 188 Z" fill="url(#tl-car)" />
        <path d="M290 148 L312 143 L326 143 L344 153 L290 153 Z" fill="#e0f2fe" opacity="0.9" />
        <rect fill="#fde047" height="6" width="128" x="252" y="170" />
        <line stroke="#64748b" stroke-width="2" x1="262" x2="258" y1="158" y2="132" />
        <polygon fill="#ef4444" points="258,132 245,137 258,142" />
        <ellipse cx="378" cy="174" fill="#fef08a" rx="4" ry="6" />
        <g transform="translate(275, 188)">
          <circle r="16" fill="#1e293b" /><circle r="9" fill="#94a3b8" /><circle r="4" fill="#f8fafc" />
          <line stroke="#475569" stroke-width="2" x1="-7" x2="7" y1="0" y2="0" /><line stroke="#475569" stroke-width="2" x1="0" x2="0" y1="-7" y2="7" />
        </g>
        <g transform="translate(355, 188)">
          <circle r="16" fill="#1e293b" /><circle r="9" fill="#94a3b8" /><circle r="4" fill="#f8fafc" />
          <line stroke="#475569" stroke-width="2" x1="-7" x2="7" y1="0" y2="0" /><line stroke="#475569" stroke-width="2" x1="0" x2="0" y1="-7" y2="7" />
        </g>
      </g>

      <!-- Rocket & planet -->
      <g class="rocket-group" filter="url(#tl-glow)">
        <g transform="translate(430, 48)">
          <circle cx="16" cy="16" fill="#c084fc" r="12" />
          <ellipse cx="16" cy="16" fill="none" rx="22" ry="5" stroke="#f472b6" stroke-width="2.5" transform="rotate(-18 16 16)" />
        </g>
        <path d="M482 170 Q490 195 490 198 Q490 195 498 170 Z" fill="#f59e0b" />
        <path d="M486 170 Q490 188 490 190 Q490 188 494 170 Z" fill="#ef4444" />
        <path d="M470 148 L454 168 Q462 172 472 168 Z" fill="#ec4899" />
        <path d="M510 148 L526 168 Q518 172 508 168 Z" fill="#ec4899" />
        <path d="M490 68 Q465 110 470 170 L510 170 Q515 110 490 68 Z" fill="url(#tl-rocket)" />
        <path d="M490 68 Q477 92 472 108 L508 108 Q503 92 490 68 Z" fill="#ec4899" />
        <circle cx="490" cy="126" fill="#fbcfe8" r="14" />
        <circle cx="490" cy="126" fill="#38bdf8" r="10" />
        <circle cx="487" cy="123" fill="#ffffff" opacity="0.8" r="3" />
      </g>

      <!-- Balloon on a string -->
      <g transform="translate(195, 65)">
        <g class="balloon-group">
          <ellipse cx="15" cy="18" fill="#f43f5e" rx="14" ry="17" />
          <ellipse cx="11" cy="13" fill="#ffffff" opacity="0.4" rx="4" ry="7" />
          <polygon fill="#e11d48" points="15,35 12,38 18,38" />
          <path d="M15 38 Q18 52 13 65" fill="none" stroke="#fda4af" stroke-dasharray="2,2" stroke-width="1.5" />
        </g>
      </g>
    </svg>
  `,
})
export class HeroToylandComponent {}

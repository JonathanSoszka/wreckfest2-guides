/**
 * Feature flags — the single place app code reads them from.
 *
 * Flags are build-time only (declared in `astro.config.mjs` under `env.schema`,
 * typed and validated by `astro:env`). Flipping one means a rebuild; a flagged-off
 * feature is absent from the output, not hidden in it.
 *
 * Import from here rather than from `astro:env/server` directly — it keeps every
 * flag greppable in one file, which is what makes them removable later.
 */
import { FEATURE_LESSONS, SHOW_DRAFTS } from 'astro:env/server';

export { FEATURE_LESSONS, SHOW_DRAFTS };

/** A gated site section. `nav` is the header label, `card` the home-page one. */
export interface Section {
  href: string;
  nav: string;
  card: string;
  blurb: string;
  collection: 'cars' | 'tracks' | 'tuning' | 'lessons';
  enabled: boolean;
}

/**
 * Site sections in nav order, each with its flag. Consumers filter on `enabled`
 * rather than testing individual flags, so gating a new section is one entry.
 * Route removal for a disabled section is handled separately, by the
 * `feature-routes` integration in `astro.config.mjs`.
 */
export const SECTIONS: Section[] = [
  { href: '/cars/', nav: 'Cars', card: 'Car Profiles', collection: 'cars', blurb: 'Drivetrain, handling, and how each car actually drives.', enabled: true },
  { href: '/tracks/', nav: 'Tracks', card: 'Track Profiles', collection: 'tracks', blurb: 'Surface, layout, and where the race is won or lost.', enabled: true },
  { href: '/tuning/', nav: 'Tuning', card: 'Tuning Guides', collection: 'tuning', blurb: 'Generic FWD/RWD/AWD setups, then car-specific sheets.', enabled: true },
  { href: '/lessons/', nav: 'Racing Lessons', card: 'Racing Lessons', collection: 'lessons', blurb: "Racecraft for dirt, gravel, and bumpy tarmac.", enabled: FEATURE_LESSONS },
];

export const enabledSections = () => SECTIONS.filter((s) => s.enabled);

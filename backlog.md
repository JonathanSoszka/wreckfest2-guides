# Backlog

Tracked work for the Wreckfest 2 Guides site. Status lifecycle:
`TODO` → `REFINED` → `IN PROGRESS` → `DONE`. Effort is a rough size (`S` / `M` / `L`).

A `TODO` item is a coarse idea plus implementation notes. Running `/refine-tasks <id>` breaks it
into an actionable `**Steps:**` checklist and flips it to `REFINED`, so it can be picked up cold
later. This file is the single source of truth — don't spin up a second tracker, and don't renumber
existing items (new work gets the next number).

---

## 1. Remove the AWD tuning guide
**Status:** REFINED · **Effort:** S

There are **no AWD cars** in the roster — `car-reference.md` resolves it as 11 front-engine RWD,
5 FWD, 2 rear-engine RWD, and zero AWD. So the generic AWD guide is dead weight, and the tuning
index advertises a drivetrain nobody drives.

- Delete `src/content/tuning/generic-awd.mdx` — that removes its route and its card from the
  `/tuning/` "By drivetrain" list automatically (the index maps over the generic guides).
- Decide how far to purge AWD beyond the guide itself. It's referenced in several places that would
  now be describing a drivetrain that can't occur: the `drivetrain` enum in `src/content.config.ts`,
  the `--dt-awd` tag colour in `src/styles/global.css`, the `/tuning/generic-${dt}/` link builder in
  `src/pages/cars/[...slug].astro` (never resolves to AWD today), and "FWD/RWD/AWD" copy in
  `README.md`, `src/pages/tuning/index.astro`, and the Tuning blurb in `src/config/flags.ts`.
- Minimum: delete the guide. Fuller: also drop AWD from the enum + tag colour so it can't be
  authored, and fix the "FWD/RWD/AWD" copy to "FWD/RWD". (Leave `car-reference.md` /
  `surface-tuning-reference.md` mentions — they're reference docs explaining *why* there's no AWD.)
- Files: `src/content/tuning/generic-awd.mdx` (delete); possibly `src/content.config.ts`,
  `src/styles/global.css`, `src/pages/tuning/index.astro`, `src/pages/cars/[...slug].astro`,
  `src/config/flags.ts`, `README.md`.

**Decision:** Full purge — AWD is impossible in this game's roster, so leaving it authorable in the
enum and advertised in copy is a trap for a future contributor. Remove the guide *and* make AWD
unauthorable, keeping only the reference-doc mentions that explain why there's no AWD.

**Steps:** _refined 2026-07-24_
- [ ] Delete `src/content/tuning/generic-awd.mdx` — drops its route and its "By drivetrain" card automatically (`src/content/tuning/generic-awd.mdx`)
- [ ] Drop `'AWD'` from the `drivetrain` enum so no car or guide can declare it (`src/content.config.ts`)
- [ ] Remove the dead AWD styling: the `--dt-awd` token and `.tag-awd` rule (`src/styles/global.css`) and the `.car-art--awd` paint rule (`src/components/CarArt.astro`)
- [ ] Drop `'AWD'` from `switchGroups` so the car-switcher has no empty AWD group (`src/pages/cars/[...slug].astro`)
- [ ] Fix "FWD/RWD/AWD" copy → "FWD/RWD" in the tuning card blurb (`src/config/flags.ts`), the tuning page description (`src/pages/tuning/index.astro`), and the README bullet (`README.md`)
- [ ] Leave AWD mentions in `src/data/tuning/*` and the rally reference untouched — they explain *why* there's no AWD
- [ ] `npm run build` passes; `/tuning/generic-awd/` is no longer emitted and nothing references AWD in app code

## 2. Put the Tracks section behind a feature flag
**Status:** REFINED · **Effort:** M

Track profiles are text-only (no hero/map images) and mostly medium-confidence on the real-name
mapping, so gate them off in production until they're ready — exactly the way Racing Lessons is
gated. The mechanism is already generic (`featureRoutes` + `SECTIONS` + `getPublished`); this is
following the recipe in CONTRIBUTING.md → "Gating a whole section".

- Add a `FEATURE_TRACKS` flag: declare it in `astro.config.mjs` (`FLAG_NAMES` + `env.schema`) and
  re-export it from `src/config/flags.ts`.
- Flip the Tracks entry in `SECTIONS` (`src/config/flags.ts`) from `enabled: true` to
  `enabled: FEATURE_TRACKS` — nav entry and home-page card then follow automatically.
- Move `src/pages/tracks/index.astro` and `src/pages/tracks/[...slug].astro` into
  `src/routes/tracks/`, and register them in the `featureRoutes([...])` array (name `tracks`,
  prefix `/tracks`, both route patterns). Astro builds everything in `src/pages/**` unconditionally,
  so the pages *must* leave `pages/` for the flag to hide them.
- Add `FEATURE_TRACKS=true` to `.env.development` so local authoring still shows tracks.
- Links into `/tracks/`: content-prose links are unwrapped automatically once `tracks` is a
  disabled section (the `astro:build:done` pass). No template currently links to `/tracks/` except
  the track pages themselves, but re-grep `href="/tracks` before finishing in case that changes.
- Files: `astro.config.mjs`, `src/config/flags.ts`, move `src/pages/tracks/*` → `src/routes/tracks/*`,
  `.env.development`.

**Decision:** Off in production, on in local dev — mirroring the Racing Lessons gating exactly.

**Steps:** _refined 2026-07-24_
- [ ] Add `FEATURE_TRACKS` to `FLAG_NAMES` and to `env.schema` (boolean, `default: false`) (`astro.config.mjs`)
- [ ] Register a `tracks` entry in the `featureRoutes([...])` array — `enabled: envFlag('FEATURE_TRACKS')`, `prefix: '/tracks'`, routes for `/tracks` and `/tracks/[...slug]` pointing at `./src/routes/tracks/…` (`astro.config.mjs`)
- [ ] Re-export `FEATURE_TRACKS` and set the Tracks `SECTIONS` entry's `enabled` to `FEATURE_TRACKS` (`src/config/flags.ts`)
- [ ] `git mv` `src/pages/tracks/index.astro` and `src/pages/tracks/[...slug].astro` into `src/routes/tracks/`; remove the now-empty `src/pages/tracks/` (`src/pages/tracks/*` → `src/routes/tracks/*`)
- [ ] Add `FEATURE_TRACKS=true` to `.env.development` so local authoring still shows tracks (`.env.development`)
- [ ] Re-grep `href="/tracks` for template links needing a `{FEATURE_TRACKS && …}` guard (none today, but confirm)
- [ ] Add `FEATURE_TRACKS` to the flags tables in `CONTRIBUTING.md` and `CLAUDE.md`
- [ ] Verify: `npm run build` (flag off) emits no `/tracks/` HTML and drops the Tracks nav + home card; `FEATURE_TRACKS=1 npm run build` restores both

## 3. Replace the "By car" grid on the tuning page with a link to the cars page
**Status:** REFINED · **Effort:** S

The `/tuning/` page has a "By car" section that renders a full card grid of all 18 per-car sheets,
but every card just links to `/cars/<slug>/#setup` — the setup already lives on the car page. The
grid duplicates the cars index and drifts from it. Replace it with a short callout linking to
`/cars/`.

- In `src/pages/tuning/index.astro`, remove the `perCar` card grid and its supporting plumbing
  (the `perCar` filter, the `cars` fetch, and the `carHref` helper), replacing the whole "By car"
  block with a one-line callout, e.g. "Every car's setup lives on its profile — browse the
  [car profiles](/cars/)."
- Keep the "By drivetrain" section and the cheat-sheet callout as they are.
- Files: `src/pages/tuning/index.astro`.

**Steps:** _refined 2026-07-24_
- [ ] Remove the "By car" heading, its lead line, and the `perCar` card grid (`src/pages/tuning/index.astro`)
- [ ] Delete the now-unused `perCar` filter, the `cars` fetch, and the `carHref` helper (`src/pages/tuning/index.astro`)
- [ ] Add a one-line callout linking to `/cars/`, e.g. "Every car's setup lives on its profile — browse the car profiles." (`src/pages/tuning/index.astro`)
- [ ] `npm run build` passes; `/tuning/` shows By drivetrain + the cars link and no per-car grid

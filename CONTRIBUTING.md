# Contributing to Wreckfest 2 Guides

Unofficial, content-first static site (Astro → Cloudflare Pages) of Wreckfest 2 guides: **car
profiles, track profiles, tuning guides, and racing lessons**. This file is the practical how-to
for adding and editing content. For the architectural overview and house conventions, see
[`CLAUDE.md`](./CLAUDE.md); agents should also read [`AGENTS.md`](./AGENTS.md).

## Getting started

```sh
npm install
npm run dev       # local dev server (localhost:4321)
npm run build     # static build to dist/
npm run preview   # serve the built dist/
```

Always run `npm run build` before opening a PR — the content schemas are validated at build time,
so a bad frontmatter field or MDX syntax error fails the build.

## Repository layout

- `src/content/{cars,tracks,tuning,lessons}/` — the guides themselves. Cars, tracks, and lessons
  are Markdown; **tuning guides are MDX** so they can embed the interactive setup widget.
- `src/content.config.ts` — the content-collection schemas (the frontmatter contract for each type).
- `src/data/tuning/` — the **reference data / sources of truth** (see below).
- `src/pages/**` — section index pages plus `[...slug].astro` detail pages per collection.
- `src/components/`, `src/layouts/BaseLayout.astro`, `src/styles/global.css` — the shell and widgets.

## Reference data — the sources of truth

**Do not invent tuning numbers, car facts, or surface directions.** Everything is grounded in three
files under `src/data/tuning/`. Read them before authoring or reviewing any tuning content.

| File | What it is | Use it for |
|---|---|---|
| `schema.ts` (`TUNING_SCHEMA`) | The in-game tuning menu — every category, slider `key`, unit, endpoint label, min/max range, and the stock default — captured from **one car**. The ranges are *not* universal: mass-scaled sliders (springs, ARBs, ride height, diff preload) differ per car, so they carry `asPercent: true` and display as a percentage of slider travel. | The fixed set of sliders and their ranges/units. Never hand-edit per car. |
| `surface-tuning-reference.md` | Cited real-world (rally + sim) reference for **which way each category should move** across Mud → Gravel → Asphalt. | Deciding the *direction* of every per-surface change. |
| `car-reference.md` | Each car's real-world inspiration, drivetrain, weight balance, and **the handling vice to tune around**, grouped by archetype. | The car's *baseline tendency* and how far to bias each slider. |

The authoring workflow ties them together:

1. **Archetype first** — find the car in `car-reference.md`; its archetype gives the core setup story
   (understeer-in / oversteer-out for muscle, rotate-the-rear for FWD, tame-the-tail for rear-engine,
   calm-the-rear for balanced RWD).
2. **Direction from the surface reference** — move each slider Mud → Gravel → Asphalt in the
   direction `surface-tuning-reference.md` prescribes.
3. **Magnitude from the car's vice** — bias the amount by the car's specific weakness (a
   torque-forward car gets less diff lock; a nose-heavy FWD leans harder on rear rotation aids; a
   snappy light car trades rotation for a calmer rear).
4. **Ranges/units from the schema** — every number must be a real value inside that slider's
   `rangeMin`/`rangeMax` from `schema.ts`.

`roadslayer.real.json` is the archived raw in-game reading the schema was captured from — reference
only, not used at build time.

## Content conventions (do not silently change)

- **Voice:** plain, direct prose. Minimal bold — bold only a key lever (`**Differential**`), never
  whole sentences. No formulaic AI phrasing ("it's important to note", "plays a crucial role").
- **Slider percentages** describe **position along the slider's travel** (0 = full left, 100 = full
  right), not the number the game prints — WF2 readouts can exceed 100%.
- **Gamepad note:** Steering Ratio one notch slower than shown; Lock to Lock unchanged. End tuning
  intros with this.
- **Front Balancer** is undocumented — always framed empirically ("test both ways in one braking zone").
- **FWD inverts RWD habits** — stiffen the rear to rotate the nose.
- **Differential convention (site-wide, fixed):** more **locked on loose** (mud/gravel), more **open
  on grip** (asphalt) — for Power, Coast, and Preload. Never contradict this.

## Adding content

### A car profile — `src/content/cars/<slug>.md`

Frontmatter (see `content.config.ts` for the full schema):

```yaml
---
name: RoadSlayer
internalId: car01          # game id, e.g. "car01"
drivetrain: RWD            # RWD | FWD | AWD
carClass: B                # optional, best-effort
inspiration: 1973 Pontiac Firebird / Trans Am   # optional, from car-reference.md
archetype: Front-heavy RWD muscle                # optional, from car-reference.md
summary: One-line hook shown on the card and page lead.
order: 1                   # sort order (car number)
---
```

Body: a short intro paragraph, then a `## How it drives` section. Keep it to handling character —
there is **no parts/upgrades section** (that feature was removed; don't reintroduce "where to spend
upgrades" prose or a `partsData` field).

### A car's tuning setup — `src/content/tuning/<slug>.mdx`

Each car's setup is an **embeddable fragment**: just the `SetupTabs` widget, no page chrome. It is
rendered inline in the **Setup** section of that car's profile page (`/cars/<slug>/#setup`); it does
**not** get its own route. Match the shape of an existing per-car guide (e.g. `roadslayer.mdx`):

```mdx
---
title: RoadSlayer Setup
kind: car
carId: car01               # must match the car's internalId
drivetrain: RWD
summary: One-liner.
order: 10
---
import SetupTabs from '../../components/SetupTabs.astro';
import { buildGroups } from '../../data/tuning/schema';

export const caption = 'Hybrid = a do-everything setup; each surface tab shows what to change from it. …';

export const values = {
  'diff.power':  { note: 'Locked on loose for traction, opener on grip', surfaces: { mud: 82, gravel: 72, asphalt: 58 } },
  'springs.rear':{ note: 'Softer than the front for exit traction',       surfaces: { mud: 24, gravel: 31, asphalt: 42 } },
  // …one entry per slider you want to customise; keys are the schema `key`s.
};

export const groups = buildGroups(values);

<SetupTabs groups={groups} caption={caption}>
<Fragment slot="hybrid">

#### Why these numbers
…prose…

</Fragment>
<Fragment slot="mud">…</Fragment>
<Fragment slot="gravel">…</Fragment>
<Fragment slot="asphalt">…</Fragment>
</SetupTabs>
```

Rules:
- `values` is keyed by slider `key` from `schema.ts`. Each entry may set `note`, `surfaces`
  (`{ mud, gravel, asphalt }`), and rarely `base`; `base` otherwise inherits the schema's universal
  stock default. Numbers come from the [reference-data workflow](#reference-data--the-sources-of-truth).
- Author all four `why` slots (`hybrid` / `mud` / `gravel` / `asphalt`).
- **MDX gotchas:** no `//` comment lines anywhere (they break the parser); keep a blank line after
  each `<Fragment slot="…">` and before each `</Fragment>`.
- Do **not** add a `tune-grid` / `tune-notes` wrapper or a page header — the car page supplies the
  `Setup` heading, the "reading the presets" intro, and the callout.

The **generic** guides (`generic-rwd/fwd/awd.mdx`) are the exception: they are standalone routed
pages, so they keep the full two-column `tune-grid` + `tune-notes` header. They use the same
`buildGroups(values)` schema and real units — never the old flat 0–100 `params`.

### A track profile — `src/content/tracks/<trackNN-slug>.md`

```yaml
---
name: FinnCross Circuit
internalId: track01        # base folder id
surface: mixed             # tarmac | dirt | gravel | mixed
hasReverse: true
location: Finland          # optional
confidence: high           # confirmed | high | medium — how sure the real-name mapping is
layouts:                   # optional per-route detail
  - { name: Main Circuit, lengthM: 944, surfaceMix: "64% tarmac / 36% gravel" }
  - { name: Main Circuit Reverse, reverse: true, lengthM: 1040 }
summary: One-liner.
order: 1
---
```

`medium`-confidence names show an "awaiting in-game pass" note automatically. See
[`memory`/`wf2-track-mapping`] context and `CLAUDE.md` for the id → real-name mapping rationale.

### A racing lesson — `src/content/lessons/<slug>.md`

```yaml
---
title: Braking on Loose Surfaces
topic: Braking             # per-lesson tag, e.g. "Braking", "Contact"
category: Car control      # section on the lessons index (Car control, Racecraft, Disciplines, Recovery)
surface: gravel            # optional
summary: One-liner.
order: 1
---
```

Lessons should ground their technique in a cited reference (like the tuning guides do) and end with a
`## Sources` section linking the major sources. The car-control lessons are checked against
`src/data/lessons/car-control-reference.md`; `order` sorts lessons within their `category`, and the
index groups by `category` in a fixed order (`src/pages/lessons/index.astro`). Lesson diagrams are
produced by `scripts/gen_diagrams.py`, which derives the road and racing line from a shared track
centerline (Frenet lateral offset) so the line always follows the track — never hand-draw racing lines.
Jumps are the one exception to that model: a side elevation drawn from a ground profile plus a
ballistic arc.

Diagrams are embedded as inline SVG (lessons are plain Markdown, so there's no component to import).
Don't paste them by hand — after changing `gen_diagrams.py`, run:

```sh
python scripts/embed_diagrams.py
```

It regenerates each mapped diagram and swaps it into that lesson's `<figure>`, preserving the
hand-written `<figcaption>`. Figures are tagged `data-diagram="<name>"` so the script is re-runnable.
To add a diagram to a new lesson, put an empty `<figure class="lesson-figure">` with a `<figcaption>`
in the markdown and add the lesson → builder entry to `DIAGRAMS` in the script.

The rally lessons are checked against `src/data/lessons/rally-reference.md`, which carries a
"Contested / unverified" section — claims flagged there (how much pros left-foot brake, whether the
Scandinavian flick is still fast, ruts as a grippy rail) must stay hedged in lesson prose.

## How a car page is assembled

`src/pages/cars/[...slug].astro` renders the merged page: a car-switch dropdown, the identity header,
then **Setup** (the tuning fragment, left/wider column) and **Overview** (the profile prose, right
column, collapsible to a rail on large screens). On narrow screens the two stack with an in-page nav.
So a car's content lives in **two files** — `cars/<slug>.md` (Overview) and `tuning/<slug>.mdx`
(Setup) — matched by `carId === internalId`.

## Before you commit

- `npm run build` passes (schemas + MDX validate at build).
- New tuning numbers trace back to the reference data, and the differential convention holds
  (mud ≥ gravel ≥ asphalt for `diff.*`).
- Prose follows the [content conventions](#content-conventions-do-not-silently-change).

## Feature flags

Flags are **build-time only**: flipping one requires a rebuild, and a flagged-off feature is
absent from the output rather than hidden inside it. That is the point — an unfinished section
can't be found by URL or by a search engine, which a CSS-hidden one can.

Flags are declared in `astro.config.mjs` under `env.schema` (typed and validated by `astro:env`),
and app code reads them from **`src/config/flags.ts`** — import from there, never from
`astro:env/server` directly, so every flag stays greppable in one file.

| Flag | Default | Effect |
|---|---|---|
| `FEATURE_LESSONS` | `false` | The Racing Lessons section: nav entry, home-page card, and all `/lessons/` routes. |
| `SHOW_DRAFTS` | `false` | Include `draft: true` content in the build. Local authoring only. |

Both `=true` and `=1` work. Local dev turns them on via `.env.development` (committed — it's
authoring convenience, not config), so `npm run dev` shows lessons and drafts while a production
build hides them. To check a production-shaped build locally, just `npm run build`; to preview a
flagged-on build, `FEATURE_LESSONS=1 npm run build`.

### Gating a whole section

Three things have to happen, and the first is the one people forget:

1. **Routes.** Astro builds everything in `src/pages/` unconditionally, so a gated section's pages
   live in **`src/routes/<section>/`** instead and are injected by the `feature-routes` integration
   only when the flag is on. (Mutating the route list in `astro:routes:resolved` does *not* work —
   the routes are reported there but still get built.)
2. **Nav and cards.** Add the section to `SECTIONS` in `src/config/flags.ts` with its `enabled` flag;
   the header and home page render from `enabledSections()`, so both follow automatically.
3. **Links into it.** Templates gate their own links with `{FEATURE_X && ...}`. Content prose can't —
   markdown can't read flags — so the integration unwraps any anchor pointing into a disabled
   section on `astro:build:done`, keeping the words and dropping the link. It logs what it rewrote.

That last step post-processes the built HTML instead of using a rehype plugin **on purpose**:
rendered markdown is cached (in `node_modules/.astro`) with a key that doesn't include our flags, so
a rehype plugin leaves stale links in the output when you flip a flag — which `npm run deploy` would
then ship. Post-processing runs every build regardless of cache state.

### Content gating

Don't call `getCollection()` in a page. Use **`getPublished()`** from `src/lib/content.ts`, which
applies the `draft` filter (and `SHOW_DRAFTS`) in one place. That filter used to be copy-pasted
across ten call sites — ten chances to leak an unfinished guide.

## Deploy

Two ways to publish to Cloudflare Pages:

**Git integration (default).** Cloudflare builds and deploys on every push to `main` — build command
`npm run build`, output directory `dist`. This is the primary path.

**Manual deploy (Wrangler direct upload).** Build locally and push `dist/` straight to Pages:

```sh
npm run deploy            # build + deploy to production (main)
npm run deploy:preview    # build + deploy as a preview deployment
```

Both target the `wreckfest2-guides` Pages project. Notes:

- Log in once with Pages write access: `npx wrangler login`.
- The `wreckfest2-guides` project must exist; Git integration creates it, otherwise the first
  `npm run deploy` offers to create it.
- **Order matters if you also want Git integration:** set that up first (it creates a git-connected
  project). Running the manual deploy first creates a *direct-upload* project of the same name, which
  can't be converted to git-connected later.

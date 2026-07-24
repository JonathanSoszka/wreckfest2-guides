# Contributing to Wreckfest 2 Guides

Unofficial, content-first static site (Astro → Cloudflare Pages) of Wreckfest 2 guides: **car
profiles, track profiles, tuning guides, and racing lessons**. This file is the practical how-to
for adding and editing content. For the architectural overview and house conventions, see
[`CLAUDE.md`](./CLAUDE.md); agents should also read [`AGENTS.md`](./AGENTS.md).

## New here? (no Astro experience needed)

**Adding or editing a guide means editing Markdown files under `src/content/**` — nothing else.**
No framework code, no JavaScript. If that's all you're doing, you can stop after
[Adding content](#adding-content) and skip the build-internals sections (feature flags, gating) at
the end — those are only for changing how the site is wired together.

When you do venture past content, here's the whole stack in five bullets:

- **File-based routing** — a file in `src/pages/` becomes a page at the matching URL. The
  `[...slug].astro` files are templates that render one page per guide in a collection.
- **Content collections** — the guides live in `src/content/{cars,tracks,tuning,lessons}/`. The
  `key: value` block fenced by `---` at the top of each file is its *frontmatter* (structured
  metadata); `src/content.config.ts` declares which fields each type allows and **validates them at
  build time**, so a wrong field fails the build with a clear message.
- **Components** — reusable building blocks in `src/components/` (`.astro` files: HTML with a small
  JavaScript header). The tuning setup widget is one.
- **MDX** — Markdown that can embed components. Only the tuning guides use it, so they can drop in
  that interactive widget; everything else is plain Markdown.
- **Static build** — `npm run build` turns all of it into plain HTML in `dist/`. There is no server
  and no database; whatever the build emits *is* the entire site.

### Prerequisites

- **Node.js** — the version is pinned in [`.nvmrc`](./.nvmrc) (currently 22); with
  [nvm](https://github.com/nvm-sh/nvm) installed, `nvm use` picks it up. Node includes `npm`.
- **git** and a text editor. Everything runs locally; nothing else to install.

## Getting started

```sh
npm install
npm run dev       # local dev server (localhost:4321)
npm run build     # static build to dist/
npm run preview   # serve the built dist/
```

Always run `npm run build` before opening a PR — the content schemas are validated at build time,
so a bad frontmatter field or MDX syntax error fails the build.

**Your first change.** The gentlest contribution is a prose fix: open the relevant Markdown file
under `src/content/` (a car profile is `src/content/cars/<name>.md`), edit the text, and `npm run
dev` shows it live as you save. Run `npm run build` to confirm it still validates, then open a PR.

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
inspiration: 1973 Pontiac Firebird / Trans Am   # optional, from car-reference.md
archetype: Front-heavy RWD muscle                # optional, from car-reference.md
summary: One-line hook shown on the card and page lead.
order: 1                   # sort order (car number)
handling:                  # optional; drives the "by feel" attributes on the car index
  feel: forgiving          # forgiving | neutral | demanding — the headline rating + sort key
  balance: neutral         # understeers | neutral | oversteers — cornering tendency
  enginePlacement: front   # front | rear (default front) — splits front-engine RWD from rear-engine
  frontWeightPct: 56       # front axle weight share (rear = 100 − this); draws the balance bar
  massKg: 1750             # optional; rendered "≈1,750 kg" (masses are approximate)
  massBand: heavy          # light | mid | heavy | very-heavy
  wheelbase: long          # optional; short | long
  breakaway: progressive   # progressive | moderate | fast | sudden — how suddenly grip lets go
  reasons:                 # 1–4 bullets; the always-shown "Why <feel>" breakdown on the index
    - "Nose-heavy 56/44 — it understeers first, the failure that runs you wide instead of spinning."
    - "Heavy and long in the wheelbase — high inertia, so it changes attitude slowly."
---
```

The `handling` block is **all sourced from `car-reference.md`** — its Balance column, masses, and
"signature to tune around". Don't invent these any more than tuning numbers: `feel`/`balance`/
`breakaway` are a reading of the car's documented vice, and the masses carry a leading `≈` because
some are in-game figures and some the real car's curb weight. See `src/content.config.ts` for the
exact enums and the full field comments.

Body: a short intro paragraph, then a `## How it drives` section. Keep it to handling character —
there is **no parts/upgrades section** (that feature was removed; don't reintroduce "where to spend
upgrades" prose or a `partsData` field).

### Car photography and attribution

The car index shows a photo of the **real-world car** each Wreckfest vehicle is based on. Those
photos come from Wikimedia Commons and are managed by `scripts/fetch-car-images.mjs`, whose manifest
is the provenance record — car, Commons file page, licence, and photographer:

```sh
node scripts/fetch-car-images.mjs           # download, resize, tag frontmatter
node scripts/fetch-car-images.mjs --check   # list what's declared, download nothing
node scripts/fetch-car-images.mjs --force   # refetch images that already exist
```

Rules, none of which are optional:

- **Only freely-licensed images.** Public domain, CC0, CC BY, or CC BY-SA. Never a manufacturer press
  photo, a stock-library image, or anything found by image search without a licence.
- **Verify on the file page itself.** Commons licences are per file — a category page or a search
  result does not tell you the licence. Open the `File:` page and read the licensing box.
- **Credit is mandatory and lives in frontmatter** (`imageCredit`, `imageLicense`, `imageSource`),
  which feeds `/credits/`. An image whose photographer and licence we can't state doesn't ship.
- **Share-alike propagates.** Resizing makes a derivative, so a CC BY-SA source stays CC BY-SA and
  `/credits/` says so. That binds the image, not the site.
- Fetch Commons **thumbnails**, not originals, and only at their cached widths (20, 40, 60, 120, 250,
  330, 500, 960, 1280, 1920, 3840 px). Other widths are refused and bulk originals get you
  rate-limited. The script already does this — 960px in, 760px WebP out, EXIF stripped.

A car with no `heroImage` falls back to a generic silhouette picked by its `bodyStyle`, so the index
degrades per car rather than all-or-nothing. In-game screenshots can replace any photo later by
pointing `heroImage` at a different file.

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
index groups by `category` in a fixed order (`src/routes/lessons/index.astro` — lessons are a gated
section, so their pages live under `src/routes/`, see [Gating a whole section](#gating-a-whole-section)).
Lesson diagrams are
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

**Automatic, via GitHub Actions — you don't deploy by hand.** Merging to `main` is the whole
workflow: [`.github/workflows/deploy.yml`](./.github/workflows/deploy.yml) runs on every push to
`main` (and on manual dispatch), builds the site, and uploads `dist/` to Cloudflare Pages with
`wrangler pages deploy`. It authenticates with two repo secrets, `CLOUDFLARE_API_TOKEN` and
`CLOUDFLARE_ACCOUNT_ID`.

The `wreckfest2-guides` Pages project is **direct-upload**, which is *why* the deploy is driven from
Actions rather than Cloudflare's own Git integration — Cloudflare isn't watching the repo; the
workflow is. (A direct-upload project can't be converted to git-connected later, so this is the
setup we have.)

**Manual deploy (fallback).** Only needed to push a build without going through `main` — e.g. a
one-off preview. Build locally and upload straight to Pages:

```sh
npm run deploy            # build + deploy to production (main branch)
npm run deploy:preview    # build + deploy as a preview deployment
```

Both target the same `wreckfest2-guides` project and need a one-time `npx wrangler login` with Pages
write access.

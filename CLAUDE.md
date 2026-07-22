# Wreckfest 2 Guides — site

Static content site of unofficial Wreckfest 2 guides: **car profiles, track profiles,
tuning guides (generic FWD/RWD/AWD + per-car), and racing lessons**. Built for Jonathan.

- Stack: **Astro** (static output), deployed to **Cloudflare Pages**.
- Content-first, static. Interactive tools (tuning calculator, search/filter) are a later phase.
- Content is authored clean (not ported from the older `D:\projects\wreckfest-guides`), but
  keeps its tuning conventions and style rules (see below).

## Layout

- `src/content/{cars,tracks,tuning,lessons}/` — the guides. Schemas in
  `src/content.config.ts` (Astro content collections, Content Layer API). Cars/tracks/lessons
  are Markdown; **tuning guides are MDX** (`.mdx`) so they can embed interactive components.
- `src/pages/**` — section index pages + `[...slug].astro` detail pages per collection.
- `src/layouts/BaseLayout.astro`, `src/components/Header.astro`, `src/styles/global.css` — shell.
- **Merged car page:** `pages/cars/[...slug].astro` renders a car's profile (Overview) and its
  per-car tuning fragment (Setup) on one page, side by side on large screens. Per-car tuning `.mdx`
  therefore have no route; only the three generic guides do. See `CONTRIBUTING.md`.
### Tuning numbers

**Sources of truth for tuning** (all in `src/data/tuning/`). Author and review every number against
them — the full workflow is in
[`CONTRIBUTING.md`](./CONTRIBUTING.md#reference-data--the-sources-of-truth). Never invent tuning numbers.
- `schema.ts` (`TUNING_SCHEMA`) — the tuning menu (every category, slider `key`, unit, endpoint
  label, min/max range, stock default), captured from one car. Details below.
- `surface-tuning-reference.md` — cited real-world (rally + sim) reference for which way every
  category moves across Mud → Gravel → Asphalt (incl. the **differential**: locked-on-loose /
  open-on-grip).
- `car-reference.md` — each car's real-world inspiration + handling archetype (what to tune around),
  and the **resolved drivetrain roster** (11 FR RWD, 5 FWD, 2 rear-engine RR, no AWD).
- Combine them: car reference = the car's baseline tendency; surface reference = which way to move
  each slider; schema = the real ranges/units the value must land in.


The tuning dataset — categories, sliders, units, endpoint descriptors, ranges, stock defaults —
lives **once** in `src/data/tuning/schema.ts` (`TUNING_SCHEMA`), captured from in-game screenshots
of **one car** (default + all-min + all-max passes); the raw reading is archived in
`src/data/tuning/roadslayer.real.json`.

**The ranges are NOT universal.** The mass-scaled settings — springs, anti-roll bars, ride height,
and diff preload — have per-car min/max, so a raw N/mm or cm value does not transfer between cars.
Those specs carry `asPercent: true` and render as a **percentage of slider travel**, which does
transfer. Values are still authored in real units; only the display changes. The geometry/ratio
sliders (camber, toe, final drive, gears, steering) and the already-normalised ones (brake
balance/pressure, diff power/coast, ackermann, wedge) still render raw — whether *their* ranges are
universal is unverified, so treat raw values on those as RoadSlayer-relative until checked.

**Every tuning guide — generic and per-car — is built the same way:** `buildGroups(values)` from
`schema.ts`, in the game's real categories/units/ranges. `values` is keyed by slider `key` and
supplies only that car's per-surface recommendations + notes; `base` inherits the universal stock
default. `valueLabels` renders the Front Balancer as a two-state toggle. (The widget still accepts a
flat 0–100 `params` array, but no guide uses that path anymore — it was the pre-standardization form
of the generics.) Two renderings:

- **Per-car guides** (`tuning/<car>.mdx`, all 18 cars) are **embeddable fragments** — just
  `<SetupTabs groups={groups} caption={caption}>` and the four `why` slots, no page chrome. They have
  **no route of their own**; the car profile page renders them inline in its **Setup** section
  (matched by `carId === internalId`) and supplies the heading, intro, and callout.
- **Generic drivetrain guides** (`generic-rwd/fwd/awd.mdx`) are standalone routed pages that keep the
  full two-column `tune-grid` + `tune-notes` header.

Formatting/positioning helpers live in `tuning.ts` (`positionOf`, `formatValue`, `formatDelta`,
`toGroups`, `hybridValue`); `decimalsFor` distinguishes no-unit generics (integers) from
empty-unit ratios (2dp). `hybridValue(p)` = a gravel-weighted mean of a param's surface
recommendations (mud 1 / gravel 2 / asphalt 1, rounded to its unit), or `p.base` when it has no
surface variation.

One widget renders the whole thing:

- `<SetupTabs params={setup.params} caption>` — a pure-CSS (no JS), keyboard-navigable tabbed
  container with **Hybrid / Asphalt / Gravel / Mud** tabs (grip high→low; Hybrid is the default).
  Each tab lays the settings out as **full-width collapsible category sections** (`<details>`,
  prominent pill headers, open by default), each with its settings in a **two-column grid inside**,
  and a **full-width "why" panel below** (named slots `hybrid`/`asphalt`/`gravel`/`mud`; grid stacks
  to one column on narrow screens). The tabs themselves are pure-CSS; a small `<script>` only syncs
  each category's collapsed state across the four tab panels (degrades gracefully — without JS each
  tab collapses independently). **Every tab lists all params
  in the same order** — the **Hybrid** tab shows an all-round setup (`hybridValue`, the mean of the
  surface recs) via `TuningSlider`; the surface tabs show `TuningDelta` bars whose reference **is**
  `hybridValue(p)` (so deltas can't drift), with `±0` for params that have no surface variation.
  Filled marker = setting, hollow tick = hybrid, coloured segment + signed badge = delta (green
  higher, blue lower). Radios carry `autocomplete="off"` so the Hybrid tab
  is always the default on load.

To change a guide's numbers, edit its `values` map (grounded in the reference data). The
tuning-component set is `SetupTabs.astro`, `TuningSlider.astro`, `TuningDelta.astro`, `tuning.ts`, and
the data in `src/data/tuning/`; `TuningSlider` / `TuningDelta` are internals of `SetupTabs` and guides
don't use them directly. To add a car's setup: create `src/content/tuning/<car>.mdx` as a **fragment**
(see `roadslayer.mdx` and
[`CONTRIBUTING.md`](./CONTRIBUTING.md#a-cars-tuning-setup--srccontenttuningslugmdx)) — `import
buildGroups`, supply a `values` map from the reference data, author the four `why` slots. No parts/
upgrades content (that feature was removed).

## Data pipeline (game files → JSON → site)

Game data is extracted from the local install's **loose, uncompressed** node-tree files
(`…\Wreckfest 2\data\vehicle`). The extractor lives in the sibling project
`D:\projects\wreckfest` (the `Wf2Core` library + `Wf2Cli`), command `guides`:

```sh
# from D:\projects\wreckfest
dotnet run --project Wf2Cli -- guides \
  "C:\Program Files (x86)\Steam\steamapps\common\Wreckfest 2\data\vehicle" \
  <outDir>
```

It reads car display names (`VEHICLE_NAME_*` + length-prefixed literal in
`vehicle/carNN/career/default.cavs`). See `GuideExporter.cs`. (The exporter can also read the
per-car part catalog, but the site no longer surfaces parts/upgrades.)

### What extracts cleanly vs. not

- **Clean from files:** car roster + display names,
  track roster / route structure / reverse variants (`data/property/track/*.tcat`).
- **NOT clean (unlabeled binary floats / compressed loc DB):** headline car stats (weight,
  power, top speed), exact tuning slider ranges, **track display names + surface**. These are
  deferred — sourced from the in-game UI later, or a future `.rpck` crack. Track profiles and
  car stats are authored around what's known and flag the rest.

## Content conventions (do not silently change)

- Slider percentages = **position along the slider's travel** (0 = full left, 100 = full
  right), not the number the game prints (WF2 readouts can exceed 100%).
- Gamepad note: Steering Ratio one notch slower than shown; Lock to Lock unchanged.
- Front Balancer: treat empirically ("test both ways in one braking zone") — undocumented.
- FWD tuning inverts RWD habits (stiffen the rear to rotate the nose).
- Style: minimal bold, plain prose, no formulaic AI phrasing. Headers carry hierarchy.

## Commands

- `npm run dev` — dev server. `npm run build` — static build to `dist/`. `npm run preview` — serve `dist/`.

## Deploy (Cloudflare Pages)

Static build. Two paths (details in `CONTRIBUTING.md`):
- **Git integration** — Pages config: build command `npm run build`, output directory `dist`;
  auto-deploys on push to `main`.
- **Manual** — `npm run deploy` (build + `wrangler pages deploy dist` to the `wreckfest2-guides`
  project); `npm run deploy:preview` for a preview deployment. Needs `npx wrangler login` once.

# AGENTS.md

Guidance for coding agents working in this repo — the Wreckfest 2 Guides static site (Astro).

## Start here

- [`CLAUDE.md`](./CLAUDE.md) — architecture, the tuning-widget model, and house conventions.
- [`CONTRIBUTING.md`](./CONTRIBUTING.md) — step-by-step for adding each content type, with examples.

Read both before editing content. This file only highlights what agents most often get wrong.

## Ground everything in the reference data

The site's tuning facts are **not** to be invented. Three sources of truth live in
`src/data/tuning/` — read them before authoring or reviewing any car/tuning/track content:

- `schema.ts` (`TUNING_SCHEMA`) — the **universal** tuning menu: every slider `key`, unit, endpoint
  label, min/max range, and stock default. Identical for every car. All guides build their widget
  from it via `buildGroups(values)`; a car supplies only per-surface recommendations + notes.
- `surface-tuning-reference.md` — which **direction** each category moves Mud → Gravel → Asphalt.
- `car-reference.md` — each car's inspiration, drivetrain, and **handling vice to tune around**,
  grouped by archetype.

Workflow when writing tuning numbers: archetype (car-reference) → per-surface direction
(surface-reference) → magnitude biased by the car's vice → real value inside the slider's schema
range. Cite/trace, don't guess. `roadslayer.real.json` is the archived raw capture (reference only).

## Conventions that are easy to break

- **Differential is fixed site-wide:** more locked on loose (mud/gravel), more open on grip
  (asphalt) — for `diff.power`, `diff.coast`, `diff.preload`. Sanity check: `mud ≥ gravel ≥ asphalt`.
- **FWD inverts RWD** — stiffen the rear to rotate the nose. The universal menu still labels the diff
  "Differential — Rear" even for FWD; describe it functionally in prose, do **not** relabel the category.
- **Slider %** = position along the slider's travel (0–100), not the game's printed readout.
- **Gamepad:** Steering Ratio one notch slower than shown.
- **No parts/upgrades.** That feature was removed — don't reintroduce a `partsData` field, a parts
  table, or "where to spend upgrades" prose.
- **Per-car tuning `.mdx` are embeddable fragments** (just `<SetupTabs>`), rendered inside the car
  profile's Setup section — no route, no `tune-grid`/`tune-notes` wrapper. Only the three generic
  guides are standalone routed pages with the full header.
- **MDX:** never put `//` comment lines in an `.mdx` file (breaks the parser); keep blank lines
  around each `<Fragment slot="…">`.
- **Prose:** plain, minimal bold, no formulaic AI phrasing.

## Verify

Run `npm run build` after any content or component change — content schemas and MDX are validated at
build time, so a bad field or syntax error fails the build. (Note: the sandboxed browser here cannot
reach `localhost`, so verify rendered structure from the built `dist/` HTML rather than a live preview.)

## Development

Prefer background mode for the dev server so it doesn't block:

```
astro dev --background
```

Manage it with `astro dev stop`, `astro dev status`, and `astro dev logs`.

# Wreckfest 2 Guides

Unofficial, fan-made guides for **Wreckfest 2** — car profiles, track profiles, tuning setups, and
racing lessons. A content-first static site built with [Astro](https://astro.build) and deployed to
Cloudflare Pages.

Not affiliated with Bugbear or THQ Nordic.

## Quick start

```sh
npm install
npm run dev       # local dev server at localhost:4321
npm run build     # static build to dist/ (also validates content schemas)
npm run preview   # serve the built dist/
```

## What's here

- **Car profiles + setups** — each car page merges how it drives (Overview) with an interactive,
  per-surface tuning sheet (Setup) in the game's real units.
- **Track profiles** — surface, layouts, and where the race is decided.
- **Tuning guides** — generic RWD/FWD/AWD baselines, all built from one universal tuning schema.
- **Racing lessons** — Wreckfest-specific racecraft.

Content lives in `src/content/{cars,tracks,tuning,lessons}/`; the tuning reference data (the sources
of truth for every number) lives in `src/data/tuning/`.

## Contributing

- [`CONTRIBUTING.md`](./CONTRIBUTING.md) — how to add or edit each content type, the reference-data
  workflow, and the house conventions.
- [`CLAUDE.md`](./CLAUDE.md) — architecture and the tuning-widget model.
- [`AGENTS.md`](./AGENTS.md) — brief for coding agents.

**Tuning numbers are never invented** — they trace to the reference data in `src/data/tuning/`
(`schema.ts`, `surface-tuning-reference.md`, `car-reference.md`). See `CONTRIBUTING.md`.

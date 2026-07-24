---
name: refine-tasks
description: Refine a coarse backlog.md item into a concrete, actionable checklist of sub-steps (acceptance criteria) recorded under that item, then flip it to Status REFINED. Proposes the breakdown for approval before writing. Use when the user runs /refine-tasks or asks to refine a backlog item, break an item into steps, or make a backlog entry actionable.
---

# Refine a backlog item → actionable steps

Turn a coarse idea in `backlog.md` into a concrete checklist of sub-steps so it can be picked up
cold later. The agent **proposes** the breakdown and waits for approval before writing anything.

This project uses a single tracker, `backlog.md` at the repo root. Items look like:

```
## 1. Remove the AWD tuning guide
**Status:** TODO · **Effort:** S

<description + implementation notes>
```

## Argument handling

- `/refine-tasks` → refine all items with `**Status:** TODO`.
- `/refine-tasks <id>` → refine only the named item (by number or matching title).

If `backlog.md` is missing, tell the user and offer to create it rather than guessing a different
location. Skip and briefly note any item that is already `REFINED`, `IN PROGRESS`, or `DONE`.

## Workflow

Do these in order. **Do not write to `backlog.md` until step 3 is approved.**

### 1. Read and select
1. Read `backlog.md` in full, plus the files each in-scope item references, so the breakdown
   reflects the actual code. This is an Astro static site — the pieces most items touch are the
   content collections in `src/content/{cars,tracks,tuning,lessons}/`, their schemas in
   `src/content.config.ts`, the feature-flag setup (`astro.config.mjs`, `src/config/flags.ts`,
   `src/integrations/feature-routes.mjs`), the pages/routes in `src/pages/**` and `src/routes/**`,
   and the tuning data in `src/data/tuning/`. `CONTRIBUTING.md` documents the house workflows
   (reference-data grounding, gating a section, content conventions) — consult it so steps match
   how the repo actually works.
2. Build the list of items to refine (`TODO`, or the one named in the argument). If none qualify,
   report that and stop.

### 2. Draft the breakdown
For each in-scope item, decompose it into the smallest set of concrete sub-steps that fully covers
it. Each sub-step:
- An imperative one-liner (e.g. "Add `FEATURE_TRACKS` to `env.schema` in `astro.config.mjs`").
- An optional acceptance criterion if it isn't obvious.
- Keep sub-steps independently checkable and **name the file(s) each touches**.

If something is ambiguous or under-specified, **ask the user** the specific questions instead of
guessing — list them and pause. (E.g. item 1 asks how far to purge AWD; item 2's default-flag value
is a real choice.) Respect the house rules while refining: tuning numbers trace to `src/data/tuning/`,
prose follows the content conventions, and every change must still pass `npm run build`.

### 3. Propose and get approval
Present the proposed sub-steps grouped by backlog item, e.g.:

```
3. Replace the "By car" grid with a link to the cars page
   - [ ] Remove the perCar card grid from src/pages/tuning/index.astro
   - [ ] Drop the now-unused perCar filter, cars fetch, and carHref helper
   - [ ] Add a one-line callout linking to /cars/
   - [ ] npm run build passes
```

Ask the user to approve, edit, or drop steps. **Wait for a response.** Incorporate edits; re-confirm
if changes were substantial.

### 4. Write (only after approval)
For each refined item, edit its section in `backlog.md`:
1. Set `**Status:** TODO` → `**Status:** REFINED`.
2. Add a `**Steps:**` checklist (today's date) under the item's notes:
   ```
   **Steps:** _refined YYYY-MM-DD_
   - [ ] <sub-step>
   - [ ] <sub-step>
   ```
3. Preserve all other content and formatting; only touch the lines described. Don't renumber items.

### 5. Report
Summarize what was refined: per item, the number of sub-steps added, and note any items skipped or
questions still open.

## Rules

- Never modify `backlog.md` before approval in step 3.
- Never renumber existing backlog items.
- Don't fabricate requirements — ask when unsure.
- Keep `backlog.md` as the single source of truth; don't create extra tracker files.

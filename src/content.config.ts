import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const drivetrain = z.enum(['FWD', 'RWD', 'AWD']);
// Silhouette used by the car index art (see components/CarArt.astro). Placeholder
// shapes until real car imagery exists — set `heroImage` to override per car.
const bodyStyle = z.enum([
  'muscle', 'sedan', 'sports', 'roadster', 'hatch', 'coupe', 'wagon', 'van', 'bubble',
]);
const surface = z.enum(['tarmac', 'dirt', 'gravel', 'mixed']);

// Car profiles — one Markdown file per car. Numeric stats are intentionally
// optional for now (see project notes: headline stats deferred).
const cars = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/cars' }),
  schema: z.object({
    name: z.string(),
    internalId: z.string(), // e.g. "car01"
    drivetrain: drivetrain,
    inspiration: z.string().optional(), // real-world lookalike (from car-reference.md)
    archetype: z.string().optional(), // handling archetype, e.g. "RWD muscle", "FWD hatch"
    bodyStyle: bodyStyle.optional(), // silhouette for the index art
    summary: z.string(),
    heroImage: z.string().optional(),
    // Photo attribution. Required together — a photo we can't credit doesn't ship.
    // Populated by scripts/fetch-car-images.mjs; surfaced on /credits/.
    imageCredit: z.string().optional(), // photographer, as Commons names them
    imageLicense: z.string().optional(), // e.g. "CC BY 2.0", "Public domain"
    imageSource: z.string().url().optional(), // the Commons file page
    order: z.number().default(999),
    draft: z.boolean().default(false),
  }),
});

// Track profiles — one Markdown file per venue (a location, which may hold
// several playable layouts). `layouts` captures each route the game ships.
const tracks = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/tracks' }),
  schema: z.object({
    name: z.string(),
    internalId: z.string(), // base folder id, e.g. "track01"
    surface: surface, // primary surface for the venue
    hasReverse: z.boolean().default(false),
    location: z.string().optional(), // real-world/setting locale
    // How sure we are of the real name mapping from internal id → community name.
    confidence: z.enum(['confirmed', 'high', 'medium']).optional(),
    // Each playable route at this venue.
    layouts: z
      .array(
        z.object({
          name: z.string(),
          reverse: z.boolean().default(false),
          lengthM: z.number().optional(),
          surfaceMix: z.string().optional(), // e.g. "64% tarmac / 36% gravel"
        }),
      )
      .optional(),
    summary: z.string(),
    heroImage: z.string().optional(), // /tracks/<slug>/hero.jpg — in-game screenshot
    mapImage: z.string().optional(), // /tracks/<slug>/map.png — cropped track-select map
    order: z.number().default(999),
    draft: z.boolean().default(false),
  }),
});

// Tuning guides — generic per-drivetrain guides and per-car guides.
// Authored as MDX so they can embed interactive components (e.g. SetupTabs).
const tuning = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/tuning' }),
  schema: z.object({
    title: z.string(),
    kind: z.enum(['generic', 'car']),
    drivetrain: drivetrain.optional(), // set for generic guides
    carId: z.string().optional(), // set for per-car guides (matches car internalId)
    summary: z.string(),
    order: z.number().default(999),
    draft: z.boolean().default(false),
  }),
});

// Racing lessons — Wreckfest-specific racecraft.
const lessons = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/lessons' }),
  schema: z.object({
    title: z.string(),
    topic: z.string(), // per-lesson tag, e.g. "Braking", "Cornering", "Contact"
    category: z.string().default('Other'), // section on the lessons index, e.g. "Car control"
    surface: surface.optional(),
    summary: z.string(),
    order: z.number().default(999),
    draft: z.boolean().default(false),
  }),
});

export const collections = { cars, tracks, tuning, lessons };

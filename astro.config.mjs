// @ts-check
import { defineConfig, envField } from 'astro/config';

import mdx from '@astrojs/mdx';
import featureRoutes from './src/integrations/feature-routes.mjs';

/**
 * Feature flags are build-time only: flipping one requires a rebuild, and a
 * flagged-off feature is absent from the output rather than hidden inside it.
 * Flags are declared in `env.schema` below (typed + validated at build); app
 * code reads them through `src/config/flags.ts`. See CONTRIBUTING.md.
 *
 * This config file can't import `astro:env` (that virtual module is for app
 * code), so it parses process.env directly for flags needed during routing.
 */
const FLAG_NAMES = ['FEATURE_LESSONS', 'SHOW_DRAFTS'];

// `astro:env` booleans only accept "true"/"false", but `FEATURE_LESSONS=1` is the
// natural thing to type. Normalise first so both forms work and the schema is happy.
for (const name of FLAG_NAMES) {
  if (process.env[name] === '1') process.env[name] = 'true';
  if (process.env[name] === '0') process.env[name] = 'false';
}

const envFlag = (name, fallback = false) => {
  const raw = process.env[name];
  if (raw === undefined || raw === '') return fallback;
  return raw === 'true';
};

// https://astro.build/config
export default defineConfig({
  // Cloudflare Pages default subdomain; update if a custom domain is added.
  site: 'https://wreckfest2-guides.pages.dev',
  integrations: [
    mdx(),
    featureRoutes([
      {
        name: 'lessons',
        enabled: envFlag('FEATURE_LESSONS'),
        prefix: '/lessons',
        routes: [
          { pattern: '/lessons', entrypoint: './src/routes/lessons/index.astro' },
          { pattern: '/lessons/[...slug]', entrypoint: './src/routes/lessons/[...slug].astro' },
        ],
      },
    ]),
  ],
  env: {
    schema: {
      /** Racing Lessons: nav entry, home-page card, and every /lessons/ route. */
      FEATURE_LESSONS: envField.boolean({ context: 'server', access: 'public', default: false }),
      /** Build `draft: true` content too. Local authoring only — never production. */
      SHOW_DRAFTS: envField.boolean({ context: 'server', access: 'public', default: false }),
    },
  },
});

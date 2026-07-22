import { readdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

/**
 * Build-time gating for a whole site section: its routes, and any links into it.
 *
 * Two problems, two hooks.
 *
 * 1. Routes. Astro builds everything in `src/pages/` unconditionally, so a gated
 *    section's pages live in `src/routes/<section>/` instead and are injected on
 *    `astro:config:setup` only when the flag is on. Flag off = no route, no HTML.
 *    (Mutating the route list in `astro:routes:resolved` does NOT work — routes
 *    are reported there but still get built.)
 *
 * 2. Links. Templates can gate a link with `{FLAG && ...}`, but content prose
 *    can't — a track profile linking to a lesson would emit a 404. That is fixed
 *    on `astro:build:done` by unwrapping such anchors in the emitted HTML,
 *    keeping the words and dropping the link.
 *
 *    This deliberately post-processes output rather than using a rehype plugin.
 *    A rehype plugin runs during markdown rendering, and rendered content is
 *    cached (`node_modules/.astro`) with a key that does not include our flags —
 *    so flipping a flag left stale links in the output, which `npm run deploy`
 *    would happily ship. Post-processing runs on every build regardless of cache.
 *
 * Usage (astro.config.mjs):
 *
 *     featureRoutes([
 *       { name: 'lessons', enabled: FEATURE_LESSONS, prefix: '/lessons',
 *         routes: [{ pattern: '/lessons', entrypoint: './src/routes/lessons/index.astro' }] },
 *     ])
 *
 * Note: astro.config.mjs can't import `astro:env` (that virtual module is for app
 * code), so the caller passes plain booleans parsed from process.env.
 */
export default function featureRoutes(sections = []) {
  const disabled = () => sections.filter((s) => !s.enabled && s.prefix);

  return {
    name: 'feature-routes',
    hooks: {
      'astro:config:setup': ({ injectRoute, logger }) => {
        for (const section of sections) {
          const count = section.routes?.length ?? 0;
          if (!section.enabled) {
            logger.info(`${section.name}: flag off — ${count} route(s) not built`);
            continue;
          }
          for (const route of section.routes ?? []) {
            injectRoute({ ...route, prerender: true });
          }
          logger.info(`${section.name}: flag on — ${count} route(s) injected`);
        }
      },

      'astro:build:done': async ({ dir, logger }) => {
        const off = disabled();
        if (off.length === 0) return;

        const prefixes = off.map((s) => s.prefix.replace(/\/$/, ''));
        // <a ...href="/prefix..."...>text</a>  ->  text   (no nested anchors in our content)
        const pattern = new RegExp(
          `<a\\b[^>]*href="(?:${prefixes.join('|')})(?:/[^"]*)?"[^>]*>([\\s\\S]*?)</a>`,
          'g',
        );

        const root = fileURLToPath(dir);
        let files = 0;
        let links = 0;

        const walk = async (current) => {
          for (const entry of await readdir(current, { withFileTypes: true })) {
            const full = path.join(current, entry.name);
            if (entry.isDirectory()) {
              await walk(full);
            } else if (entry.name.endsWith('.html')) {
              const html = await readFile(full, 'utf-8');
              let hits = 0;
              const next = html.replace(pattern, (_m, text) => {
                hits++;
                return text;
              });
              if (hits > 0) {
                await writeFile(full, next, 'utf-8');
                files++;
                links += hits;
              }
            }
          }
        };

        await walk(root);
        if (links > 0) {
          logger.info(
            `unwrapped ${links} link(s) into disabled section(s) ${prefixes.join(', ')} across ${files} page(s)`,
          );
        }
      },
    },
  };
}

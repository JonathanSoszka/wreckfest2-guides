// @ts-check
import { defineConfig } from 'astro/config';

import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  // Cloudflare Pages default subdomain; update if a custom domain is added.
  site: 'https://wreckfest2-guides.pages.dev',
  integrations: [mdx()],
});

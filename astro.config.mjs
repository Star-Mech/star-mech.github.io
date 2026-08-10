import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// No React and no MDX. Both were installed during scaffolding and neither is
// used: the interactive pieces are progressive enhancement over server-rendered
// markup, and all content lives in typed data modules. Keeping the React
// integration emitted an unreferenced client runtime into the build.
export default defineConfig({
  site: 'https://star-mech.github.io',
  base: '/',
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});

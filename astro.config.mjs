// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  // Uncomment if hosting as a project page instead of a user/org site:
  // base: '/cody-duke-portfolio',
  site: 'https://codyduke.github.io',

  integrations: [react()],
});
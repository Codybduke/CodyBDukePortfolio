// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import { resumePdfDevPlugin } from './scripts/resume-pdf.mjs';

const base = '/CodyBDukePortfolio';

// https://astro.build/config
export default defineConfig({
  site: 'https://codybduke.github.io',
  base,
  integrations: [react()],
  vite: {
    plugins: [resumePdfDevPlugin(base)],
  },
});

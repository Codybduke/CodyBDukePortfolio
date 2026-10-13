// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import { oxpPrototypeDevPlugin } from './scripts/oxp-prototype-dev.mjs';
import { resumePdfDevPlugin } from './scripts/resume-pdf.mjs';

const base = '/';

// https://astro.build/config
export default defineConfig({
  site: 'https://codybduke.com',
  base,
  integrations: [react()],
  vite: {
    plugins: [oxpPrototypeDevPlugin(base), resumePdfDevPlugin(base)],
  },
});

import fs from 'node:fs';
import path from 'node:path';
import type { APIRoute } from 'astro';

/**
 * Dev-only: Astro's dev server does not serve `public/prototypes/oxp-mobile/`
 * as a directory index, and Expo Router treats `/index.html` as an unmatched
 * route. `astro build` skips this file because the same path exists in public;
 * GitHub Pages then serves that `index.html` for the directory URL.
 */
export const GET: APIRoute = () => {
  const file = path.join(process.cwd(), 'public/prototypes/oxp-mobile/index.html');
  if (!fs.existsSync(file)) {
    return new Response('Prototype not exported. Run npm run prototype:oxp.', {
      status: 404,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }
  return new Response(fs.readFileSync(file, 'utf8'), {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
};

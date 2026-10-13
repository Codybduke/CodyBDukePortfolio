import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(process.cwd(), 'public/prototypes/oxp-mobile');
const ROUTE = '/prototypes/oxp-mobile/';

const TYPES = {
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.ttf': 'font/ttf',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.map': 'application/json; charset=utf-8',
};

function stripBase(reqUrl, base) {
  const url = new URL(reqUrl ?? '/', 'http://localhost');
  let pathname = decodeURIComponent(url.pathname);
  const prefix = base.endsWith('/') ? base.slice(0, -1) : base;
  if (prefix && pathname.startsWith(prefix)) pathname = pathname.slice(prefix.length) || '/';
  return pathname;
}

/**
 * Vite snapshots `public/` when the dev server starts and only serves paths
 * from that set. Re-exporting the prototype writes a new hashed bundle, which
 * the snapshot does not include, so the embed's script 404s and the loading
 * screen never goes away. Read the prototype directory from disk instead.
 */
export function oxpPrototypeDevPlugin(base) {
  return {
    name: 'oxp-prototype-dev',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.method !== 'GET' && req.method !== 'HEAD') return next();
        const pathname = stripBase(req.url, base);
        if (!pathname.startsWith(ROUTE)) return next();
        const rel = pathname.slice(ROUTE.length);
        if (!rel || rel.endsWith('/')) return next();

        const file = path.resolve(ROOT, rel);
        if (file !== ROOT && !file.startsWith(ROOT + path.sep)) return next();

        let stat;
        try {
          stat = fs.statSync(file);
        } catch {
          return next();
        }
        if (!stat.isFile()) return next();

        const type = TYPES[path.extname(file).toLowerCase()] ?? 'application/octet-stream';
        res.statusCode = 200;
        res.setHeader('Content-Type', type);
        res.setHeader('Content-Length', String(stat.size));
        res.setHeader('Cache-Control', 'no-cache');
        if (req.method === 'HEAD') {
          res.end();
          return;
        }
        fs.createReadStream(file).pipe(res);
      });
    },
  };
}

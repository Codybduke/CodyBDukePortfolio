# Cody Duke — Portfolio Site

Static Product Design portfolio (Astro). Built to host on GitHub Pages later.

## Pages

| Route | Purpose |
|---|---|
| `/` | Home — brand, one-liner, CTAs, highlight 3 + view more |
| `/work` | Full work index |
| `/work/[slug]` | Case study stubs |
| `/about` | Narrative arc + contact |
| `/fun` | Hobbies / side AI projects |

## Develop

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Edit content

- Site copy / contact: `src/data/site.ts`
- Case studies: `src/data/cases.ts`
- Fun stuff: `src/data/fun.ts`

Prep drafts and assets still live in `Cody_Duke's_PM_Workspace/Portfolio/`.

## Hosting notes

- Default `site` in `astro.config.mjs` is set for a user/org GitHub Pages root.
- If you publish as a **project** page, uncomment `base: '/cody-duke-portfolio'`.
- Sanitize case content before making the repo public.

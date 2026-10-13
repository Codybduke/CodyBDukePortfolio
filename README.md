# Cody Duke — Portfolio Site

Product design portfolio, built with Astro and published at [codybduke.com](https://codybduke.com).

## Pages

| Route | Purpose |
|---|---|
| `/` | Home — brand, one-liner, CTAs, highlight 3 + view more |
| `/work` | Full work index |
| `/work/[slug]` | Case study |
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

## Hosting

Published at https://codybduke.com/

`site` and `base` are set in `astro.config.mjs`.

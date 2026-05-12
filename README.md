# Cody Duke — Portfolio

Personal portfolio site for [@Codybduke](https://github.com/Codybduke).

Hosted on GitHub Pages at: **https://codybduke.github.io/CodyBDukePortfolio/**

> Status: environment scaffolded, design not yet started.

## Stack

- [Vite](https://vite.dev/) + React 19 + TypeScript
- Deployed via GitHub Actions to GitHub Pages (see `.github/workflows/deploy.yml`)

## Local development

```bash
npm install
npm run dev      # start dev server at http://localhost:5173/CodyBDukePortfolio/
npm run build    # type-check + production build into ./dist
npm run preview  # serve the built bundle locally
```

## Deployment

Every push to `main` triggers `.github/workflows/deploy.yml`, which builds the site
and publishes `dist/` to GitHub Pages.

One-time setup in GitHub (after the first push):

1. Go to **Settings → Pages**.
2. Under **Build and deployment**, set **Source** to **GitHub Actions**.
3. The next push to `main` will publish the site.

## Notes for future me

- `vite.config.ts` sets `base: '/CodyBDukePortfolio/'` because this is a *project
  page*. If you ever rename the repo to `codybduke.github.io` (user page), change
  `base` back to `'/'`.
- `public/.nojekyll` is intentional — it stops GitHub Pages from running Jekyll
  over the static output and breaking files/folders starting with `_`.
- The "personal OS" planning files (goals, tasks, knowledge) live in a
  separate workspace (`Build AI Product Sense`), not here. Keep this repo
  focused on the site.

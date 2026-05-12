import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages serves this project at https://codybduke.github.io/CodyBDukePortfolio/
// so we set `base` to the repo name. If you ever move to a user page
// (repo renamed to `codybduke.github.io`), change `base` back to '/'.
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/CodyBDukePortfolio/',
})

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base: './' keeps the build portable so it can be deployed from any sub-path
// (GitHub Pages, Netlify subfolders, etc.) without rewriting asset URLs.
export default defineConfig({
  plugins: [react()],
  base: './',
  server: {
    open: false,
  },
})

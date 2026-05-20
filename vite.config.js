import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Change base to '/your-repo-name/' for GitHub Pages
// Leave as '/' for Vercel or Netlify
export default defineConfig({
  plugins: [react()],
  base: '/',
})

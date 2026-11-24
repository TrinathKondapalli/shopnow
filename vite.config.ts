import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// Static build: `npm run build` writes a deployable site to dist/.
// `base: './'` keeps asset paths relative so dist/ works on any host or sub-folder.
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
});

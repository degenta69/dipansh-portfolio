import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { existsSync } from 'node:fs'
// The head-only rigged model (public/avatar/avatar-head.glb) is picked up automatically when present at build/dev start;
// otherwise the loader uses avatar.glb and crops the torso. (Build-time check avoids a 404 / SPA-fallback probe at runtime.)
export default defineConfig({
  plugins: [react()],
  define: { __HEAD_GLB__: JSON.stringify(existsSync('public/avatar/avatar-head.glb')) },
  build: { target: 'es2020', chunkSizeWarningLimit: 700 },
})

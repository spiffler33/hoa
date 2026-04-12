import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  server: {
    // Pinned to 5174 because 5173 is owned by another app on this machine.
    // strictPort: fail loudly if 5174 is taken rather than silently falling
    // back to 5175+. See memory: feedback_ports.md.
    port: 5174,
    strictPort: true,
  },
})

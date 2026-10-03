import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Forward API calls to the .NET backend (http profile in launchSettings.json),
    // so the browser sees a single origin and no CORS setup is needed in dev.
    proxy: {
      '/api': 'http://localhost:60702',
    },
  },
})

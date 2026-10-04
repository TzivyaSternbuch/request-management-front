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
  build: {
    rolldownOptions: {
      output: {
        // Third-party libraries go in their own files: it keeps each file under the size warning,
        // and the browser can cache them separately from our own code, which changes more often.
        // MUI is the largest library, so it gets a file of its own.
        codeSplitting: {
          groups: [
            { name: 'mui', test: /node_modules[\\/]@mui/, priority: 2 },
            { name: 'vendor', test: /node_modules/, priority: 1 },
          ],
        },
      },
    },
  },
})

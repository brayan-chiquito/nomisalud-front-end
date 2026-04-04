import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    env: {
      VITE_API_URL: 'http://localhost:8080/api/v1',
      VITE_APP_NAME: 'Nomisalud',
      VITE_APP_VERSION: '0.1.0',
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/index.ts',
        'src/main.tsx',
        'src/App.tsx',
        'src/router/**',
        'src/services/http.ts',
        'vite.config.ts',
        'vitest.config.ts',
      ],
    },
  },
})

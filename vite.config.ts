/// <reference types="vitest/config" />
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    // Stub values so the fail-fast guards in src/lib don't throw in CI,
    // where no .env.local exists. Unit tests must never hit the real API.
    env: {
      VITE_API_URL: 'http://localhost/graphql',
      VITE_API_TOKEN: 'test-token',
    },
  },
})

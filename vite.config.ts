/// <reference types="vitest/config" />
import { fileURLToPath } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  if (command === 'serve' && mode !== 'test' && (!env.API_URL || !env.API_TOKEN)) {
    throw new Error(
      'Missing API_URL / API_TOKEN — copy .env.example to .env.local and add your token (see README).',
    )
  }

  const graphqlProxy = env.API_URL
    ? {
        '/graphql': {
          target: new URL(env.API_URL).origin,
          changeOrigin: true,
          rewrite: () => new URL(env.API_URL).pathname,
          headers: {
            Authorization: `Bearer ${env.API_TOKEN}`,
          },
        },
      }
    : undefined

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server: {
      proxy: graphqlProxy,
    },
    preview: {
      proxy: graphqlProxy,
    },
    test: {
      environment: 'jsdom',
      setupFiles: ['./src/test/setup.ts'],
      include: ['src/**/*.test.{ts,tsx}'],
    },
  }
})

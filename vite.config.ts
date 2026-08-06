/// <reference types="vitest/config" />
import { fileURLToPath } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  const apiUrl = env.API_URL
  const apiToken = env.API_TOKEN

  if (command === 'serve' && mode !== 'test') {
    if (!apiUrl || !apiToken) {
      throw new Error(
        'Missing API_URL / API_TOKEN — copy .env.example to .env.local and add your token (see README).',
      )
    }
    // The proxy forwards the Authorization header; plaintext http would send
    // the token in cleartext. localhost is exempt for local mock servers.
    const { protocol, hostname } = new URL(apiUrl)
    if (protocol !== 'https:' && hostname !== 'localhost' && hostname !== '127.0.0.1') {
      throw new Error(
        `API_URL must use https (got ${protocol}//) — the Bearer token must never travel over plaintext http.`,
      )
    }
  }
  const graphqlProxy =
    apiUrl && apiToken
      ? {
          '/graphql': {
            target: new URL(apiUrl).origin,
            changeOrigin: true,
            rewrite: () => new URL(apiUrl).pathname,
            headers: {
              Authorization: `Bearer ${apiToken}`,
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

import { config as loadEnv } from 'dotenv'
import type { CodegenConfig } from '@graphql-codegen/cli'

loadEnv({ path: ['.env.local', '.env'] })

if (!process.env.VITE_API_URL || !process.env.VITE_API_TOKEN) {
  throw new Error('Set VITE_API_URL and VITE_API_TOKEN in .env.local (see .env.example)')
}

// Run with: npm run codegen
const config: CodegenConfig = {
  schema: {
    [process.env.VITE_API_URL ?? '']: {
      headers: {
        Authorization: `Bearer ${process.env.VITE_API_TOKEN ?? ''}`,
      },
    },
  },
  documents: ['src/**/*.{ts,tsx}'],
  ignoreNoDocuments: true,
  generates: {
    './src/graphql/generated/': {
      preset: 'client',
      // Required by verbatimModuleSyntax: emit `import type` for type-only symbols.
      config: { useTypeImports: true },
    },
  },
}

export default config

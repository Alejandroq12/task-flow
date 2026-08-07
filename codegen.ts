import { config as loadEnv } from 'dotenv'
import type { CodegenConfig } from '@graphql-codegen/cli'

loadEnv({ path: ['.env.local', '.env'] })

if (!process.env.API_URL || !process.env.API_TOKEN) {
  throw new Error('Set API_URL and API_TOKEN in .env.local (see .env.example)')
}

const { protocol, hostname } = new URL(process.env.API_URL)
if (protocol !== 'https:' && hostname !== 'localhost' && hostname !== '127.0.0.1') {
  throw new Error('API_URL must use https — codegen sends the Bearer token with introspection.')
}

// Run with: npm run codegen
const config: CodegenConfig = {
  schema: {
    [process.env.API_URL]: {
      headers: {
        Authorization: `Bearer ${process.env.API_TOKEN}`,
      },
    },
  },
  documents: ['src/**/*.{ts,tsx}'],
  ignoreNoDocuments: true,
  generates: {
    './src/graphql/generated/': {
      preset: 'client',
      // Required by verbatimModuleSyntax: emit `import type` for type-only symbols.
      config: { useTypeImports: true, scalars: { DateTime: 'string' } },
    },
  },
}

export default config

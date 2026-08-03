/// <reference types="vite/client" />

interface ViteTypeOptions {
  strictImportMetaEnv: unknown
}

// No VITE_-prefixed variables exist by design: the API token stays server-side
// (dev-server proxy in vite.config.ts, codegen.ts) and must never be inlined
// into the browser bundle.

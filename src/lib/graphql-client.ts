import { GraphQLClient } from 'graphql-request'

const url = import.meta.env.VITE_API_URL
const token = import.meta.env.VITE_API_TOKEN

if (!url || !token) {
  throw new Error(
    'Missing VITE_API_URL / VITE_API_TOKEN — copy .env.example to .env.local and add your token (see README).',
  )
}

// Transport layer: every query/mutation goes through this client.
// Typed documents from `npm run codegen` (TypedDocumentNode) infer both the
// response and variable types when passed to graphqlClient.request().
export const graphqlClient = new GraphQLClient(url, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
})

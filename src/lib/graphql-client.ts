import { GraphQLClient } from 'graphql-request'

// Transport layer: every query/mutation goes through this client.
// It calls the relative /graphql path; the dev server's proxy (vite.config.ts)
// forwards the request to the real API and attaches the Authorization header
// in Node, and the token never enters the browser bundle.
// Typed documents from `npm run codegen` (TypedDocumentNode) infer both the
// response and variable types when passed to graphqlClient.request().
export const graphqlClient = new GraphQLClient('/graphql')

import { GraphQLClient } from 'graphql-request'

export const graphqlClient = new GraphQLClient(
  new URL('/graphql', window.location.origin).toString(),
)

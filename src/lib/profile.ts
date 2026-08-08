import { useQuery } from '@tanstack/react-query'
import { graphql } from '@/graphql/generated'
import { graphqlClient } from '@/lib/graphql-client'

export const ProfileDocument = graphql(`
  query Profile {
    profile {
      id
      fullName
      email
      type
      avatar
      createdAt
      updatedAt
    }
  }
`)

export function useProfile() {
  return useQuery({
    queryKey: ['profile'],
    queryFn: () => graphqlClient.request(ProfileDocument),
  })
}

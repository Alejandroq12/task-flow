import { useQuery } from '@tanstack/react-query'
import { graphqlClient } from '@/lib/graphql-client'
import { TasksDocument } from '@/features/tasks/queries'

export function useTasks() {
  return useQuery({
    queryKey: ['tasks'],
    queryFn: () => graphqlClient.request(TasksDocument, { input: {} }),
  })
}

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { graphqlClient } from '@/lib/graphql-client'
import { ProfileDocument } from '@/features/tasks/queries'
import { QueryErrorAlert } from '@/features/tasks/QueryErrorAlert'
import { Toolbar } from '@/features/tasks/Toolbar'
import { TasksView } from '@/features/tasks/TasksView'
import type { BoardLayout } from '@/features/tasks/types'

export function MyTask() {
  const [layout, setLayout] = useState<BoardLayout>('list')
  const profile = useQuery({
    queryKey: ['profile'],
    queryFn: () => graphqlClient.request(ProfileDocument),
  })

  return (
    <div className="flex h-full flex-col gap-5 lg:gap-4">
      <h1 className="sr-only">My Task</h1>
      <Toolbar layout={layout} onLayoutChange={setLayout} />
      {profile.isPending && (
        <p role="status" className="p-4 text-body-m text-neutral-2">
          Loading your profile…
        </p>
      )}
      {profile.isError && (
        <QueryErrorAlert
          message="Something went wrong while loading your profile."
          onRetry={() => {
            void profile.refetch()
          }}
        />
      )}
      {profile.data !== undefined && (
        <TasksView input={{ assigneeId: profile.data.profile.id }} layout={layout} />
      )}
    </div>
  )
}

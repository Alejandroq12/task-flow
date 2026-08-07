import { useState } from 'react'
import { useSearchParams } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import { graphqlClient } from '@/lib/graphql-client'
import { ProfileDocument } from '@/features/tasks/queries'
import { QueryErrorAlert } from '@/features/tasks/QueryErrorAlert'
import { Toolbar } from '@/features/tasks/Toolbar'
import { FilterBar } from '@/features/tasks/FilterBar'
import { TasksView } from '@/features/tasks/TasksView'
import { filterInputFromParams, hasActiveFilters } from '@/features/tasks/filter-params'
import type { BoardLayout } from '@/features/tasks/types'

export function MyTask() {
  const [layout, setLayout] = useState<BoardLayout>('list')
  const [searchParams] = useSearchParams()
  const profile = useQuery({
    queryKey: ['profile'],
    queryFn: () => graphqlClient.request(ProfileDocument),
  })

  return (
    <div className="flex h-full flex-col gap-5 lg:gap-4">
      <h1 className="sr-only">My Task</h1>
      <Toolbar layout={layout} onLayoutChange={setLayout} />
      <FilterBar />
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
        <TasksView
          input={{ ...filterInputFromParams(searchParams), assigneeId: profile.data.profile.id }}
          layout={layout}
          filtered={hasActiveFilters(searchParams)}
        />
      )}
    </div>
  )
}

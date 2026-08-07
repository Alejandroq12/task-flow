import { useQuery } from '@tanstack/react-query'
import { graphqlClient } from '@/lib/graphql-client'
import { TasksDocument } from '@/features/tasks/queries'
import { TaskBoard } from '@/features/tasks/TaskBoard'
import { TaskList } from '@/features/tasks/TaskList'
import { QueryErrorAlert } from '@/features/tasks/QueryErrorAlert'
import { groupTasksByStatus } from '@/features/tasks/task-display'
import type { BoardLayout } from '@/features/tasks/types'
import type { FilterTaskInput } from '@/graphql/generated/graphql'

function TaskBoardSkeleton() {
  return (
    <>
      <p role="status" className="sr-only">
        Loading tasks…
      </p>
      <div aria-hidden="true" className="flex min-h-0 flex-1 gap-4 overflow-x-auto lg:gap-8">
        {Array.from({ length: 5 }, (_, column) => (
          <div key={column} className="flex w-85 shrink-0 flex-col gap-4 lg:w-87">
            <div className="h-8 w-40 animate-pulse rounded bg-neutral-4" />
            <div className="h-44 animate-pulse rounded-lg bg-neutral-4" />
            <div className="h-44 animate-pulse rounded-lg bg-neutral-4" />
          </div>
        ))}
      </div>
    </>
  )
}

interface TasksViewProps {
  input?: FilterTaskInput
  layout?: BoardLayout
}

export function TasksView({ input = {}, layout = 'grid' }: TasksViewProps) {
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ['tasks', input],
    queryFn: () => graphqlClient.request(TasksDocument, { input }),
  })

  if (isPending) return <TaskBoardSkeleton />

  if (isError) {
    return (
      <QueryErrorAlert
        message="Something went wrong while loading tasks."
        onRetry={() => {
          void refetch()
        }}
      />
    )
  }

  if (data.tasks.length === 0) {
    return <p className="p-4 text-body-m text-neutral-2">No tasks found.</p>
  }

  const columns = groupTasksByStatus(data.tasks)
  return layout === 'grid' ? <TaskBoard columns={columns} /> : <TaskList columns={columns} />
}

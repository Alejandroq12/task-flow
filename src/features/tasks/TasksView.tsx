import { useQuery } from '@tanstack/react-query'
import { graphqlClient } from '@/lib/graphql-client'
import { TasksDocument } from '@/features/tasks/queries'
import { TaskBoard } from '@/features/tasks/TaskBoard'
import { TaskList } from '@/features/tasks/TaskList'
import { QueryErrorAlert } from '@/components/ui/QueryErrorAlert'
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
  filtered?: boolean
}

export function TasksView({ input = {}, layout = 'grid', filtered = false }: TasksViewProps) {
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

  const tasks =
    input.ownerId !== undefined && input.ownerId !== null
      ? data.tasks.filter((task) => task.creator.id === input.ownerId)
      : data.tasks

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-start gap-2 p-4">
        <p className="text-body-l font-semibold text-neutral-1">
          {filtered ? 'No tasks match your filters' : 'No tasks found'}
        </p>
        <p className="text-body-m text-neutral-2">
          {filtered
            ? 'Try removing or changing some filters to see more results.'
            : 'Create a task with the + button to get started.'}
        </p>
      </div>
    )
  }

  const columns = groupTasksByStatus(tasks)
  return layout === 'grid' ? <TaskBoard columns={columns} /> : <TaskList columns={columns} />
}

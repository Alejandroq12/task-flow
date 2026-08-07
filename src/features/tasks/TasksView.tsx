import { TaskBoard } from '@/features/tasks/TaskBoard'
import { groupTasksByStatus } from '@/features/tasks/task-display'
import { useTasks } from '@/features/tasks/useTasks'

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

export function TasksView() {
  const { data, isPending, isError, refetch } = useTasks()

  if (isPending) return <TaskBoardSkeleton />

  if (isError) {
    return (
      <div
        role="alert"
        className="flex flex-col items-start gap-4 rounded-lg bg-primary-4/10 p-4 text-body-m text-primary-4"
      >
        <p>Something went wrong while loading tasks.</p>
        <button
          type="button"
          onClick={() => {
            void refetch()
          }}
          className="rounded bg-primary-4 px-4 py-1 font-semibold text-neutral-1"
        >
          Try again
        </button>
      </div>
    )
  }

  if (data.tasks.length === 0) {
    return <p className="p-4 text-body-m text-neutral-2">No tasks found.</p>
  }

  return <TaskBoard columns={groupTasksByStatus(data.tasks)} />
}

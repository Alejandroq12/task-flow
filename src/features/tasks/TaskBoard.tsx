import { TaskCard } from '@/features/tasks/TaskCard'
import type { BoardColumn } from '@/features/tasks/types'

export function TaskBoard({ columns }: { columns: BoardColumn[] }) {
  return (
    <div className="flex min-h-0 flex-1 gap-4 overflow-x-auto lg:gap-8">
      {columns.map(({ title, tasks }) => (
        <section
          key={title}
          aria-label={title}
          className="flex w-85 shrink-0 flex-col gap-4 lg:w-87"
        >
          <h2 className="text-body-l font-semibold text-neutral-1">
            {title} ({String(tasks.length).padStart(2, '0')})
          </h2>
          <ul className="flex min-h-0 flex-col gap-4 overflow-y-auto">
            {tasks.map((task) => (
              <li key={task.id}>
                <TaskCard task={task} />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}

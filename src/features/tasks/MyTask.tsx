import { Toolbar } from '@/features/tasks/Toolbar'
import { TasksView } from '@/features/tasks/TasksView'

export function MyTask() {
  return (
    <div className="flex h-full flex-col gap-5 lg:gap-4">
      <h1 className="sr-only">My Task</h1>
      <Toolbar />
      <TasksView />
    </div>
  )
}

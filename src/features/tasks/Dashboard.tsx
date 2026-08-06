import { Toolbar } from '@/features/tasks/Toolbar'
import { TasksView } from '@/features/tasks/TasksView'

export function Dashboard() {
  return (
    <div className="flex h-full flex-col gap-5 lg:gap-4">
      <h1 className="sr-only">Dashboard</h1>
      <Toolbar />
      <TasksView />
    </div>
  )
}

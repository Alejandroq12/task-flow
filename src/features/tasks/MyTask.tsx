import { Toolbar } from '@/features/tasks/Toolbar'
import { TaskBoard } from '@/features/tasks/TaskBoard'
import { sampleColumns } from '@/features/tasks/sample-tasks'

export function MyTask() {
  return (
    <div className="flex h-full flex-col gap-5 lg:gap-4">
      <h1 className="sr-only">My Task</h1>
      <Toolbar />
      <TaskBoard columns={sampleColumns} />
    </div>
  )
}

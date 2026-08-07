import { useState } from 'react'
import { Toolbar } from '@/features/tasks/Toolbar'
import { TasksView } from '@/features/tasks/TasksView'
import type { BoardLayout } from '@/features/tasks/types'

export function Dashboard() {
  const [layout, setLayout] = useState<BoardLayout>('grid')
  return (
    <div className="flex h-full flex-col gap-5 lg:gap-4">
      <h1 className="sr-only">Dashboard</h1>
      <Toolbar layout={layout} onLayoutChange={setLayout} />
      <TasksView layout={layout} />
    </div>
  )
}

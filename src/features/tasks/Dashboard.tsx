import { useState } from 'react'
import { useSearchParams } from 'react-router'
import { Toolbar } from '@/features/tasks/Toolbar'
import { FilterBar } from '@/features/tasks/FilterBar'
import { TasksView } from '@/features/tasks/TasksView'
import { filterInputFromParams, hasActiveFilters } from '@/features/tasks/filter-params'
import type { BoardLayout } from '@/features/tasks/types'

export function Dashboard() {
  const [layout, setLayout] = useState<BoardLayout>('grid')
  const [searchParams] = useSearchParams()
  return (
    <div className="flex h-full flex-col gap-5 lg:gap-4">
      <h1 className="sr-only">Dashboard</h1>
      <Toolbar layout={layout} onLayoutChange={setLayout} />
      <FilterBar />
      <TasksView
        input={filterInputFromParams(searchParams)}
        layout={layout}
        filtered={hasActiveFilters(searchParams)}
      />
    </div>
  )
}

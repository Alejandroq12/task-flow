import { useSearchParams } from 'react-router'
import { useProfile } from '@/lib/profile'
import { QueryErrorAlert } from '@/components/ui/QueryErrorAlert'
import { Toolbar } from '@/features/tasks/Toolbar'
import { FilterBar } from '@/features/tasks/FilterBar'
import { TasksView } from '@/features/tasks/TasksView'
import { filterInputFromParams, hasActiveFilters } from '@/features/tasks/filter-params'
import { useViewLayout } from '@/components/layout/view-layout'

export function MyTask() {
  const { layout, setLayout } = useViewLayout()
  const [searchParams] = useSearchParams()
  const profile = useProfile()

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

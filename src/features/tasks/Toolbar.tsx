import { useLocation } from 'react-router'
import { GridIcon, ListIcon } from '@/components/ui/icons'
import { PlusIcon } from '@/features/tasks/icons'

export function Toolbar() {
  const { pathname } = useLocation()
  const onMyTask = pathname === '/my-task'
  return (
    <div>
      <div className="-mx-4 flex lg:hidden">
        <div className="flex flex-1 flex-col">
          <span
            className={`w-full pt-3 pb-2 text-center text-body-s ${onMyTask ? 'text-neutral-2' : 'text-primary-4'}`}
          >
            Dashboard
          </span>
          <span className={`h-0.5 w-full ${onMyTask ? 'bg-transparent' : 'bg-primary-4'}`} />
        </div>
        <div className="flex flex-1 flex-col">
          <span
            className={`w-full pt-3 pb-2 text-center text-body-s ${onMyTask ? 'text-primary-4' : 'text-neutral-2'}`}
          >
            Task
          </span>
          <span className={`h-0.5 w-full ${onMyTask ? 'bg-primary-4' : 'bg-transparent'}`} />
        </div>
      </div>
      <div className="hidden items-center justify-between py-1 lg:flex">
        <div className="flex h-10 w-20 rounded-lg bg-neutral-5">
          <span
            role="img"
            aria-label="List view"
            className="flex size-10 items-center justify-center"
          >
            <ListIcon className="size-6 text-neutral-1" />
          </span>
          <span
            role="img"
            aria-label="Grid view"
            className="flex size-10 items-center justify-center rounded-lg border border-primary-4"
          >
            <GridIcon className="size-6 text-primary-4" />
          </span>
        </div>
        <span
          role="img"
          aria-label="Add task"
          className="flex size-10 items-center justify-center rounded-lg bg-primary-4"
        >
          <PlusIcon className="size-6 text-neutral-1" />
        </span>
      </div>
      <span
        role="img"
        aria-label="Add task"
        className="fixed right-4 bottom-4 z-20 flex size-16 items-center justify-center rounded-full bg-primary-4 lg:hidden"
      >
        <PlusIcon className="size-7 text-neutral-1" />
      </span>
    </div>
  )
}

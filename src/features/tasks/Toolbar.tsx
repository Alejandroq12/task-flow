import { useState } from 'react'
import { useLocation } from 'react-router'
import { GridIcon, ListIcon } from '@/components/ui/icons'
import { PlusIcon } from '@/features/tasks/icons'
import { CreateTaskModal } from '@/features/tasks/CreateTaskModal'
import type { BoardLayout } from '@/features/tasks/types'

interface ToolbarProps {
  layout: BoardLayout
  onLayoutChange: (layout: BoardLayout) => void
}

export function Toolbar({ layout, onLayoutChange }: ToolbarProps) {
  const { pathname } = useLocation()
  const [createOpen, setCreateOpen] = useState(false)
  const onMyTask = pathname === '/my-task'
  return (
    <div>
      <div className="-mx-4 flex lg:hidden">
        {[
          { label: 'Dashboard', active: !onMyTask },
          { label: 'Task', active: onMyTask },
        ].map((tab) => (
          <div key={tab.label} className="flex flex-1 flex-col">
            <span
              className={`w-full pt-3 pb-2 text-center text-body-s ${tab.active ? 'text-primary-4' : 'text-neutral-2'}`}
            >
              {tab.label}
            </span>
            <span className={`h-0.5 w-full ${tab.active ? 'bg-primary-4' : 'bg-transparent'}`} />
          </div>
        ))}
      </div>
      <div className="hidden items-center justify-between py-1 lg:flex">
        <div className="flex h-10 w-20 rounded-lg bg-neutral-5">
          <button
            type="button"
            aria-label="List view"
            aria-pressed={layout === 'list'}
            onClick={() => {
              onLayoutChange('list')
            }}
            className={`flex size-10 items-center justify-center rounded-lg ${
              layout === 'list' ? 'border border-primary-4 text-primary-4' : 'text-neutral-1'
            }`}
          >
            <ListIcon className="size-6" />
          </button>
          <button
            type="button"
            aria-label="Grid view"
            aria-pressed={layout === 'grid'}
            onClick={() => {
              onLayoutChange('grid')
            }}
            className={`flex size-10 items-center justify-center rounded-lg ${
              layout === 'grid' ? 'border border-primary-4 text-primary-4' : 'text-neutral-1'
            }`}
          >
            <GridIcon className="size-6" />
          </button>
        </div>
        <button
          type="button"
          aria-label="Add task"
          aria-haspopup="dialog"
          onClick={() => {
            setCreateOpen(true)
          }}
          className="flex size-10 items-center justify-center rounded-lg bg-primary-4"
        >
          <PlusIcon className="size-6 text-neutral-1" />
        </button>
      </div>
      <button
        type="button"
        aria-label="Add task"
        aria-haspopup="dialog"
        onClick={() => {
          setCreateOpen(true)
        }}
        className="fixed right-4 bottom-4 z-20 flex size-16 items-center justify-center rounded-full bg-primary-4 lg:hidden"
      >
        <PlusIcon className="size-7 text-neutral-1" />
      </button>
      {createOpen && (
        <CreateTaskModal
          onClose={() => {
            setCreateOpen(false)
          }}
        />
      )}
    </div>
  )
}

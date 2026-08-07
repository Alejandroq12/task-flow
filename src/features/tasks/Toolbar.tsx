import { useState } from 'react'
import { GridIcon, ListIcon } from '@/components/ui/icons'
import { PlusIcon } from '@/features/tasks/icons'
import { CreateTaskModal } from '@/features/tasks/CreateTaskModal'
import type { BoardLayout } from '@/components/layout/view-layout'

const MOBILE_TABS: { label: string; value: BoardLayout }[] = [
  { label: 'Dashboard', value: 'grid' },
  { label: 'Task', value: 'list' },
]

interface ToolbarProps {
  layout: BoardLayout
  onLayoutChange: (layout: BoardLayout) => void
}

export function Toolbar({ layout, onLayoutChange }: ToolbarProps) {
  const [createOpen, setCreateOpen] = useState(false)
  return (
    <div>
      <div className="-mx-4 flex lg:hidden">
        {MOBILE_TABS.map((tab) => (
          <button
            key={tab.label}
            type="button"
            aria-pressed={layout === tab.value}
            onClick={() => {
              onLayoutChange(tab.value)
            }}
            className="flex flex-1 flex-col"
          >
            <span
              className={`w-full pt-3 pb-2 text-center text-body-s ${layout === tab.value ? 'text-primary-4' : 'text-neutral-2'}`}
            >
              {tab.label}
            </span>
            <span
              className={`h-0.5 w-full ${layout === tab.value ? 'bg-primary-4' : 'bg-transparent'}`}
            />
          </button>
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

import { useRef, useState } from 'react'
import { DotsIcon, EditIcon, TrashIcon } from '@/features/tasks/icons'
import { EditTaskModal } from '@/features/tasks/EditTaskModal'
import { DeleteTaskDialog } from '@/features/tasks/DeleteTaskDialog'
import type { ApiTask } from '@/features/tasks/types'

export function TaskActions({ task }: { task: ApiTask }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [dialog, setDialog] = useState<'edit' | 'delete' | null>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  const openDialog = (which: 'edit' | 'delete') => {
    setMenuOpen(false)
    setDialog(which)
  }

  const closeDialog = () => {
    setDialog(null)
    triggerRef.current?.focus()
  }

  return (
    <div
      className="relative shrink-0"
      onKeyDown={(event) => {
        if (event.key === 'Escape') setMenuOpen(false)
      }}
    >
      <button
        ref={triggerRef}
        type="button"
        aria-label="Task options"
        aria-haspopup="menu"
        aria-expanded={menuOpen}
        onClick={() => {
          setMenuOpen((current) => !current)
        }}
        className="flex size-8 items-center justify-center rounded text-neutral-2"
      >
        <DotsIcon className="size-6" />
      </button>
      {menuOpen && (
        <>
          <button
            type="button"
            aria-label="Close menu"
            tabIndex={-1}
            onClick={() => {
              setMenuOpen(false)
            }}
            className="fixed inset-0 z-10 cursor-default"
          />
          <div
            role="menu"
            className="absolute top-full right-0 z-20 mt-1 flex w-max flex-col rounded-lg border border-neutral-2 bg-neutral-3 py-2 shadow-drop-large"
          >
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                openDialog('edit')
              }}
              className="flex w-full items-center gap-2 px-4 py-1 text-left text-body-m text-neutral-1 hover:bg-neutral-2/10"
            >
              <EditIcon className="size-6" />
              Edit
            </button>
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                openDialog('delete')
              }}
              className="flex w-full items-center gap-2 px-4 py-1 text-left text-body-m text-neutral-1 hover:bg-neutral-2/10"
            >
              <TrashIcon className="size-6" />
              Delete
            </button>
          </div>
        </>
      )}
      {dialog === 'edit' && <EditTaskModal task={task} onClose={closeDialog} />}
      {dialog === 'delete' && <DeleteTaskDialog task={task} onClose={closeDialog} />}
    </div>
  )
}

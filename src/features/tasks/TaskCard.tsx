import { useState } from 'react'
import avatarUrl from '@/assets/avatar.png'
import { AlarmIcon, DotsIcon, EditIcon, TrashIcon } from '@/features/tasks/icons'
import {
  avatarSrc,
  dueInfo,
  pointsLabel,
  TAG_META,
  tagToneClasses,
} from '@/features/tasks/task-display'
import { EditTaskModal } from '@/features/tasks/EditTaskModal'
import { DeleteTaskDialog } from '@/features/tasks/DeleteTaskDialog'
import type { ApiTask } from '@/features/tasks/types'

export function TaskCard({ task }: { task: ApiTask }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [dialog, setDialog] = useState<'edit' | 'delete' | null>(null)
  const due = dueInfo(task.dueDate)

  const openDialog = (which: 'edit' | 'delete') => {
    setMenuOpen(false)
    setDialog(which)
  }

  return (
    <article className="flex flex-col gap-4 rounded-lg bg-neutral-4 p-4">
      <div className="flex h-8 items-center gap-2">
        <h3 className="min-w-0 flex-1 truncate text-body-l font-semibold text-neutral-1">
          {task.name}
        </h3>
        <div className="relative shrink-0">
          <button
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
        </div>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-body-m font-semibold text-neutral-1">
          {pointsLabel(task.pointEstimate)}
        </span>
        <span
          className={`flex items-center gap-2 rounded px-4 py-1 text-body-m font-semibold ${
            due.overdue ? 'bg-primary-4/10 text-primary-4' : 'bg-neutral-2/10 text-neutral-1'
          }`}
        >
          <AlarmIcon className="size-6" />
          {due.label}
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {task.tags.map((tag) => (
          <span
            key={tag}
            className={`rounded px-4 py-1 text-body-m font-semibold whitespace-nowrap ${tagToneClasses[TAG_META[tag].tone]}`}
          >
            {TAG_META[tag].label}
          </span>
        ))}
      </div>
      <div className="flex items-center">
        <img
          className="size-8 rounded-full"
          src={avatarSrc(task.assignee?.avatar) ?? avatarUrl}
          alt={task.assignee?.fullName ?? 'Unassigned'}
        />
      </div>
      {dialog === 'edit' && (
        <EditTaskModal
          task={task}
          onClose={() => {
            setDialog(null)
          }}
        />
      )}
      {dialog === 'delete' && (
        <DeleteTaskDialog
          task={task}
          onClose={() => {
            setDialog(null)
          }}
        />
      )}
    </article>
  )
}

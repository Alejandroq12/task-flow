import avatarUrl from '@/assets/avatar.png'
import { avatarSrc } from '@/lib/avatar'
import { CaretDownIcon } from '@/features/tasks/icons'
import { TaskActions } from '@/features/tasks/TaskActions'
import {
  dueInfo,
  POINTS,
  TAG_META,
  tagToneClasses,
  type DueTone,
} from '@/features/tasks/task-display'
import type { ApiTask, BoardColumn } from '@/features/tasks/types'

const toneBorder: Record<DueTone, string> = {
  primary: 'border-l-primary-4',
  tertiary: 'border-l-tertiary-4',
  secondary: 'border-l-secondary-4',
}

const toneText: Record<DueTone, string> = {
  primary: 'text-primary-3',
  tertiary: 'text-tertiary-4',
  secondary: 'text-secondary-4',
}

const cellBase = 'flex h-14 items-center border border-neutral-3 bg-neutral-4 py-1'
const nameWidth = 'min-w-60 flex-1'
const tagsWidth = 'w-42 shrink-0'
const estimateWidth = 'w-35 shrink-0'
const assigneeWidth = 'w-42 shrink-0'
const dueWidth = 'w-33 shrink-0'
const actionsWidth = 'w-14 shrink-0'

const HEADERS = [
  { label: '# Task Name', className: `${nameWidth} rounded-l px-4` },
  { label: 'Task Tags', className: `${tagsWidth} pr-4 pl-4` },
  { label: 'Estimate', className: `${estimateWidth} pr-4 pl-4` },
  { label: 'Task Assign Name', className: `${assigneeWidth} pr-4 pl-4` },
  { label: 'Due Date', className: `${dueWidth} pr-4 pl-4` },
  { label: '', className: `${actionsWidth} rounded-r` },
]

const titleCase = (label: string) => label.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())

function TaskRow({ task, index }: { task: ApiTask; index: number }) {
  const due = dueInfo(task.dueDate)
  const firstTag = task.tags.at(0)
  return (
    <div className="flex">
      <div
        className={`${cellBase} ${nameWidth} gap-2 border-l-4 py-1 pr-4 pl-9 ${toneBorder[due.tone]}`}
      >
        <span className="text-body-m text-neutral-1">{String(index + 1).padStart(2, '0')}</span>
        <span className="min-w-0 flex-1 truncate text-body-m text-neutral-1">{task.name}</span>
      </div>
      <div className={`${cellBase} ${tagsWidth} gap-2 pr-4 pl-2`}>
        {firstTag !== undefined && (
          <span
            className={`rounded px-4 py-1 text-body-m font-semibold whitespace-nowrap ${tagToneClasses[TAG_META[firstTag].tone]}`}
          >
            {TAG_META[firstTag].label}
          </span>
        )}
        {task.tags.length > 1 && (
          <span className="rounded bg-neutral-2/10 px-4 py-1 text-body-m font-semibold text-neutral-1">
            +{task.tags.length - 1}
          </span>
        )}
      </div>
      <div className={`${cellBase} ${estimateWidth} pr-4 pl-2`}>
        <span className="text-body-m text-neutral-1">
          {String(POINTS[task.pointEstimate])} Points
        </span>
      </div>
      <div className={`${cellBase} ${assigneeWidth} gap-2 pr-4 pl-2`}>
        <img
          className="size-8 rounded-full"
          src={avatarSrc(task.assignee?.avatar) ?? avatarUrl}
          alt=""
        />
        <span className="truncate text-body-m text-neutral-1">
          {task.assignee?.fullName ?? 'Unassigned'}
        </span>
      </div>
      <div className={`${cellBase} ${dueWidth} pr-4 pl-2`}>
        <span className={`text-body-m ${toneText[due.tone]}`}>{titleCase(due.label)}</span>
      </div>
      <div className={`${cellBase} ${actionsWidth} justify-center`}>
        <TaskActions task={task} />
      </div>
    </div>
  )
}

export function TaskList({ columns }: { columns: BoardColumn[] }) {
  return (
    <div className="min-h-0 flex-1 overflow-auto">
      <div className="flex min-w-239 flex-col gap-4">
        <div className="flex">
          {HEADERS.map((header, index) => (
            <div
              key={index}
              className={`${cellBase} ${header.className} text-body-m text-neutral-1`}
            >
              {header.label}
            </div>
          ))}
        </div>
        {columns.map((column) => (
          <section key={column.title} className="flex flex-col">
            <div className="flex h-14 items-center gap-2 rounded-t border border-neutral-3 bg-neutral-4 px-4 py-1">
              <CaretDownIcon className="size-6 text-neutral-2" />
              <h2 className="text-body-l font-semibold text-neutral-1">
                {column.title}{' '}
                <span className="text-neutral-2">
                  ({String(column.tasks.length).padStart(2, '0')})
                </span>
              </h2>
            </div>
            {column.tasks.map((task, index) => (
              <TaskRow key={task.id} task={task} index={index} />
            ))}
          </section>
        ))}
      </div>
    </div>
  )
}

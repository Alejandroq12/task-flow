import avatarUrl from '@/assets/avatar.png'
import { AlarmIcon, DotsIcon } from '@/features/tasks/icons'
import {
  avatarSrc,
  dueInfo,
  pointsLabel,
  TAG_META,
  type TagTone,
} from '@/features/tasks/task-display'
import type { ApiTask } from '@/features/tasks/types'

const tagToneClasses: Record<TagTone, string> = {
  secondary: 'bg-secondary-4/10 text-secondary-4',
  tertiary: 'bg-tertiary-4/10 text-tertiary-4',
  neutral: 'bg-neutral-2/10 text-neutral-1',
}

export function TaskCard({ task }: { task: ApiTask }) {
  const due = dueInfo(task.dueDate)
  return (
    <article className="flex flex-col gap-4 rounded-lg bg-neutral-4 p-4">
      <div className="flex h-8 items-center gap-2">
        <h3 className="min-w-0 flex-1 truncate text-body-l font-semibold text-neutral-1">
          {task.name}
        </h3>
        <span role="img" aria-label="Task options" className="shrink-0">
          <DotsIcon className="size-6 text-neutral-1" />
        </span>
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
    </article>
  )
}

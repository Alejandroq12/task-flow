import avatarUrl from '@/assets/avatar.png'
import { AlarmIcon, AttachIcon, ChatIcon, DotsIcon, ForkIcon } from '@/features/tasks/icons'
import type { SampleTask, TagTone } from '@/features/tasks/sample-tasks'

const tagToneClasses: Record<TagTone, string> = {
  secondary: 'bg-secondary-4/10 text-secondary-4',
  tertiary: 'bg-tertiary-4/10 text-tertiary-4',
}

export function TaskCard({ task }: { task: SampleTask }) {
  return (
    <article className="flex flex-col gap-4 rounded-lg bg-neutral-4 p-4">
      <div className="flex h-8 items-center gap-2">
        <h3 className="min-w-0 flex-1 truncate text-body-l font-semibold text-neutral-1">
          {task.name}
        </h3>
        <DotsIcon className="size-6 shrink-0 text-neutral-1" />
      </div>
      <div className="flex items-center justify-between">
        <span className="text-body-m font-semibold text-neutral-1">{task.points} Pts</span>
        <span
          className={`flex items-center gap-2 rounded px-4 py-1 text-body-m font-semibold ${
            task.overdue ? 'bg-primary-4/10 text-primary-4' : 'bg-neutral-2/10 text-neutral-1'
          }`}
        >
          <AlarmIcon className="size-6" />
          {task.dueLabel}
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {task.tags.map(({ label, tone }) => (
          <span
            key={label}
            className={`rounded px-4 py-1 text-body-m font-semibold whitespace-nowrap ${tagToneClasses[tone]}`}
          >
            {label}
          </span>
        ))}
      </div>
      <div className="flex items-center justify-between">
        <img className="size-8 rounded-full" src={avatarUrl} alt="Assignee" />
        <div className="flex items-center gap-4 text-neutral-1">
          <AttachIcon className="size-4" />
          <span className="flex items-center gap-1 text-body-m">
            {task.forks}
            <ForkIcon className="size-4" />
          </span>
          <span className="flex items-center gap-1 text-body-m">
            {task.comments}
            <ChatIcon className="size-4" />
          </span>
        </div>
      </div>
    </article>
  )
}

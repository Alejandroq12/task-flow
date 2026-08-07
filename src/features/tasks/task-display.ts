import type { PointEstimate, Status, TaskTag } from '@/graphql/generated/graphql'
import type { ApiTask, BoardColumn } from '@/features/tasks/types'

type TagTone = 'secondary' | 'tertiary' | 'neutral'

export const STATUS_COLUMNS: { status: Status; title: string }[] = [
  { status: 'BACKLOG', title: 'Backlog' },
  { status: 'TODO', title: 'To Do' },
  { status: 'IN_PROGRESS', title: 'In Progress' },
  { status: 'DONE', title: 'Done' },
  { status: 'CANCELLED', title: 'Cancelled' },
]

export function groupTasksByStatus(tasks: ApiTask[]): BoardColumn[] {
  return STATUS_COLUMNS.map(({ status, title }) => ({
    title,
    tasks: tasks
      .filter((task) => task.status === status)
      .toSorted((a, b) => a.position - b.position || a.createdAt.localeCompare(b.createdAt)),
  }))
}

export const POINTS: Record<PointEstimate, number> = {
  ZERO: 0,
  ONE: 1,
  TWO: 2,
  FOUR: 4,
  EIGHT: 8,
}

export function pointsLabel(estimate: PointEstimate): string {
  return `${String(POINTS[estimate])} Points`
}

export const TAG_META: Record<TaskTag, { label: string; tone: TagTone }> = {
  IOS: { label: 'IOS', tone: 'secondary' },
  ANDROID: { label: 'ANDROID', tone: 'tertiary' },
  REACT: { label: 'REACT', tone: 'secondary' },
  NODE_JS: { label: 'NODE JS', tone: 'tertiary' },
  RAILS: { label: 'RAILS', tone: 'neutral' },
}

export type DueTone = 'primary' | 'tertiary' | 'secondary'

export function dueInfo(dueDate: string): { label: string; overdue: boolean; tone: DueTone } {
  const due = new Date(dueDate)
  const now = new Date()
  const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()
  const dayDiff = Math.round((startOfDay(due) - startOfDay(now)) / 86_400_000)
  const overdue = dayDiff < 0
  const tone: DueTone = overdue ? 'primary' : dayDiff <= 2 ? 'tertiary' : 'secondary'
  if (dayDiff === 0) return { label: 'TODAY', overdue, tone }
  if (dayDiff === -1) return { label: 'YESTERDAY', overdue, tone }
  const month = due.toLocaleString('en-US', { month: 'long' }).toUpperCase()
  return {
    label: `${String(due.getDate())} ${month}, ${String(due.getFullYear())}`,
    overdue,
    tone,
  }
}

export const tagToneClasses: Record<TagTone, string> = {
  secondary: 'bg-secondary-4/10 text-secondary-4',
  tertiary: 'bg-tertiary-4/10 text-tertiary-4',
  neutral: 'bg-neutral-2/10 text-neutral-1',
}

export const dueDateToIso = (day: string) => new Date(`${day}T12:00:00Z`).toISOString()

const LEGACY_DICEBEAR = /^https:\/\/avatars\.dicebear\.com\/api\/([^/]+)\/(.+)\.svg$/

export const avatarSrc = (avatar: string | null | undefined) =>
  avatar?.replace(LEGACY_DICEBEAR, 'https://api.dicebear.com/9.x/$1/svg?seed=$2')

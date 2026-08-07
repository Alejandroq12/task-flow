import type { PointEstimate, Status, TaskTag } from '@/graphql/generated/graphql'
import type { ApiTask, BoardColumn } from '@/features/tasks/types'

export type TagTone = 'secondary' | 'tertiary' | 'neutral'

const STATUS_COLUMNS: { status: Status; title: string }[] = [
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
      .toSorted((a, b) => a.position - b.position),
  }))
}

const POINTS: Record<PointEstimate, number> = {
  ZERO: 0,
  ONE: 1,
  TWO: 2,
  FOUR: 4,
  EIGHT: 8,
}

export function pointsLabel(estimate: PointEstimate): string {
  return `${String(POINTS[estimate])} Pts`
}

export const TAG_META: Record<TaskTag, { label: string; tone: TagTone }> = {
  IOS: { label: 'IOS', tone: 'secondary' },
  ANDROID: { label: 'ANDROID', tone: 'tertiary' },
  REACT: { label: 'REACT', tone: 'secondary' },
  NODE_JS: { label: 'NODE JS', tone: 'tertiary' },
  RAILS: { label: 'RAILS', tone: 'neutral' },
}

export function dueInfo(dueDate: string): { label: string; overdue: boolean } {
  const due = new Date(dueDate)
  const now = new Date()
  const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()
  const dayDiff = Math.round((startOfDay(due) - startOfDay(now)) / 86_400_000)
  if (dayDiff === 0) return { label: 'TODAY', overdue: false }
  if (dayDiff === -1) return { label: 'YESTERDAY', overdue: true }
  const month = due.toLocaleString('en-US', { month: 'long' }).toUpperCase()
  return {
    label: `${String(due.getDate())} ${month}, ${String(due.getFullYear())}`,
    overdue: dayDiff < 0,
  }
}

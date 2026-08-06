export type TagTone = 'secondary' | 'tertiary'

export interface Task {
  id: string
  name: string
  points: number
  dueLabel: string
  overdue?: boolean
  forks: number
  comments: number
  tags: { label: string; tone: TagTone }[]
}

export interface BoardColumn {
  title: string
  tasks: Task[]
}

import type { TasksQuery } from '@/graphql/generated/graphql'

export type ApiTask = TasksQuery['tasks'][number]

export interface BoardColumn {
  title: string
  tasks: ApiTask[]
}

export type BoardLayout = 'grid' | 'list'

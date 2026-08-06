import { vi } from 'vitest'
import { graphqlClient } from '@/lib/graphql-client'
import type { TasksQuery } from '@/graphql/generated/graphql'

function daysFromNow(days: number): string {
  const date = new Date()
  date.setDate(date.getDate() + days)
  return date.toISOString()
}

export const fixtureTasks: TasksQuery['tasks'] = [
  {
    id: 'task-1',
    name: 'Slack',
    dueDate: daysFromNow(0),
    pointEstimate: 'FOUR',
    position: 1,
    status: 'BACKLOG',
    tags: ['IOS', 'ANDROID'],
    assignee: { id: 'user-1', fullName: 'Jane Doe', avatar: null },
  },
  {
    id: 'task-2',
    name: 'Twitter',
    dueDate: daysFromNow(-1),
    pointEstimate: 'EIGHT',
    position: 1,
    status: 'TODO',
    tags: ['REACT'],
    assignee: null,
  },
  {
    id: 'task-3',
    name: 'Samsung',
    dueDate: daysFromNow(5),
    pointEstimate: 'TWO',
    position: 2,
    status: 'IN_PROGRESS',
    tags: ['NODE_JS', 'RAILS'],
    assignee: { id: 'user-2', fullName: 'Sam Lee', avatar: null },
  },
  {
    id: 'task-4',
    name: 'Tesla',
    dueDate: daysFromNow(3),
    pointEstimate: 'ONE',
    position: 1,
    status: 'IN_PROGRESS',
    tags: ['ANDROID'],
    assignee: null,
  },
]

type TasksRequest = () => Promise<TasksQuery>

interface MockedClient {
  request: ReturnType<typeof vi.fn<TasksRequest>>
}

export function tasksRequestMock() {
  return (graphqlClient as unknown as MockedClient).request
}

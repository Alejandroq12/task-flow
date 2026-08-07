import { vi } from 'vitest'
import { graphqlClient } from '@/lib/graphql-client'
import type { ProfileQuery, TasksQuery } from '@/graphql/generated/graphql'

function daysFromNow(days: number): string {
  const date = new Date()
  date.setDate(date.getDate() + days)
  return date.toISOString()
}

export function makeFixtureTasks(): TasksQuery['tasks'] {
  return [
    {
      id: 'task-1',
      name: 'Slack',
      dueDate: daysFromNow(0),
      pointEstimate: 'FOUR',
      position: 1,
      createdAt: '2026-08-01T10:00:00.000Z',
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
      createdAt: '2026-08-02T10:00:00.000Z',
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
      createdAt: '2026-08-03T10:00:00.000Z',
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
      createdAt: '2026-08-04T10:00:00.000Z',
      status: 'IN_PROGRESS',
      tags: ['ANDROID'],
      assignee: null,
    },
  ]
}

export function makeFixtureProfile(): ProfileQuery['profile'] {
  return {
    id: 'user-9',
    fullName: 'Julio Quezada',
    email: 'julio@example.com',
    type: 'CANDIDATE',
    avatar: null,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  }
}

type GraphqlRequest = (document: unknown, variables?: unknown) => Promise<unknown>

interface MockedClient {
  request: ReturnType<typeof vi.fn<GraphqlRequest>>
}

export function tasksRequestMock() {
  return (graphqlClient as unknown as MockedClient).request
}

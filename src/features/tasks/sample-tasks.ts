export type TagTone = 'secondary' | 'tertiary'

export interface SampleTask {
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
  tasks: SampleTask[]
}

const appTags = [
  { label: 'IOS APP', tone: 'secondary' as const },
  { label: 'ANDROID', tone: 'tertiary' as const },
]

export const sampleColumns: BoardColumn[] = [
  {
    title: 'Backlog',
    tasks: [
      {
        id: 'backlog-1',
        name: 'Slack',
        points: 3,
        dueLabel: 'TODAY',
        forks: 5,
        comments: 3,
        tags: appTags,
      },
      {
        id: 'backlog-2',
        name: 'Google',
        points: 3,
        dueLabel: '6 JULY, 2020',
        forks: 5,
        comments: 3,
        tags: appTags,
      },
    ],
  },
  {
    title: 'To Do',
    tasks: [
      {
        id: 'todo-1',
        name: 'Twitter',
        points: 3,
        dueLabel: 'YESTERDAY',
        overdue: true,
        forks: 5,
        comments: 3,
        tags: appTags,
      },
      {
        id: 'todo-2',
        name: 'Maxxis Tyres',
        points: 3,
        dueLabel: '6 JULY, 2020',
        forks: 5,
        comments: 3,
        tags: appTags,
      },
    ],
  },
  {
    title: 'In Progress',
    tasks: [
      {
        id: 'progress-1',
        name: 'Samsung',
        points: 3,
        dueLabel: '6 JULY, 2020',
        forks: 5,
        comments: 3,
        tags: appTags,
      },
      {
        id: 'progress-2',
        name: 'Tesla',
        points: 3,
        dueLabel: 'YESTERDAY',
        overdue: true,
        forks: 5,
        comments: 3,
        tags: appTags,
      },
    ],
  },
  {
    title: 'Done',
    tasks: [
      {
        id: 'done-1',
        name: 'Dashboard Design',
        points: 3,
        dueLabel: 'TODAY',
        forks: 5,
        comments: 3,
        tags: appTags,
      },
    ],
  },
  {
    title: 'Cancelled',
    tasks: [
      {
        id: 'cancelled-1',
        name: 'Micromax Logo Design',
        points: 3,
        dueLabel: '6 JULY, 2020',
        forks: 5,
        comments: 3,
        tags: appTags,
      },
    ],
  },
]

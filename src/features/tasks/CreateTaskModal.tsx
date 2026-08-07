import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import avatarUrl from '@/assets/avatar.png'
import { graphqlClient } from '@/lib/graphql-client'
import { CreateTaskDocument, UsersDocument } from '@/features/tasks/queries'
import { POINTS, TAG_META } from '@/features/tasks/task-display'
import { CalendarIcon, EstimateIcon, LabelIcon } from '@/features/tasks/icons'
import type { CreateTaskInput, PointEstimate, TaskTag } from '@/graphql/generated/graphql'

const ESTIMATES: PointEstimate[] = ['ZERO', 'ONE', 'TWO', 'FOUR', 'EIGHT']
const ALL_TAGS = Object.keys(TAG_META) as TaskTag[]

type MenuName = 'estimate' | 'assignee' | 'label' | null

export function CreateTaskModal({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState('')
  const [estimate, setEstimate] = useState<PointEstimate | null>(null)
  const [assigneeId, setAssigneeId] = useState<string | null>(null)
  const [tags, setTags] = useState<TaskTag[]>([])
  const [dueDate, setDueDate] = useState('')
  const [openMenu, setOpenMenu] = useState<MenuName>(null)
  const queryClient = useQueryClient()

  const users = useQuery({
    queryKey: ['users'],
    queryFn: () => graphqlClient.request(UsersDocument),
  })

  const createTask = useMutation({
    mutationFn: (input: CreateTaskInput) => graphqlClient.request(CreateTaskDocument, { input }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['tasks'] })
      onClose()
    },
  })

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [onClose])

  const selectedAssignee = users.data?.users.find((user) => user.id === assigneeId)
  const canSubmit = name.trim().length > 0 && estimate !== null && dueDate !== ''

  const submit = () => {
    if (!canSubmit || createTask.isPending) return
    createTask.mutate({
      name: name.trim(),
      pointEstimate: estimate,
      dueDate: new Date(`${dueDate}T12:00:00Z`).toISOString(),
      status: 'BACKLOG',
      tags,
      assigneeId,
    })
  }

  const toggleMenu = (menu: MenuName) => {
    setOpenMenu((current) => (current === menu ? null : menu))
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-24 lg:pt-40">
      <button
        type="button"
        aria-label="Close create task"
        onClick={onClose}
        className="absolute inset-0 bg-neutral-5/75"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Create task"
        className="relative flex w-full max-w-143 flex-col gap-6 rounded-lg bg-neutral-3 p-4"
      >
        <input
          autoFocus
          aria-label="Task name"
          placeholder="Task title"
          value={name}
          onChange={(event) => {
            setName(event.target.value)
          }}
          className="w-full bg-transparent text-body-xl font-semibold text-neutral-1 placeholder:text-neutral-2"
        />
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative">
            <button
              type="button"
              aria-haspopup="listbox"
              aria-expanded={openMenu === 'estimate'}
              onClick={() => {
                toggleMenu('estimate')
              }}
              className="flex items-center gap-2 rounded px-4 py-1 text-body-m text-neutral-1"
            >
              <EstimateIcon className="size-6" />
              {estimate === null ? 'Estimate' : `${String(POINTS[estimate])} Points`}
            </button>
            {openMenu === 'estimate' && (
              <div className="absolute top-full left-0 z-10 mt-2 flex w-40 flex-col rounded-lg bg-neutral-3 p-2 shadow-drop-large">
                {ESTIMATES.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => {
                      setEstimate(option)
                      setOpenMenu(null)
                    }}
                    className="rounded px-4 py-1 text-left text-body-m text-neutral-1 hover:bg-neutral-2/10"
                  >
                    {String(POINTS[option])} Points
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="relative">
            <button
              type="button"
              aria-haspopup="listbox"
              aria-expanded={openMenu === 'assignee'}
              onClick={() => {
                toggleMenu('assignee')
              }}
              className="flex items-center gap-2 rounded px-2 py-1 text-body-m text-neutral-1"
            >
              <img
                className="size-8 rounded-full"
                src={selectedAssignee?.avatar ?? avatarUrl}
                alt=""
              />
              {selectedAssignee?.fullName ?? 'Assignee'}
            </button>
            {openMenu === 'assignee' && (
              <div className="absolute top-full left-0 z-10 mt-2 flex max-h-64 w-56 flex-col overflow-y-auto rounded-lg bg-neutral-3 p-2 shadow-drop-large">
                {(users.data?.users ?? []).map((user) => (
                  <button
                    key={user.id}
                    type="button"
                    onClick={() => {
                      setAssigneeId(user.id)
                      setOpenMenu(null)
                    }}
                    className="flex items-center gap-2 rounded px-2 py-1 text-left text-body-m text-neutral-1 hover:bg-neutral-2/10"
                  >
                    <img className="size-8 rounded-full" src={user.avatar ?? avatarUrl} alt="" />
                    {user.fullName}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="relative">
            <button
              type="button"
              aria-haspopup="listbox"
              aria-expanded={openMenu === 'label'}
              onClick={() => {
                toggleMenu('label')
              }}
              className="flex items-center gap-2 rounded bg-neutral-2/10 px-4 py-1 text-body-m font-semibold text-neutral-1"
            >
              <LabelIcon className="size-6" />
              {tags.length === 0 ? 'Label' : `${String(tags.length)} labels`}
            </button>
            {openMenu === 'label' && (
              <div className="absolute top-full left-0 z-10 mt-2 flex w-48 flex-col rounded-lg bg-neutral-3 p-2 shadow-drop-large">
                {ALL_TAGS.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => {
                      setTags((current) =>
                        current.includes(tag)
                          ? current.filter((item) => item !== tag)
                          : [...current, tag],
                      )
                    }}
                    className={`rounded px-4 py-1 text-left text-body-m text-neutral-1 hover:bg-neutral-2/10 ${
                      tags.includes(tag) ? 'bg-neutral-2/10 font-semibold' : ''
                    }`}
                  >
                    {TAG_META[tag].label}
                  </button>
                ))}
              </div>
            )}
          </div>
          <label className="relative flex cursor-pointer items-center gap-2 rounded bg-neutral-2/10 px-4 py-1 text-body-m font-semibold text-neutral-1">
            <CalendarIcon className="size-6" />
            {dueDate === ''
              ? 'Due date'
              : new Date(`${dueDate}T12:00:00Z`).toLocaleDateString('en-US', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
            <input
              type="date"
              aria-label="Due date"
              value={dueDate}
              onChange={(event) => {
                setDueDate(event.target.value)
              }}
              className="absolute inset-0 cursor-pointer opacity-0"
            />
          </label>
        </div>
        {createTask.isError && (
          <div
            role="alert"
            className="w-full rounded bg-primary-4/10 px-4 py-2 text-body-m text-primary-4"
          >
            The task could not be created. Check your connection and try again.
          </div>
        )}
        <div className="flex items-center gap-6 self-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-body-m text-neutral-1"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!canSubmit || createTask.isPending}
            onClick={submit}
            className="rounded-lg bg-primary-4 p-2 text-body-m text-neutral-1 disabled:opacity-50"
          >
            {createTask.isPending ? 'Creating…' : 'Create'}
          </button>
        </div>
      </div>
    </div>
  )
}

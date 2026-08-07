import { useEffect, useRef, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import avatarUrl from '@/assets/avatar.png'
import { graphqlClient } from '@/lib/graphql-client'
import { CreateTaskDocument, UsersDocument } from '@/features/tasks/queries'
import { avatarSrc, POINTS, TAG_META } from '@/features/tasks/task-display'
import { DatePicker, DatePickerDialog } from '@/features/tasks/DatePicker'
import {
  CalendarIcon,
  CheckboxBlankIcon,
  CheckboxCheckedIcon,
  CloseIcon,
  EstimateIcon,
  LabelIcon,
  UserIcon,
} from '@/features/tasks/icons'
import type { CreateTaskInput, PointEstimate, TaskTag } from '@/graphql/generated/graphql'

const ESTIMATES: PointEstimate[] = ['ZERO', 'ONE', 'TWO', 'FOUR', 'EIGHT']
const ALL_TAGS = Object.keys(TAG_META) as TaskTag[]

type MenuName = 'estimate' | 'assignee' | 'label' | 'date' | null

const formatDue = (iso: string) => {
  const date = new Date(`${iso}T12:00:00`)
  const month = date.toLocaleDateString('en-US', { month: 'short' })
  return `${month}. ${String(date.getDate())} ${String(date.getFullYear())}`
}

export function CreateTaskModal({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState('')
  const [estimate, setEstimate] = useState<PointEstimate | null>(null)
  const [assigneeId, setAssigneeId] = useState<string | null>(null)
  const [tags, setTags] = useState<TaskTag[]>([])
  const [dueDate, setDueDate] = useState('')
  const [openMenu, setOpenMenu] = useState<MenuName>(null)
  const [showValidation, setShowValidation] = useState(false)
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

  const containerRef = useRef<HTMLDivElement>(null)
  const isPending = createTask.isPending

  const dismiss = () => {
    if (!isPending) onClose()
  }

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !isPending) onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [onClose, isPending])

  useEffect(() => {
    const previous = document.activeElement
    return () => {
      if (previous instanceof HTMLElement) previous.focus()
    }
  }, [])

  const trapFocus = (event: React.KeyboardEvent) => {
    if (event.key !== 'Tab' || containerRef.current === null) return
    const focusables = [...containerRef.current.querySelectorAll<HTMLElement>('button, input')]
      .filter((el) => el.tabIndex !== -1 && !el.hasAttribute('disabled'))
      .filter((el) => el.getClientRects().length > 0)
    const first = focusables.at(0)
    const last = focusables.at(-1)
    if (first === undefined || last === undefined) return
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first.focus()
    }
  }

  const selectedAssignee = users.data?.users.find((user) => user.id === assigneeId)
  const canSubmit = name.trim().length > 0 && estimate !== null && dueDate !== ''

  const submit = () => {
    if (createTask.isPending) return
    if (!canSubmit) {
      setShowValidation(true)
      return
    }
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

  const toggleTag = (tag: TaskTag) => {
    setTags((current) =>
      current.includes(tag) ? current.filter((item) => item !== tag) : [...current, tag],
    )
  }

  return (
    <div
      ref={containerRef}
      onKeyDown={trapFocus}
      className="fixed inset-0 z-50 lg:flex lg:items-start lg:justify-center lg:p-4 lg:pt-40"
    >
      <button
        type="button"
        aria-label="Close create task"
        onClick={dismiss}
        className="absolute inset-0 hidden bg-neutral-5/75 lg:block"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Create task"
        className="relative flex h-full w-full flex-col gap-6 overflow-y-auto bg-neutral-5 p-4 lg:h-auto lg:max-w-148 lg:overflow-visible lg:rounded-lg lg:bg-neutral-3"
      >
        {openMenu !== null && (
          <button
            type="button"
            aria-label="Close menu"
            tabIndex={-1}
            onClick={() => {
              setOpenMenu(null)
            }}
            className="fixed inset-0 z-0 cursor-default"
          />
        )}
        <div className="flex items-center justify-between lg:hidden">
          <button
            type="button"
            aria-label="Close create task"
            onClick={dismiss}
            className="flex size-10 items-center justify-center text-neutral-2"
          >
            <CloseIcon className="size-6" />
          </button>
          <button
            type="button"
            disabled={name.trim().length === 0 || createTask.isPending}
            onClick={submit}
            className="rounded-lg p-2 text-body-m text-neutral-1 disabled:text-neutral-2"
          >
            {createTask.isPending ? 'Creating…' : 'Create'}
          </button>
        </div>
        <input
          autoFocus
          aria-label="Task name"
          placeholder="Task Title"
          value={name}
          onChange={(event) => {
            setName(event.target.value)
          }}
          className="w-full bg-transparent text-body-xl font-semibold text-neutral-1 placeholder:text-neutral-2"
        />
        <div className="flex flex-col items-stretch gap-4 lg:flex-row lg:flex-wrap lg:items-center">
          <div className="relative order-1 lg:order-1">
            <button
              type="button"
              aria-haspopup="listbox"
              aria-expanded={openMenu === 'estimate'}
              onClick={() => {
                toggleMenu('estimate')
              }}
              className={`flex w-full items-center gap-2 rounded px-4 py-1 text-body-m text-neutral-1 lg:w-auto ${
                estimate === null ? 'bg-neutral-2/10 font-semibold' : ''
              }`}
            >
              <EstimateIcon className="size-6" />
              {estimate === null ? 'Estimate' : `${String(POINTS[estimate])} Points`}
            </button>
            {openMenu === 'estimate' && (
              <div className="absolute top-full left-0 z-10 mt-2 flex w-max min-w-31 flex-col rounded-lg border border-neutral-2 bg-neutral-3 py-2 shadow-drop-large">
                <span className="flex h-8 items-center px-4 text-body-xl font-semibold text-neutral-2">
                  Estimate
                </span>
                {ESTIMATES.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => {
                      setEstimate(option)
                      setOpenMenu(null)
                    }}
                    className="flex items-center gap-2 px-4 py-1 text-left text-body-m text-neutral-1 hover:bg-neutral-2/10"
                  >
                    <EstimateIcon className="size-6" />
                    {String(POINTS[option])} Points
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="relative order-2 lg:order-3">
            <button
              type="button"
              aria-haspopup="listbox"
              aria-expanded={openMenu === 'label'}
              onClick={() => {
                toggleMenu('label')
              }}
              className={
                tags.length === 0
                  ? 'flex w-full items-center gap-2 rounded bg-neutral-2/10 px-4 py-1 text-body-m font-semibold text-neutral-1 lg:w-auto'
                  : 'flex w-full flex-wrap items-center gap-4 lg:w-auto'
              }
            >
              {tags.length === 0 ? (
                <>
                  <LabelIcon className="size-6" />
                  Label
                </>
              ) : (
                tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded bg-neutral-2/10 px-4 py-1 text-body-m font-semibold text-neutral-1"
                  >
                    {TAG_META[tag].label}
                  </span>
                ))
              )}
            </button>
            {openMenu === 'label' && (
              <div className="absolute top-full left-0 z-10 mt-2 flex w-max min-w-48 flex-col rounded-lg border border-neutral-2 bg-neutral-3 py-2 shadow-drop-large">
                <span className="flex h-8 items-center px-4 text-body-xl font-semibold text-neutral-2">
                  Tag Title
                </span>
                {ALL_TAGS.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    aria-pressed={tags.includes(tag)}
                    onClick={() => {
                      toggleTag(tag)
                    }}
                    className="flex w-full items-center gap-2 px-4 py-1 text-left text-body-m text-neutral-1 hover:bg-neutral-2/10"
                  >
                    {tags.includes(tag) ? (
                      <CheckboxCheckedIcon className="size-6" />
                    ) : (
                      <CheckboxBlankIcon className="size-6" />
                    )}
                    {TAG_META[tag].label}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="relative order-3 lg:order-2">
            <button
              type="button"
              aria-haspopup="listbox"
              aria-expanded={openMenu === 'assignee'}
              onClick={() => {
                toggleMenu('assignee')
              }}
              className={`flex w-full items-center gap-2 rounded px-4 py-1 text-body-m text-neutral-1 lg:w-auto ${
                selectedAssignee === undefined ? 'bg-neutral-2/10 font-semibold' : ''
              }`}
            >
              {selectedAssignee === undefined ? (
                <>
                  <UserIcon className="size-6" />
                  Assignee
                </>
              ) : (
                <>
                  <img
                    className="size-8 rounded-full"
                    src={avatarSrc(selectedAssignee.avatar) ?? avatarUrl}
                    alt=""
                  />
                  {selectedAssignee.fullName}
                </>
              )}
            </button>
            {openMenu === 'assignee' && (
              <div className="absolute top-full left-0 z-10 mt-2 flex max-h-80 w-60 flex-col overflow-y-auto rounded-lg border border-neutral-2 bg-neutral-3 py-2 shadow-drop-large">
                <span className="flex h-8 items-center px-4 text-body-xl font-semibold text-neutral-2">
                  Assign To...
                </span>
                {(users.data?.users ?? []).map((user) => (
                  <button
                    key={user.id}
                    type="button"
                    onClick={() => {
                      setAssigneeId(user.id)
                      setOpenMenu(null)
                    }}
                    className="flex h-14 w-full items-center gap-2 px-4 py-1 text-left text-body-m text-neutral-1 hover:bg-neutral-2/10"
                  >
                    <img
                      className="size-8 rounded-full"
                      src={avatarSrc(user.avatar) ?? avatarUrl}
                      alt=""
                    />
                    {user.fullName}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="relative order-4 lg:order-4">
            <button
              type="button"
              aria-haspopup="dialog"
              aria-expanded={openMenu === 'date'}
              onClick={() => {
                toggleMenu('date')
              }}
              className="flex w-full items-center gap-2 rounded bg-neutral-2/10 px-4 py-1 text-body-m font-semibold text-neutral-1 lg:w-auto"
            >
              <CalendarIcon className="size-6" />
              {dueDate === '' ? 'Due Date' : formatDue(dueDate)}
            </button>
            {openMenu === 'date' && (
              <>
                <div className="absolute top-full left-0 z-10 mt-2 hidden lg:block">
                  <DatePicker
                    value={dueDate}
                    onSelect={(iso) => {
                      setDueDate(iso)
                      setOpenMenu(null)
                    }}
                  />
                </div>
                <div className="fixed inset-x-0 top-1/2 z-10 flex -translate-y-1/2 justify-center px-4 lg:hidden">
                  <DatePickerDialog
                    value={dueDate}
                    onCancel={() => {
                      setOpenMenu(null)
                    }}
                    onConfirm={(iso) => {
                      setDueDate(iso)
                      setOpenMenu(null)
                    }}
                  />
                </div>
              </>
            )}
          </div>
        </div>
        {(createTask.isError || (showValidation && !canSubmit)) && (
          <div
            role="alert"
            className="w-full rounded bg-primary-4/10 px-4 py-2 text-body-m text-primary-4"
          >
            {canSubmit
              ? 'The task could not be created. Check your connection and try again.'
              : 'An estimate and a due date are required to create the task.'}
          </div>
        )}
        <div className="hidden items-center gap-6 self-end lg:flex">
          <button
            type="button"
            onClick={dismiss}
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

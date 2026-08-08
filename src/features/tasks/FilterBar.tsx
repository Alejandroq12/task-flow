import { useState } from 'react'
import { useSearchParams } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import avatarUrl from '@/assets/avatar.png'
import { avatarSrc } from '@/lib/avatar'
import { graphqlClient } from '@/lib/graphql-client'
import { UsersDocument } from '@/features/tasks/queries'
import { MenuPanel } from '@/features/tasks/MenuPanel'
import { DatePicker, DatePickerDialog } from '@/features/tasks/DatePicker'
import { POINTS, STATUS_COLUMNS, TAG_META } from '@/features/tasks/task-display'
import { FILTER_PARAM_KEYS, hasActiveFilters, parseDueParam } from '@/features/tasks/filter-params'
import type { PointEstimate, TaskTag } from '@/graphql/generated/graphql'

const ESTIMATES = Object.keys(POINTS) as PointEstimate[]
const ALL_TAGS = Object.keys(TAG_META) as TaskTag[]

type MenuName = 'status' | 'estimate' | 'tags' | 'due' | 'owner' | null

const chipClasses = (active: boolean) =>
  `flex items-center gap-2 rounded px-4 py-1 text-body-m whitespace-nowrap ${
    active ? 'bg-neutral-2/10 font-semibold text-neutral-1' : 'text-neutral-2'
  }`

const formatDay = (day: string) => {
  const date = new Date(`${day}T12:00:00`)
  const month = date.toLocaleDateString('en-US', { month: 'short' })
  return `${month}. ${String(date.getDate())} ${String(date.getFullYear())}`
}

export function FilterBar() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [openMenu, setOpenMenu] = useState<MenuName>(null)

  const users = useQuery({
    queryKey: ['users'],
    queryFn: () => graphqlClient.request(UsersDocument),
  })

  const setParam = (key: string, value: string | null) => {
    setSearchParams(
      (current) => {
        const next = new URLSearchParams(current)
        if (value === null || value === '') next.delete(key)
        else next.set(key, value)
        return next
      },
      { replace: true },
    )
    setOpenMenu(null)
  }

  const toggleMenu = (menu: MenuName) => {
    setOpenMenu((current) => (current === menu ? null : menu))
  }

  const status = searchParams.get('status')
  const estimate = searchParams.get('estimate')
  const selectedTags = (searchParams.get('tags')?.split(',') ?? []).filter((tag): tag is TaskTag =>
    ALL_TAGS.includes(tag as TaskTag),
  )
  const due = parseDueParam(searchParams)
  const owner = searchParams.get('owner')
  const ownerName = users.data?.users.find((user) => user.id === owner)?.fullName

  const toggleTag = (tag: TaskTag) => {
    const next = selectedTags.includes(tag)
      ? selectedTags.filter((item) => item !== tag)
      : [...selectedTags, tag]
    setSearchParams(
      (current) => {
        const params = new URLSearchParams(current)
        if (next.length === 0) params.delete('tags')
        else params.set('tags', next.join(','))
        return params
      },
      { replace: true },
    )
  }

  const clearAll = () => {
    setSearchParams(
      (current) => {
        const next = new URLSearchParams(current)
        for (const key of FILTER_PARAM_KEYS) next.delete(key)
        return next
      },
      { replace: true },
    )
    setOpenMenu(null)
  }

  return (
    <div
      className="flex flex-wrap items-center gap-2"
      onKeyDown={(event) => {
        if (event.key === 'Escape') setOpenMenu(null)
      }}
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
      <div className="relative">
        <button
          type="button"
          aria-haspopup="listbox"
          aria-expanded={openMenu === 'status'}
          onClick={() => {
            toggleMenu('status')
          }}
          className={chipClasses(status !== null)}
        >
          {STATUS_COLUMNS.find((column) => column.status === status)?.title ?? 'Status'}
        </button>
        {openMenu === 'status' && (
          <MenuPanel title="Status" className="w-max min-w-40">
            {STATUS_COLUMNS.map((column) => (
              <button
                key={column.status}
                type="button"
                onClick={() => {
                  setParam('status', column.status === status ? null : column.status)
                }}
                className="flex w-full items-center gap-2 px-4 py-1 text-left text-body-m text-neutral-1 hover:bg-neutral-2/10"
              >
                {column.title}
              </button>
            ))}
          </MenuPanel>
        )}
      </div>
      <div className="relative">
        <button
          type="button"
          aria-haspopup="listbox"
          aria-expanded={openMenu === 'estimate'}
          onClick={() => {
            toggleMenu('estimate')
          }}
          className={chipClasses(estimate !== null)}
        >
          {estimate !== null && estimate in POINTS
            ? `${String(POINTS[estimate as PointEstimate])} Points`
            : 'Estimate'}
        </button>
        {openMenu === 'estimate' && (
          <MenuPanel title="Estimate" className="w-max min-w-31">
            {ESTIMATES.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => {
                  setParam('estimate', option === estimate ? null : option)
                }}
                className="flex w-full items-center gap-2 px-4 py-1 text-left text-body-m text-neutral-1 hover:bg-neutral-2/10"
              >
                {String(POINTS[option])} Points
              </button>
            ))}
          </MenuPanel>
        )}
      </div>
      <div className="relative">
        <button
          type="button"
          aria-haspopup="listbox"
          aria-expanded={openMenu === 'tags'}
          onClick={() => {
            toggleMenu('tags')
          }}
          className={chipClasses(selectedTags.length > 0)}
        >
          {selectedTags.length > 0
            ? selectedTags.map((tag) => TAG_META[tag].label).join(', ')
            : 'Tags'}
        </button>
        {openMenu === 'tags' && (
          <MenuPanel title="Tags" className="w-max min-w-40">
            {ALL_TAGS.map((tag) => (
              <button
                key={tag}
                type="button"
                aria-pressed={selectedTags.includes(tag)}
                onClick={() => {
                  toggleTag(tag)
                }}
                className={`flex w-full items-center gap-2 px-4 py-1 text-left text-body-m hover:bg-neutral-2/10 ${
                  selectedTags.includes(tag) ? 'font-semibold text-neutral-1' : 'text-neutral-1'
                }`}
              >
                {TAG_META[tag].label}
              </button>
            ))}
          </MenuPanel>
        )}
      </div>
      <div className="relative">
        <button
          type="button"
          aria-haspopup="dialog"
          aria-expanded={openMenu === 'due'}
          onClick={() => {
            toggleMenu('due')
          }}
          className={chipClasses(due !== null)}
        >
          {due !== null ? formatDay(due) : 'Due date'}
        </button>
        {openMenu === 'due' && (
          <>
            <div className="absolute top-full left-0 z-10 mt-2 hidden lg:block">
              <DatePicker
                value={due ?? ''}
                onSelect={(iso) => {
                  setParam('due', iso === due ? null : iso)
                }}
              />
            </div>
            <div className="fixed inset-x-0 top-1/2 z-10 flex -translate-y-1/2 justify-center px-4 lg:hidden">
              <DatePickerDialog
                value={due ?? ''}
                onCancel={() => {
                  setOpenMenu(null)
                }}
                onConfirm={(iso) => {
                  setParam('due', iso)
                }}
              />
            </div>
          </>
        )}
      </div>
      <div className="relative">
        <button
          type="button"
          aria-haspopup="listbox"
          aria-expanded={openMenu === 'owner'}
          onClick={() => {
            toggleMenu('owner')
          }}
          className={chipClasses(owner !== null)}
        >
          {ownerName ?? (owner !== null ? 'Owner' : 'Owner')}
        </button>
        {openMenu === 'owner' && (
          <MenuPanel title="Owner" className="max-h-80 w-60 overflow-y-auto">
            {users.isPending && (
              <p className="px-4 py-2 text-body-m text-neutral-2">Loading users…</p>
            )}
            {users.isError && (
              <p className="px-4 py-2 text-body-m text-primary-4">Could not load users.</p>
            )}
            {(users.data?.users ?? []).map((user) => (
              <button
                key={user.id}
                type="button"
                onClick={() => {
                  setParam('owner', user.id === owner ? null : user.id)
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
          </MenuPanel>
        )}
      </div>
      {hasActiveFilters(searchParams) && (
        <button
          type="button"
          onClick={clearAll}
          className="rounded px-4 py-1 text-body-m text-primary-3"
        >
          Clear filters
        </button>
      )}
    </div>
  )
}

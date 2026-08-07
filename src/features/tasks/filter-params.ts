import { dueDateToIso, POINTS, STATUS_COLUMNS, TAG_META } from '@/features/tasks/task-display'
import type { FilterTaskInput, PointEstimate, Status, TaskTag } from '@/graphql/generated/graphql'

export const FILTER_PARAM_KEYS = ['q', 'status', 'estimate', 'tags', 'due', 'owner'] as const

const STATUSES = new Set<string>(STATUS_COLUMNS.map((column) => column.status))
const ESTIMATES = new Set<string>(Object.keys(POINTS))
const TAGS = new Set<string>(Object.keys(TAG_META))
const DAY_PATTERN = /^\d{4}-\d{2}-\d{2}$/

export function filterInputFromParams(params: URLSearchParams): FilterTaskInput {
  const input: FilterTaskInput = {}
  const q = params.get('q')
  if (q !== null && q.trim() !== '') input.name = q.trim()
  const status = params.get('status')
  if (status !== null && STATUSES.has(status)) input.status = status as Status
  const estimate = params.get('estimate')
  if (estimate !== null && ESTIMATES.has(estimate)) input.pointEstimate = estimate as PointEstimate
  const tags = params
    .get('tags')
    ?.split(',')
    .filter((tag) => TAGS.has(tag)) as TaskTag[] | undefined
  if (tags !== undefined && tags.length > 0) input.tags = tags
  const due = params.get('due')
  if (due !== null && DAY_PATTERN.test(due)) input.dueDate = dueDateToIso(due)
  const owner = params.get('owner')
  if (owner !== null && owner !== '') input.ownerId = owner
  return input
}

export function hasActiveFilters(params: URLSearchParams): boolean {
  return FILTER_PARAM_KEYS.some((key) => {
    const value = params.get(key)
    return value !== null && value !== ''
  })
}

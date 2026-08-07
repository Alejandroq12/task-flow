import { useState } from 'react'
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  ChevronThinRightIcon,
} from '@/features/tasks/icons'

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

const toIso = (date: Date) =>
  `${String(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
    date.getDate(),
  ).padStart(2, '0')}`

const dayTone = (selected: boolean, isToday: boolean, inMonth: boolean) => {
  if (selected) return 'bg-primary-4 text-neutral-1'
  if (isToday) return 'border border-primary-4 text-neutral-1'
  return inMonth ? 'text-neutral-1' : 'text-neutral-2'
}

interface DatePickerProps {
  value: string
  onSelect: (iso: string) => void
}

export function DatePicker({ value, onSelect }: DatePickerProps) {
  const today = new Date()
  const initial = value === '' ? today : new Date(`${value}T12:00:00`)
  const [viewYear, setViewYear] = useState(initial.getFullYear())
  const [viewMonth, setViewMonth] = useState(initial.getMonth())

  const moveView = (deltaMonths: number) => {
    const next = new Date(viewYear, viewMonth + deltaMonths, 1)
    setViewYear(next.getFullYear())
    setViewMonth(next.getMonth())
  }

  const monthLabel = new Date(viewYear, viewMonth, 1).toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  })
  const firstWeekday = new Date(viewYear, viewMonth, 1).getDay()
  const cells = Array.from({ length: 42 }, (_, index) => {
    return new Date(viewYear, viewMonth, index + 1 - firstWeekday)
  })
  const todayIso = toIso(today)

  return (
    <div
      role="group"
      aria-label="Choose due date"
      className="flex w-70 flex-col rounded border border-neutral-2 bg-neutral-5 shadow-depth-4"
    >
      <div className="flex w-full items-center justify-between px-2 py-2.25">
        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label="Previous year"
            onClick={() => {
              moveView(-12)
            }}
            className="flex size-4 items-center justify-center text-neutral-1"
          >
            <ChevronsLeftIcon className="size-4" />
          </button>
          <button
            type="button"
            aria-label="Previous month"
            onClick={() => {
              moveView(-1)
            }}
            className="flex size-4 items-center justify-center text-neutral-1"
          >
            <ChevronLeftIcon className="size-4" />
          </button>
        </div>
        <span className="text-picker font-semibold text-neutral-1">{monthLabel}</span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label="Next month"
            onClick={() => {
              moveView(1)
            }}
            className="flex size-4 items-center justify-center text-neutral-1"
          >
            <ChevronRightIcon className="size-4" />
          </button>
          <button
            type="button"
            aria-label="Next year"
            onClick={() => {
              moveView(12)
            }}
            className="flex size-4 items-center justify-center text-neutral-1"
          >
            <ChevronsRightIcon className="size-4" />
          </button>
        </div>
      </div>
      <div className="h-px w-full bg-neutral-2" />
      <div className="flex w-full flex-col px-3 py-2">
        <div className="flex w-full">
          {WEEKDAYS.map((weekday) => (
            <div key={weekday} className="flex flex-1 justify-center px-1.5 py-0.75">
              <span className="w-6 text-center text-picker text-neutral-1">{weekday}</span>
            </div>
          ))}
        </div>
        {Array.from({ length: 6 }, (_, row) => (
          <div key={row} className="flex w-full">
            {cells.slice(row * 7, row * 7 + 7).map((day) => {
              const iso = toIso(day)
              return (
                <div key={iso} className="flex flex-1 justify-center px-1.5 py-0.75">
                  <button
                    type="button"
                    aria-label={day.toDateString()}
                    onClick={() => {
                      onSelect(iso)
                    }}
                    className={`w-6 rounded-xs py-px text-center text-picker ${dayTone(
                      iso === value,
                      iso === todayIso,
                      day.getMonth() === viewMonth,
                    )}`}
                  >
                    {day.getDate()}
                  </button>
                </div>
              )
            })}
          </div>
        ))}
      </div>
      <div className="h-px w-full bg-neutral-2" />
      <div className="flex w-full justify-center py-2.25">
        <button
          type="button"
          onClick={() => {
            onSelect(todayIso)
          }}
          className="text-picker text-primary-4"
        >
          Today
        </button>
      </div>
    </div>
  )
}

const DIALOG_WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

const dialogDayTone = (selected: boolean, isToday: boolean) => {
  if (selected) return 'bg-primary-4'
  if (isToday) return 'border-2 border-primary-3'
  return ''
}

interface DatePickerDialogProps {
  value: string
  onCancel: () => void
  onConfirm: (iso: string) => void
}

export function DatePickerDialog({ value, onCancel, onConfirm }: DatePickerDialogProps) {
  const today = new Date()
  const initial = value === '' ? today : new Date(`${value}T12:00:00`)
  const [pending, setPending] = useState(toIso(initial))
  const [viewYear, setViewYear] = useState(initial.getFullYear())
  const [viewMonth, setViewMonth] = useState(initial.getMonth())

  const moveView = (deltaMonths: number) => {
    const next = new Date(viewYear, viewMonth + deltaMonths, 1)
    setViewYear(next.getFullYear())
    setViewMonth(next.getMonth())
  }

  const pendingDate = new Date(`${pending}T12:00:00`)
  const headline = pendingDate.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
  const monthLabel = new Date(viewYear, viewMonth, 1).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  })
  const firstWeekday = new Date(viewYear, viewMonth, 1).getDay()
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
  const rowCount = Math.ceil((firstWeekday + daysInMonth) / 7)
  const todayIso = toIso(today)

  return (
    <div
      role="group"
      aria-label="Choose due date"
      className="flex w-80 flex-col border border-neutral-2 bg-neutral-5"
    >
      <div className="flex w-full flex-col bg-primary-4 px-8 py-4">
        <span className="text-body-s leading-6 font-bold text-primary-1">
          {pendingDate.getFullYear()}
        </span>
        <span className="text-date-display font-bold text-neutral-1">{headline}</span>
      </div>
      <div className="flex w-full flex-col items-center p-6">
        <div className="flex w-full items-center">
          <button
            type="button"
            aria-label="Previous month"
            onClick={() => {
              moveView(-1)
            }}
            className="flex size-10 items-center justify-center text-neutral-1"
          >
            <ChevronThinRightIcon className="size-6 rotate-180" />
          </button>
          <span className="flex-1 px-3 py-2 text-center text-body-s leading-6 font-bold text-neutral-2">
            {monthLabel}
          </span>
          <button
            type="button"
            aria-label="Next month"
            onClick={() => {
              moveView(1)
            }}
            className="flex size-10 items-center justify-center text-neutral-1"
          >
            <ChevronThinRightIcon className="size-6" />
          </button>
        </div>
        <div className="flex w-full">
          {DIALOG_WEEKDAYS.map((letter, index) => (
            <span
              key={`${letter}-${String(index)}`}
              className="flex h-10 flex-1 items-center justify-center text-body-s leading-6 font-bold text-neutral-2"
            >
              {letter}
            </span>
          ))}
        </div>
        {Array.from({ length: rowCount }, (_, row) => (
          <div key={row} className="flex w-full">
            {Array.from({ length: 7 }, (_, column) => {
              const dayNumber = row * 7 + column + 1 - firstWeekday
              if (dayNumber < 1 || dayNumber > daysInMonth) {
                return <span key={column} className="h-10 flex-1" />
              }
              const iso = toIso(new Date(viewYear, viewMonth, dayNumber))
              return (
                <button
                  key={column}
                  type="button"
                  aria-label={new Date(viewYear, viewMonth, dayNumber).toDateString()}
                  onClick={() => {
                    setPending(iso)
                  }}
                  className={`flex h-10 flex-1 items-center justify-center rounded text-body-s leading-6 font-bold text-neutral-1 ${dialogDayTone(
                    iso === pending,
                    iso === todayIso,
                  )}`}
                >
                  {dayNumber}
                </button>
              )
            })}
          </div>
        ))}
        <div className="flex w-full items-center justify-end gap-2.5 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg p-2 text-body-m text-neutral-1"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm(pending)
            }}
            className="rounded-lg bg-primary-4 p-2 text-body-m text-neutral-1"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  )
}

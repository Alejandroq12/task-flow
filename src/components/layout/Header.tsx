import { useEffect, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import avatarUrl from '@/assets/avatar.png'
import { SearchIcon } from '@/components/ui/icons'
import { NotificationsBell } from '@/components/layout/NotificationsBell'

interface HeaderProps {
  sidebarOpen: boolean
  onOpenSidebar: () => void
}

export function Header({ sidebarOpen, onOpenSidebar }: HeaderProps) {
  const [searchParams, setSearchParams] = useSearchParams()
  const urlQuery = searchParams.get('q') ?? ''
  const [query, setQuery] = useState(urlQuery)
  const lastPushed = useRef(urlQuery)

  useEffect(() => {
    if (urlQuery !== lastPushed.current) {
      lastPushed.current = urlQuery
      setQuery(urlQuery)
    }
  }, [urlQuery])

  useEffect(() => {
    const trimmed = query.trim()
    if (trimmed === urlQuery) return
    const handle = setTimeout(() => {
      lastPushed.current = trimmed
      setSearchParams(
        (current) => {
          const next = new URLSearchParams(current)
          if (trimmed === '') next.delete('q')
          else next.set('q', trimmed)
          return next
        },
        { replace: true },
      )
    }, 300)
    return () => {
      clearTimeout(handle)
    }
  }, [query, urlQuery, setSearchParams])
  return (
    <header className="flex items-center gap-3 bg-neutral-4 px-6 py-4 lg:gap-6 lg:rounded-2xl lg:py-3">
      <button
        type="button"
        aria-label="Open navigation"
        aria-expanded={sidebarOpen}
        aria-controls="app-sidebar"
        onClick={onOpenSidebar}
        className="shrink-0 rounded-full lg:hidden"
      >
        <img className="size-8 rounded-full" src={avatarUrl} alt="" />
      </button>
      <SearchIcon className="hidden size-6 shrink-0 text-neutral-2 lg:block" />
      <input
        type="text"
        aria-label="Search"
        placeholder="Search"
        value={query}
        onChange={(event) => {
          setQuery(event.target.value)
        }}
        className="hidden min-w-0 flex-1 bg-transparent text-body-m text-neutral-1 placeholder:text-neutral-2 lg:block"
      />
      <div className="ml-auto flex items-center gap-3 lg:hidden">
        <SearchIcon className="size-6 text-neutral-2" />
        <NotificationsBell />
      </div>
      <div className="hidden shrink-0 items-center gap-6 lg:flex">
        <NotificationsBell />
        <Link to="/settings" aria-label="Settings" className="rounded-full">
          <img className="size-10 rounded-full" src={avatarUrl} alt="" />
        </Link>
      </div>
    </header>
  )
}

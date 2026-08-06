import { useState } from 'react'
import avatarUrl from '@/assets/avatar.png'
import { BellIcon, SearchIcon } from '@/components/ui/icons'

interface HeaderProps {
  sidebarOpen: boolean
  onOpenSidebar: () => void
}

export function Header({ sidebarOpen, onOpenSidebar }: HeaderProps) {
  const [query, setQuery] = useState('')
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
        <BellIcon className="size-6 text-neutral-2" />
      </div>
      <div className="hidden shrink-0 items-center gap-6 lg:flex">
        <BellIcon className="size-6 text-neutral-2" />
        <img className="size-10 rounded-full" src={avatarUrl} alt="Profile" />
      </div>
    </header>
  )
}

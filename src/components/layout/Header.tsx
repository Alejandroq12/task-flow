import { useState } from 'react'
import avatarUrl from '@/assets/avatar.png'

interface IconProps {
  className?: string
}

function SearchIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        transform="translate(2 2)"
        d="M16.031 14.617L20.314 18.899L18.899 20.314L14.617 16.031C13.0237 17.3082 11.042 18.0029 9 18C4.032 18 0 13.968 0 9C0 4.032 4.032 0 9 0C13.968 0 18 4.032 18 9C18.0029 11.042 17.3082 13.0237 16.031 14.617ZM14.025 13.875C15.2941 12.5699 16.0029 10.8204 16 9C16 5.132 12.867 2 9 2C5.132 2 2 5.132 2 9C2 12.867 5.132 16 9 16C10.8204 16.0029 12.5699 15.2941 13.875 14.025L14.025 13.875Z"
        fill="currentColor"
      />
    </svg>
  )
}

function BellIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        transform="translate(2 2)"
        d="M18 15H20V17H0V15H2V8C2 5.87827 2.84285 3.84344 4.34315 2.34315C5.84344 0.842855 7.87827 0 10 0C12.1217 0 14.1566 0.842855 15.6569 2.34315C17.1571 3.84344 18 5.87827 18 8V15ZM16 15V8C16 6.4087 15.3679 4.88258 14.2426 3.75736C13.1174 2.63214 11.5913 2 10 2C8.4087 2 6.88258 2.63214 5.75736 3.75736C4.63214 4.88258 4 6.4087 4 8V15H16ZM7 19H13V21H7V19Z"
        fill="currentColor"
      />
    </svg>
  )
}

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

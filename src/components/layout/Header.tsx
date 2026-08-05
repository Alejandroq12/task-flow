interface HeaderProps {
  sidebarOpen: boolean
  onOpenSidebar: () => void
}

export function Header({ sidebarOpen, onOpenSidebar }: HeaderProps) {
  return (
    <header className="flex items-center gap-4 px-6 py-4 lg:px-0">
      <button
        type="button"
        aria-label="Open navigation"
        aria-expanded={sidebarOpen}
        aria-controls="app-sidebar"
        onClick={onOpenSidebar}
        className="flex size-11 items-center justify-center rounded-lg text-2xl text-neutral-1 hover:bg-neutral-3 lg:hidden"
      >
        ☰
      </button>
      <span>Header</span>
    </header>
  )
}

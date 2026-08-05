import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'
import { Sidebar } from '@/components/layout/Sidebar'
import { Header } from '@/components/layout/Header'

export function Layout() {
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    if (!sidebarOpen) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSidebarOpen(false)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [sidebarOpen])

  return (
    <div className="flex h-dvh overflow-hidden lg:p-12">
      <Sidebar
        open={sidebarOpen}
        onClose={() => {
          setSidebarOpen(false)
        }}
      />
      <div className="flex h-full flex-1 flex-col overflow-hidden">
        <Header
          sidebarOpen={sidebarOpen}
          onOpenSidebar={() => {
            setSidebarOpen(true)
          }}
        />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <ErrorBoundary key={location.pathname}>
            <Outlet />
          </ErrorBoundary>
        </main>
      </div>
    </div>
  )
}

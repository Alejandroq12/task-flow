import { Outlet, useLocation } from 'react-router'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'
import { Sidebar } from '@/components/layout/Sidebar'
import { Header } from '@/components/layout/Header'

export function Layout() {
  const location = useLocation()
  return (
    <div className="flex h-screen overflow-hidden p-12">
      <Sidebar />
      <div className="flex h-full flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <ErrorBoundary key={location.pathname}>
            <Outlet />
          </ErrorBoundary>
        </main>
      </div>
    </div>
  )
}

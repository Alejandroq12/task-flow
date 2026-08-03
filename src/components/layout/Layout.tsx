import { Outlet, useLocation } from 'react-router'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'

export function Layout() {
  const location = useLocation()
  return (
    <div>
      <header>Hello</header>

      <main>
        {/* Keyed by pathname: a page render error resets on navigation, while the
            shell (sidebar/header) survives to provide the recovery path. */}
        <ErrorBoundary key={location.pathname}>
          <Outlet />
        </ErrorBoundary>
      </main>
    </div>
  )
}

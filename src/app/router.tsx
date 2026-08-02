import { createBrowserRouter } from 'react-router'
import { Layout } from '../components/layout/Layout'
import { Dashboard } from '../features/tasks/Dashboard'
import { Settings } from '../features/settings/Settings'
import { NotFound } from '../components/ui/NotFound'
import { RouteError } from '../components/ui/RouteError'
import { ErrorBoundary } from '../components/ui/ErrorBoundary'

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <ErrorBoundary>
        <Layout />
      </ErrorBoundary>
    ),    errorElement: <RouteError />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'settings', element: <Settings /> },
      { path: '*', element: <NotFound /> },
    ],
  },
])
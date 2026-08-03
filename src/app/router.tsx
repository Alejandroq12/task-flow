import { createBrowserRouter, type RouteObject } from 'react-router'
import { Layout } from '@/components/layout/Layout'
import { Dashboard } from '@/features/tasks/Dashboard'
import { Settings } from '@/features/settings/Settings'
import { NotFound } from '@/app/NotFound'
import { RouteError } from '@/app/RouteError'

// Exported separately so tests can mount the same tree with createMemoryRouter.
export const routes: RouteObject[] = [
  {
    path: '/',
    element: <Layout />,
    errorElement: <RouteError />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'settings', element: <Settings /> },
      { path: '*', element: <NotFound /> },
    ],
  },
]

export const router = createBrowserRouter(routes)

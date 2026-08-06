import { createBrowserRouter, type RouteObject } from 'react-router'
import { Layout } from '@/components/layout/Layout'
import { Dashboard } from '@/features/tasks/Dashboard'
import { MyTask } from '@/features/tasks/MyTask'
import { Settings } from '@/features/settings/Settings'
import { NotFound } from '@/app/NotFound'
import { RouteError } from '@/app/RouteError'

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <Layout />,
    errorElement: <RouteError />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'my-task', element: <MyTask /> },
      { path: 'settings', element: <Settings /> },
      { path: '*', element: <NotFound /> },
    ],
  },
]

export const router = createBrowserRouter(routes)

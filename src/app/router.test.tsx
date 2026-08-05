import { describe, expect, it } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { routes } from '@/app/router'

// Fresh QueryClient per test: no cache leaks between tests, no retries
// slowing failure cases down.
function renderAt(path: string) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  const router = createMemoryRouter(routes, { initialEntries: [path] })
  return render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  )
}

describe('app routes', () => {
  it('renders the dashboard at /', () => {
    renderAt('/')
    expect(screen.getByRole('heading', { name: /dashboard/i })).toBeInTheDocument()
  })

  it('renders the settings page at /settings', () => {
    renderAt('/settings')
    expect(screen.getByRole('heading', { name: /settings/i })).toBeInTheDocument()
  })

  it('renders the not-found page for unknown paths', () => {
    renderAt('/does-not-exist')
    expect(screen.getByRole('heading', { name: /not found/i })).toBeInTheDocument()
  })

  it('renders the my-task placeholder page at /my-task', () => {
    renderAt('/my-task')
    expect(screen.getByRole('heading', { name: /my task/i })).toBeInTheDocument()
  })
})

describe('sidebar navigation', () => {
  it('marks only the active item with aria-current', () => {
    renderAt('/')
    expect(screen.getByRole('link', { name: /dashboard/i })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('link', { name: /my task/i })).not.toHaveAttribute('aria-current')
  })

  it('moves aria-current when the route changes', () => {
    renderAt('/my-task')
    expect(screen.getByRole('link', { name: /my task/i })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('link', { name: /dashboard/i })).not.toHaveAttribute('aria-current')
  })

  it('marks nothing active on unknown deep paths (renders not-found)', () => {
    renderAt('/my-task/anything')
    expect(screen.getByRole('heading', { name: /not found/i })).toBeInTheDocument()
    const nav = within(screen.getByRole('navigation'))
    expect(nav.getByRole('link', { name: /my task/i })).not.toHaveAttribute('aria-current')
    expect(nav.getByRole('link', { name: /dashboard/i })).not.toHaveAttribute('aria-current')
  })
})

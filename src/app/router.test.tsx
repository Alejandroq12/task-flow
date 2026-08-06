import { describe, expect, it } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
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
    expect(screen.getByRole('heading', { level: 1, name: /dashboard/i })).toBeInTheDocument()
  })

  it('renders the settings page at /settings', () => {
    renderAt('/settings')
    expect(screen.getByRole('heading', { level: 1, name: /settings/i })).toBeInTheDocument()
  })

  it('renders the not-found page for unknown paths', () => {
    renderAt('/does-not-exist')
    expect(screen.getByRole('heading', { level: 1, name: /not found/i })).toBeInTheDocument()
  })

  it('renders the my-task placeholder page at /my-task', () => {
    renderAt('/my-task')
    expect(screen.getByRole('heading', { level: 1, name: /my task/i })).toBeInTheDocument()
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
    expect(screen.getByRole('heading', { level: 1, name: /not found/i })).toBeInTheDocument()
    const nav = within(screen.getByRole('navigation'))
    expect(nav.getByRole('link', { name: /my task/i })).not.toHaveAttribute('aria-current')
    expect(nav.getByRole('link', { name: /dashboard/i })).not.toHaveAttribute('aria-current')
  })
})

describe('dashboard main content', () => {
  it('renders the five required status columns', () => {
    renderAt('/')
    for (const title of ['Backlog', 'To Do', 'In Progress', 'Done', 'Cancelled']) {
      expect(
        screen.getByRole('heading', { level: 2, name: new RegExp(title, 'i') }),
      ).toBeInTheDocument()
    }
  })

  it('renders a task card with its required fields', () => {
    renderAt('/')
    const card = screen.getByRole('heading', { level: 3, name: /twitter/i }).closest('article')
    if (!card) throw new Error('expected the Twitter card to render inside an <article>')
    const scoped = within(card)
    expect(scoped.getByText(/3 pts/i)).toBeInTheDocument()
    expect(scoped.getByText(/yesterday/i)).toBeInTheDocument()
    expect(scoped.getByText(/ios app/i)).toBeInTheDocument()
    expect(scoped.getByText(/android/i)).toBeInTheDocument()
    expect(scoped.getByRole('img', { name: /assignee/i })).toBeInTheDocument()
  })
})

describe('header', () => {
  it('renders a controlled search input', async () => {
    const user = userEvent.setup()
    renderAt('/')
    const search = screen.getByRole('textbox', { name: /search/i })
    await user.type(search, 'slack')
    expect(search).toHaveValue('slack')
  })
})

describe('mobile navigation drawer', () => {
  it('opens from the header trigger and exposes a backdrop', async () => {
    const user = userEvent.setup()
    renderAt('/')
    const trigger = screen.getByRole('button', { name: /open navigation/i })
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    await user.click(trigger)
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('button', { name: /close navigation/i })).toBeInTheDocument()
  })

  it('closes when the backdrop is clicked', async () => {
    const user = userEvent.setup()
    renderAt('/')
    await user.click(screen.getByRole('button', { name: /open navigation/i }))
    await user.click(screen.getByRole('button', { name: /close navigation/i }))
    expect(screen.getByRole('button', { name: /open navigation/i })).toHaveAttribute(
      'aria-expanded',
      'false',
    )
    expect(screen.queryByRole('button', { name: /close navigation/i })).not.toBeInTheDocument()
  })

  it('closes after navigating via a sidebar link', async () => {
    const user = userEvent.setup()
    renderAt('/')
    await user.click(screen.getByRole('button', { name: /open navigation/i }))
    const nav = within(screen.getByRole('navigation'))
    await user.click(nav.getByRole('link', { name: /my task/i }))
    expect(screen.getByRole('heading', { level: 1, name: /my task/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /open navigation/i })).toHaveAttribute(
      'aria-expanded',
      'false',
    )
  })

  it('keeps the closed drawer out of the tab order via the visibility contract', async () => {
    const user = userEvent.setup()
    renderAt('/')
    const aside = document.getElementById('app-sidebar')
    expect(aside).toHaveClass('invisible')
    await user.click(screen.getByRole('button', { name: /open navigation/i }))
    expect(aside).toHaveClass('visible')
    expect(aside).not.toHaveClass('invisible')
  })

  it('closes on Escape', async () => {
    const user = userEvent.setup()
    renderAt('/')
    await user.click(screen.getByRole('button', { name: /open navigation/i }))
    await user.keyboard('{Escape}')
    expect(screen.getByRole('button', { name: /open navigation/i })).toHaveAttribute(
      'aria-expanded',
      'false',
    )
  })
})

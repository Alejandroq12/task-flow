import { useRouteError } from 'react-router'

export function RouteError() {
  const error = useRouteError()
  console.error('Route error:', error)
  return (
    <div role="alert">
      <p>Something went wrong.</p>
    </div>
  )
}
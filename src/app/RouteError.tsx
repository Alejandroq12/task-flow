import { useEffect } from 'react'
import { Link, useRouteError } from 'react-router'

export function RouteError() {
  const error = useRouteError()

  useEffect(() => {
    console.error('Route error:', error)
  }, [error])

  return (
    <div role="alert">
      <h1>Something went wrong.</h1>
      <Link to="/">Back to dashboard</Link>
    </div>
  )
}

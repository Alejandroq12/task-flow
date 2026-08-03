import { Link } from 'react-router'

export function NotFound() {
  return (
    <div>
      <h1>Page not found</h1>
      <Link to="/">Back to dashboard</Link>
    </div>
  )
}

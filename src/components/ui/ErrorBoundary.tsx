import { Component, type ReactNode } from 'react'

export class ErrorBoundary extends Component 
< { children: ReactNode; fallback?: ReactNode },
  { hasError: boolean } > {
  state = { hasError: false }
  static getDerivedStateFromError() {
    return { hasError: true }
  }
  componentDidCatch(error: Error) {
    console.error('Caught by ErrorBoundary:', error)
  }
  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <div role="alert">
          <p>Something went wrong.</p>
        </div>
      )
    }
    return this.props.children
  }
}
import { useOutletContext } from 'react-router'

export type BoardLayout = 'grid' | 'list'

export interface ViewLayoutContext {
  layout: BoardLayout
  setLayout: (layout: BoardLayout) => void
}

export function useViewLayout(): ViewLayoutContext {
  const context = useOutletContext<ViewLayoutContext | null>()
  if (context === null) {
    throw new Error('useViewLayout requires a route rendered inside Layout — check the router')
  }
  return context
}

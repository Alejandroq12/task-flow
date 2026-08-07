import { useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from 'react'

export function useDialogFocus(onEscape: () => void) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [opener] = useState(() => document.activeElement)

  useEffect(() => {
    return () => {
      if (opener instanceof HTMLElement) opener.focus()
    }
  }, [opener])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onEscape()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [onEscape])

  const trapFocus = (event: ReactKeyboardEvent) => {
    if (event.key !== 'Tab' || containerRef.current === null) return
    const focusables = [...containerRef.current.querySelectorAll<HTMLElement>('button, input')]
      .filter((el) => el.tabIndex !== -1 && !el.hasAttribute('disabled'))
      .filter((el) => el.getClientRects().length > 0)
    const first = focusables.at(0)
    const last = focusables.at(-1)
    if (first === undefined || last === undefined) return
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first.focus()
    }
  }

  return { containerRef, trapFocus }
}

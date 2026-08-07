import { useCallback, useMemo, useRef, useState, type ReactNode } from 'react'
import {
  NotificationsContext,
  type AppNotification,
  type Notify,
  type NotificationsContextValue,
} from '@/components/ui/notifications-context'

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<AppNotification[]>([])
  const nextId = useRef(0)

  const notify = useCallback<Notify>((message, tone) => {
    const id = nextId.current
    nextId.current += 1
    setNotifications((current) => [{ id, message, tone, read: false }, ...current].slice(0, 10))
  }, [])

  const markAllRead = useCallback(() => {
    setNotifications((current) =>
      current.some((item) => !item.read)
        ? current.map((item) => (item.read ? item : { ...item, read: true }))
        : current,
    )
  }, [])

  const value = useMemo<NotificationsContextValue>(
    () => ({ notify, notifications, markAllRead }),
    [notify, notifications, markAllRead],
  )

  return <NotificationsContext.Provider value={value}>{children}</NotificationsContext.Provider>
}

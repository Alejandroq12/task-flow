import { createContext, useContext } from 'react'

export interface AppNotification {
  id: number
  message: string
  tone: 'success' | 'error'
  read: boolean
}

export type Notify = (message: string, tone: AppNotification['tone']) => void

export interface NotificationsContextValue {
  notify: Notify
  notifications: AppNotification[]
  markAllRead: () => void
}

export const NotificationsContext = createContext<NotificationsContextValue | null>(null)

function useNotificationsContext(): NotificationsContextValue {
  const value = useContext(NotificationsContext)
  if (value === null) {
    throw new Error('Notification hooks require a NotificationsProvider above — check main.tsx')
  }
  return value
}

export function useNotify(): Notify {
  return useNotificationsContext().notify
}

export function useNotifications(): Pick<
  NotificationsContextValue,
  'notifications' | 'markAllRead'
> {
  const { notifications, markAllRead } = useNotificationsContext()
  return { notifications, markAllRead }
}

import { useState } from 'react'
import { BellIcon } from '@/components/ui/icons'
import { useNotifications } from '@/components/ui/notifications-context'

export function NotificationsBell() {
  const { notifications, markAllRead } = useNotifications()
  const [open, setOpen] = useState(false)
  const hasUnread = notifications.some((item) => !item.read)

  const toggle = () => {
    if (!open) markAllRead()
    setOpen((current) => !current)
  }

  return (
    <div className="relative">
      <button
        type="button"
        aria-label="Notifications"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={toggle}
        className="relative flex size-8 items-center justify-center text-neutral-2"
      >
        <BellIcon className="size-6" />
        {hasUnread && (
          <span className="absolute top-0.5 right-0.5 size-2 rounded-full bg-primary-4" />
        )}
      </button>
      {open && (
        <>
          <button
            type="button"
            aria-label="Close notifications"
            tabIndex={-1}
            onClick={() => {
              setOpen(false)
            }}
            className="fixed inset-0 z-10 cursor-default"
          />
          <div className="absolute top-full right-0 z-20 mt-2 flex w-72 flex-col rounded-lg border border-neutral-2 bg-neutral-3 py-2 shadow-drop-large">
            <span className="flex h-8 items-center px-4 text-body-xl font-semibold text-neutral-2">
              Notifications
            </span>
            {notifications.length === 0 ? (
              <p className="px-4 py-2 text-body-m text-neutral-2">No notifications yet.</p>
            ) : (
              notifications.map((item) => (
                <p
                  key={item.id}
                  className={`border-l-4 px-4 py-2 text-body-m text-neutral-1 ${
                    item.tone === 'error' ? 'border-primary-4' : 'border-secondary-4'
                  }`}
                >
                  {item.message}
                </p>
              ))
            )}
          </div>
        </>
      )}
    </div>
  )
}

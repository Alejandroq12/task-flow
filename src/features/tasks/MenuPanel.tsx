import type { ReactNode } from 'react'

export function MenuPanel({
  title,
  className,
  children,
}: {
  title: string
  className: string
  children: ReactNode
}) {
  return (
    <div
      className={`absolute top-full left-0 z-10 mt-2 flex flex-col rounded-lg border border-neutral-2 bg-neutral-3 py-2 shadow-drop-large ${className}`}
    >
      <span className="flex h-8 items-center px-4 text-body-xl font-semibold text-neutral-2">
        {title}
      </span>
      {children}
    </div>
  )
}

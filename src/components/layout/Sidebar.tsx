import { NavLink } from 'react-router'
import logoUrl from '@/assets/logos/ravn-logomark-white.svg'
import { DashboardIcon, MyTaskIcon } from '@/components/ui/icons'

const navItems = [
  { to: '/', label: 'Dashboard', Icon: DashboardIcon },
  { to: '/my-task', label: 'My Task', Icon: MyTaskIcon },
]

interface SidebarProps {
  open: boolean
  onClose: () => void
}

export function Sidebar({ open, onClose }: SidebarProps) {
  return (
    <>
      {open && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={onClose}
          className="fixed inset-0 z-30 bg-neutral-5/75 lg:hidden"
        />
      )}
      <aside
        id="app-sidebar"
        className={`${open ? 'visible translate-x-0' : 'invisible -translate-x-full'} fixed inset-y-0 left-0 z-40 w-77.5 overflow-hidden bg-neutral-4 transition-[transform,visibility] lg:visible lg:static lg:z-auto lg:h-full lg:w-58 lg:shrink-0 lg:translate-x-0 lg:rounded-3xl`}
      >
        <div className="flex items-center justify-center pt-9 pb-11">
          <img className="size-10" src={logoUrl} alt="Ravn" />
        </div>

        <nav aria-label="Main">
          <ul className="flex flex-col gap-2">
            {navItems.map(({ to, label, Icon }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex h-14 items-center gap-4 pl-4 text-body-m font-semibold uppercase focus-visible:-outline-offset-2 ${
                      isActive
                        ? 'bg-linear-to-r from-primary-4/0 to-primary-4/5 text-primary-3'
                        : 'text-neutral-2 hover:text-neutral-1'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon className="size-6 shrink-0" />
                      <span className="flex-1">{label}</span>
                      <span
                        aria-hidden="true"
                        className={`h-14 w-1 bg-primary-4 ${isActive ? 'opacity-100' : 'opacity-0'}`}
                      />
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  )
}

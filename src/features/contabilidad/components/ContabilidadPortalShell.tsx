import type { ReactNode } from 'react'
import { NavLink } from 'react-router-dom'
import { CreditCard, Scale } from 'lucide-react'
import logo from '@/assets/logo.png'
import { UserProfileMenu } from '@/components/UserProfileMenu'
import { ROUTES_CONCILIACION, ROUTES_PAGOS } from '@/features/auth/utils/roleAccess'
import { cn } from '@/utils/cn'

export type ContabilidadPortalShellProps = Readonly<{
  headerTitle: string
  userName: string
  userInitials: string
  children: ReactNode
}>

const navItemBase =
  'flex h-10 w-full items-center gap-2.5 rounded-lg px-3 text-sm transition-colors duration-150'
const navInactive = 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
const navActive = 'bg-primary/8 font-medium text-primary'

/**
 * Layout del rol contabilidad: solo módulo financiero (pagos y conciliación).
 */
export function ContabilidadPortalShell({
  headerTitle,
  userName,
  userInitials,
  children,
}: ContabilidadPortalShellProps) {
  return (
    <div className="min-h-screen bg-gray-50/50">
      <aside className="fixed inset-y-0 left-0 z-30 flex w-60 flex-col border-r border-gray-200 bg-white">
        <div className="flex h-16 items-center gap-2.5 border-b border-gray-100 px-4">
          <img src={logo} alt="" className="h-8 w-8 rounded-lg object-contain" />
          <span className="text-sm font-semibold text-gray-900">Nomisalud</span>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4" aria-label="Contabilidad">
          <NavLink
            to={ROUTES_CONCILIACION}
            className={({ isActive }) => cn(navItemBase, isActive ? navActive : navInactive)}
          >
            <Scale className="h-4 w-4 shrink-0" aria-hidden />
            Conciliación
          </NavLink>
          <NavLink
            to={ROUTES_PAGOS}
            className={({ isActive }) => cn(navItemBase, isActive ? navActive : navInactive)}
          >
            <CreditCard className="h-4 w-4 shrink-0" aria-hidden />
            Pagos
          </NavLink>
        </nav>

        <div className="relative z-40 overflow-visible border-t border-gray-100 p-3">
          <UserProfileMenu
            userName={userName}
            companyName="Contabilidad"
            avatarInitials={userInitials}
            avatarClassName="bg-primary text-white"
            menuPlacement="right"
            showUserInfo
          />
        </div>
      </aside>

      <main className="ml-60 min-h-screen">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-gray-100 bg-white px-8">
          <div>
            <h1 className="text-base font-semibold text-gray-900">{headerTitle}</h1>
            <p className="text-xs text-gray-400">Módulo financiero</p>
          </div>
        </header>

        <div className="p-8">{children}</div>
      </main>
    </div>
  )
}

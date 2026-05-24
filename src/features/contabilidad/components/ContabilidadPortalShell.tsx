import type { ReactNode } from 'react'
import { NavLink } from 'react-router-dom'
import { CreditCard, Scale } from 'lucide-react'
import logo from '@/assets/logo.png'
import { UserProfileMenu } from '@/components/UserProfileMenu'
import { ROUTES_CONCILIACION, ROUTES_PAGOS } from '@/features/auth/utils/roleAccess'
import { ShellPageHeader } from '@/components/layout/ShellPageHeader'
import {
  shellAsideBrandClass,
  shellAsideBrandTitleClass,
  shellAsideClass,
  shellAsideFooterClass,
  shellBackdropClass,
  shellContentClass,
  shellMainClass,
  shellNavActive,
  shellNavInactive,
  shellNavItemBase,
  shellRootClass,
} from '@/components/layout/shellLayout'
import { useShellNav } from '@/components/layout/useShellNav'
import { cn } from '@/utils/cn'

export type ContabilidadPortalShellProps = Readonly<{
  headerTitle: string
  userName: string
  userInitials: string
  children: ReactNode
}>

/**
 * Layout del rol contabilidad: solo módulo financiero (pagos y conciliación).
 */
export function ContabilidadPortalShell({
  headerTitle,
  userName,
  userInitials,
  children,
}: ContabilidadPortalShellProps) {
  const { mobileNavOpen, closeMobileNav, toggleMobileNav } = useShellNav()

  return (
    <div className={shellRootClass}>
      {mobileNavOpen ? (
        <button
          type="button"
          className={shellBackdropClass}
          aria-label="Cerrar menú de navegación"
          onClick={closeMobileNav}
        />
      ) : null}

      <aside className={shellAsideClass(mobileNavOpen)}>
        <div className={shellAsideBrandClass}>
          <img src={logo} alt="" className="h-8 w-8 rounded-lg object-contain" />
          <span className={shellAsideBrandTitleClass}>Nomisalud</span>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4" aria-label="Contabilidad">
          <NavLink
            to={ROUTES_CONCILIACION}
            className={({ isActive }) =>
              cn(shellNavItemBase, isActive ? shellNavActive : shellNavInactive)
            }
          >
            <Scale className="h-4 w-4 shrink-0" aria-hidden />
            Conciliación
          </NavLink>
          <NavLink
            to={ROUTES_PAGOS}
            className={({ isActive }) =>
              cn(shellNavItemBase, isActive ? shellNavActive : shellNavInactive)
            }
          >
            <CreditCard className="h-4 w-4 shrink-0" aria-hidden />
            Pagos
          </NavLink>
        </nav>

        <div className={shellAsideFooterClass}>
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

      <main className={shellMainClass}>
        <ShellPageHeader
          title={headerTitle}
          subtitle="Módulo financiero"
          mobileNavOpen={mobileNavOpen}
          onMobileNavToggle={toggleMobileNav}
        />

        <div className={shellContentClass}>{children}</div>
      </main>
    </div>
  )
}

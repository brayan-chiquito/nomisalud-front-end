import type { ReactNode } from 'react'
import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Upload } from 'lucide-react'
import logo from '@/assets/logo.png'
import { useAuth } from '@/features/auth/context/AuthContext'
import { UserProfileMenu } from '@/components/UserProfileMenu'
import { canHumanVerifyIncapacidad } from '@/features/incapacity-ai-review/utils/reviewFormState'
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
  shellNavSectionLabel,
  shellRootClass,
} from '@/components/layout/shellLayout'
import { useShellNav } from '@/components/layout/useShellNav'
import { cn } from '@/utils/cn'

export type RecepcionPortalShellProps = Readonly<{
  headerTitle: string
  userName: string
  userInitials: string
  children: ReactNode
}>

const ROLES_PANEL_RRHH = new Set(['admin', 'auxiliar_rrhh', 'coordinador_rrhh'])

export function RecepcionPortalShell({
  headerTitle,
  userName,
  userInitials,
  children,
}: RecepcionPortalShellProps) {
  const { user } = useAuth()
  const showPanelRrhh =
    ROLES_PANEL_RRHH.has(user?.role ?? '') || canHumanVerifyIncapacidad(user?.role)
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

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4" aria-label="Recepción">
          <NavLink
            to="/recepcion/radicar"
            end
            className={({ isActive }) =>
              cn(shellNavItemBase, isActive ? shellNavActive : shellNavInactive)
            }
          >
            <Upload className="h-4 w-4 shrink-0" aria-hidden />
            Radicar documento
          </NavLink>

          {showPanelRrhh ? (
            <>
              <div className="pt-4 pb-2">
                <p className={shellNavSectionLabel}>Gestión RRHH</p>
              </div>
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  cn(shellNavItemBase, isActive ? shellNavActive : shellNavInactive)
                }
              >
                <LayoutDashboard className="h-4 w-4 shrink-0" aria-hidden />
                Panel RRHH
              </NavLink>
            </>
          ) : null}
        </nav>

        <div className={shellAsideFooterClass}>
          <UserProfileMenu
            userName={userName}
            companyName="Recepción"
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
          subtitle="Portal de recepción"
          mobileNavOpen={mobileNavOpen}
          onMobileNavToggle={toggleMobileNav}
        />

        <div className={shellContentClass}>{children}</div>
      </main>
    </div>
  )
}

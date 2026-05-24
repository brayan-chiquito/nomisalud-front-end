import type { ReactNode } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  BarChart3,
  Users,
  UserCircle,
  CreditCard,
  CircleDollarSign,
  Scale,
  Settings,
  ClipboardList,
} from 'lucide-react'
import { useAuth } from '@/features/auth/context/AuthContext'
import logo from '@/assets/logo.png'
import { UserProfileMenu } from '@/components/UserProfileMenu'
import { ROUTES_USUARIOS_ADMIN } from '@/features/auth/utils/roleAccess'
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

export type RrhhDashboardShellProps = Readonly<{
  headerTitle: string
  userName: string
  userInitials: string
  companyName?: string
  children: ReactNode
}>

export function RrhhDashboardShell({
  headerTitle,
  userName,
  userInitials,
  companyName = 'Recursos Humanos',
  children,
}: RrhhDashboardShellProps) {
  const { user } = useAuth()
  const { pathname } = useLocation()
  const enDashboard = pathname === '/dashboard'
  const showPlazosNav = user?.role === 'admin' || user?.role === 'coordinador_rrhh'
  const showAuditoriaNav = showPlazosNav
  const showUsuariosNav = user?.role === 'admin'
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

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          <NavLink
            to="/dashboard"
            end
            className={cn(shellNavItemBase, enDashboard ? shellNavActive : shellNavInactive)}
            onClick={() => globalThis.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <LayoutDashboard className="h-4 w-4 shrink-0" aria-hidden />
            Inicio
          </NavLink>
          <NavLink
            to="/dashboard/conciliacion"
            className={({ isActive }) =>
              cn(shellNavItemBase, isActive ? shellNavActive : shellNavInactive)
            }
          >
            <Scale className="h-4 w-4 shrink-0" aria-hidden />
            Conciliación
          </NavLink>
          {showAuditoriaNav ? (
            <NavLink
              to="/dashboard/auditoria"
              className={({ isActive }) =>
                cn(shellNavItemBase, isActive ? shellNavActive : shellNavInactive)
              }
            >
              <ClipboardList className="h-4 w-4 shrink-0" aria-hidden />
              Auditoría
            </NavLink>
          ) : (
            <button
              type="button"
              disabled
              title="Próximamente"
              className={cn(shellNavItemBase, 'cursor-not-allowed text-gray-400 opacity-50')}
            >
              <BarChart3 className="h-4 w-4 shrink-0" aria-hidden />
              Reportes
            </button>
          )}
          {showUsuariosNav ? (
            <NavLink
              to={ROUTES_USUARIOS_ADMIN}
              className={({ isActive }) =>
                cn(shellNavItemBase, isActive ? shellNavActive : shellNavInactive)
              }
            >
              <Users className="h-4 w-4 shrink-0" aria-hidden />
              Usuarios
            </NavLink>
          ) : (
            <button
              type="button"
              disabled
              title="Próximamente"
              className={cn(shellNavItemBase, 'cursor-not-allowed text-gray-400 opacity-50')}
            >
              <Users className="h-4 w-4 shrink-0" aria-hidden />
              Usuarios
            </button>
          )}

          <div className="pt-4 pb-2">
            <p className={shellNavSectionLabel}>Colaborador</p>
          </div>
          <NavLink
            to="/portal/mi-tramite"
            className={({ isActive }) =>
              cn(shellNavItemBase, isActive ? shellNavActive : shellNavInactive)
            }
          >
            <UserCircle className="h-4 w-4 shrink-0" aria-hidden />
            Portal colaborador
          </NavLink>

          <div className="pt-4 pb-2">
            <p className={shellNavSectionLabel}>Administración</p>
          </div>
          <NavLink
            to="/dashboard/cobro-ante-entidad"
            className={({ isActive }) =>
              cn(shellNavItemBase, isActive ? shellNavActive : shellNavInactive)
            }
          >
            <CircleDollarSign className="h-4 w-4 shrink-0" aria-hidden />
            Cobro ante entidad
          </NavLink>
          <NavLink
            to="/dashboard/pagos"
            className={({ isActive }) =>
              cn(shellNavItemBase, isActive ? shellNavActive : shellNavInactive)
            }
          >
            <CreditCard className="h-4 w-4 shrink-0" aria-hidden />
            Pagos
          </NavLink>
          {showPlazosNav ? (
            <NavLink
              to="/admin/plazos-entidad"
              className={({ isActive }) =>
                cn(shellNavItemBase, isActive ? shellNavActive : shellNavInactive)
              }
            >
              <Settings className="h-4 w-4 shrink-0" aria-hidden />
              Plazos por entidad
            </NavLink>
          ) : null}
        </nav>

        <div className={shellAsideFooterClass}>
          <UserProfileMenu
            userName={userName}
            companyName={companyName}
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
          subtitle="Panel de recursos humanos"
          mobileNavOpen={mobileNavOpen}
          onMobileNavToggle={toggleMobileNav}
        />

        <div className={shellContentClass}>{children}</div>
      </main>
    </div>
  )
}

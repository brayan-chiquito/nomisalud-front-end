import { useState, type ReactNode } from 'react'
import { NavLink } from 'react-router-dom'
import { LayoutDashboard, FileText, BarChart3, Users } from 'lucide-react'
import logo from '@/assets/logo.png'
import { UserProfileMenu } from '@/components/UserProfileMenu'
import { cn } from '@/utils/cn'

export type RrhhDashboardShellProps = Readonly<{
  headerTitle: string
  userName: string
  userInitials: string
  companyName?: string
  children: ReactNode
}>

const navItemBase =
  'flex h-10 w-full items-center gap-2.5 rounded-lg px-3 text-sm transition-colors duration-150'
const navInactive = 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
const navActive = 'bg-primary/8 font-medium text-primary'

export function RrhhDashboardShell({
  headerTitle,
  userName,
  userInitials,
  companyName = 'Recursos Humanos',
  children,
}: RrhhDashboardShellProps) {
  const [activeSection, setActiveSection] = useState<'inicio' | 'incapacidades'>('inicio')

  const scrollToIncapacidades = () => {
    setActiveSection('incapacidades')
    globalThis.document
      .getElementById('panel-incapacidades')
      ?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <aside className="fixed inset-y-0 left-0 z-30 flex w-60 flex-col border-r border-gray-200 bg-white">
        <div className="flex h-16 items-center gap-2.5 border-b border-gray-100 px-4">
          <img src={logo} alt="" className="h-8 w-8 rounded-lg object-contain" />
          <span className="text-sm font-semibold text-gray-900">Nomisalud</span>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          <NavLink
            to="/dashboard"
            end
            onClick={() => setActiveSection('inicio')}
            className={cn(navItemBase, activeSection === 'inicio' ? navActive : navInactive)}
          >
            <LayoutDashboard className="h-4 w-4 shrink-0" aria-hidden />
            Inicio
          </NavLink>
          <button
            type="button"
            onClick={scrollToIncapacidades}
            className={cn(
              navItemBase,
              'text-left',
              activeSection === 'incapacidades' ? navActive : navInactive,
            )}
          >
            <FileText className="h-4 w-4 shrink-0" aria-hidden />
            Incapacidades
          </button>
          <button
            type="button"
            disabled
            title="Próximamente"
            className={cn(navItemBase, 'cursor-not-allowed text-gray-300 opacity-60')}
          >
            <BarChart3 className="h-4 w-4 shrink-0" aria-hidden />
            Reportes
          </button>
          <button
            type="button"
            disabled
            title="Próximamente"
            className={cn(navItemBase, 'cursor-not-allowed text-gray-300 opacity-60')}
          >
            <Users className="h-4 w-4 shrink-0" aria-hidden />
            Usuarios
          </button>

          <div className="pt-4 pb-2">
            <p className="px-3 text-[10px] font-semibold tracking-widest text-gray-300 uppercase">
              Administración
            </p>
          </div>
        </nav>

        <div className="relative z-40 overflow-visible border-t border-gray-100 p-3">
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

      <main className="ml-60 min-h-screen">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-gray-100 bg-white px-8">
          <div>
            <h1 className="text-base font-semibold text-gray-900">{headerTitle}</h1>
            <p className="text-xs text-gray-400">Panel de recursos humanos</p>
          </div>
        </header>

        <div className="p-8">{children}</div>
      </main>
    </div>
  )
}

import { useState, type ReactNode } from 'react'
import { NavLink } from 'react-router-dom'
import { LayoutDashboard, FileText, BarChart3, Users } from 'lucide-react'
import logo from '@/assets/logo.png'
import { cn } from '@/utils/cn'

export type RrhhDashboardShellProps = Readonly<{
  headerTitle: string
  userName: string
  userInitials: string
  children: ReactNode
}>

const navInactive = 'text-slate-400 hover:bg-slate-700/60 hover:text-white'
const navActive = 'bg-blue-600 text-white'

export function RrhhDashboardShell({
  headerTitle,
  userName,
  userInitials,
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
    <div className="flex min-h-screen bg-slate-100">
      <aside className="flex w-[240px] shrink-0 flex-col bg-[#1E293B] px-4 py-6">
        <div className="mb-5 flex items-center justify-center gap-2.5 pb-5">
          <img src={logo} alt="" className="h-[30px] w-[30px] rounded-md object-contain" />
          <span className="text-[15px] font-bold text-white">Nomisalud</span>
        </div>

        <nav className="flex flex-col gap-1">
          <NavLink
            to="/dashboard"
            end
            onClick={() => setActiveSection('inicio')}
            className={cn(
              'flex h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors',
              activeSection === 'inicio' ? navActive : navInactive,
            )}
          >
            <LayoutDashboard className="h-[18px] w-[18px] shrink-0" aria-hidden />
            Inicio
          </NavLink>
          <button
            type="button"
            onClick={scrollToIncapacidades}
            className={cn(
              'flex h-11 w-full items-center gap-3 rounded-lg px-3 text-left text-sm font-medium transition-colors',
              activeSection === 'incapacidades' ? navActive : navInactive,
            )}
          >
            <FileText className="h-[18px] w-[18px] shrink-0" aria-hidden />
            Incapacidades
          </button>
          <button
            type="button"
            disabled
            title="Próximamente"
            className="flex h-11 cursor-not-allowed items-center gap-3 rounded-lg px-3 text-left text-sm font-medium text-slate-500 opacity-60"
          >
            <BarChart3 className="h-[18px] w-[18px] shrink-0" aria-hidden />
            Reportes
          </button>
          <button
            type="button"
            disabled
            title="Próximamente"
            className="flex h-11 cursor-not-allowed items-center gap-3 rounded-lg px-3 text-left text-sm font-medium text-slate-500 opacity-60"
          >
            <Users className="h-[18px] w-[18px] shrink-0" aria-hidden />
            Usuarios
          </button>
        </nav>
      </aside>

      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-6">
          <h1 className="text-lg font-semibold text-slate-900">{headerTitle}</h1>
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-500">{userName}</span>
            <div
              className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-[13px] font-semibold text-white"
              aria-hidden
            >
              {userInitials}
            </div>
          </div>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto bg-[#F1F5F9] p-6">{children}</div>
      </div>
    </div>
  )
}

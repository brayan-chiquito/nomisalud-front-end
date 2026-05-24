import { Link } from 'react-router-dom'
import { LayoutDashboard } from 'lucide-react'
import logo from '@/assets/logo.png'
import { UserProfileMenu } from '@/components/UserProfileMenu'
import { buttonClassName } from '@/components/ui/buttonStyles'

export type CollaboratorHeaderProps = Readonly<{
  userName: string
  companyName: string
  avatarInitials: string
  /** Enlace al dashboard RRHH (visible por defecto en el portal colaborador). */
  showDashboardLink?: boolean
}>

/**
 * Cabecera compartida del portal colaborador (logo + usuario).
 * Las props pueden enlazarse después a `useAuth()` o a una query de perfil.
 */
export function CollaboratorHeader({
  userName,
  companyName,
  avatarInitials,
  showDashboardLink = true,
}: CollaboratorHeaderProps) {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
      <div className="flex items-center gap-2.5">
        <img src={logo} alt="Nomisalud" className="h-8 w-8 object-contain" />
        <span className="text-sm font-semibold text-gray-900">Nomisalud</span>
        {showDashboardLink ? (
          <Link
            to="/dashboard"
            className={buttonClassName('secondary', 'ml-1 gap-1.5 py-1.5 text-[13px]')}
          >
            <LayoutDashboard className="h-3.5 w-3.5 shrink-0" aria-hidden />
            Dashboard
          </Link>
        ) : null}
      </div>
      <div className="flex items-center gap-3">
        <div className="hidden flex-col items-end gap-0.5 sm:flex">
          <span className="text-sm font-medium text-gray-900">{userName}</span>
          <span className="text-xs text-gray-400">{companyName}</span>
        </div>
        <UserProfileMenu
          userName={userName}
          companyName={companyName}
          avatarInitials={avatarInitials}
        />
      </div>
    </header>
  )
}

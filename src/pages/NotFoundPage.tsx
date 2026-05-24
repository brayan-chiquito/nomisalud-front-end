import { Link } from 'react-router-dom'
import { useAuth } from '@/features/auth/context/AuthContext'
import { UserProfileMenu } from '@/components/UserProfileMenu'
import { buttonClassName } from '@/components/ui/buttonStyles'

function displayNameFromEmail(email: string | undefined): string {
  if (!email) return 'Usuario'
  const local = email.split('@')[0] ?? email
  return local.replaceAll('.', ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

function initialsFromEmail(email: string | undefined, id: string | undefined): string {
  if (email && email.length >= 2) return email.slice(0, 2).toUpperCase()
  if (id && id.length >= 2) return id.slice(0, 2).toUpperCase()
  return 'NS'
}

export function NotFoundPage() {
  const { user, isAuthenticated } = useAuth()

  return (
    <div className="flex min-h-screen flex-col bg-gray-50/50">
      {isAuthenticated ? (
        <header className="flex h-16 items-center justify-end border-b border-gray-200 bg-white px-6">
          <UserProfileMenu
            userName={displayNameFromEmail(user?.email)}
            companyName="Nomisalud"
            avatarInitials={initialsFromEmail(user?.email, user?.id)}
          />
        </header>
      ) : null}

      <div className="flex flex-1 flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="text-6xl font-bold tabular-nums text-gray-900">404</p>
        <h1 className="text-xl font-semibold text-gray-700">Página no encontrada</h1>
        <p className="max-w-sm text-sm text-gray-400">La ruta que buscas no existe o fue movida.</p>
        <Link
          to={isAuthenticated ? '/dashboard' : '/'}
          className={buttonClassName('primary', 'mt-2')}
        >
          {isAuthenticated ? 'Ir al dashboard' : 'Volver al inicio'}
        </Link>
      </div>
    </div>
  )
}

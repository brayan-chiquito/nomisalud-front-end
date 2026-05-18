import { Link } from 'react-router-dom'
import { useAuth } from '@/features/auth/context/AuthContext'
import { UserProfileMenu } from '@/components/UserProfileMenu'

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
    <div className="flex min-h-screen flex-col bg-slate-100">
      {isAuthenticated ? (
        <header className="flex h-16 items-center justify-end border-b border-slate-200 bg-white px-6">
          <UserProfileMenu
            userName={displayNameFromEmail(user?.email)}
            companyName="Nomisalud"
            avatarInitials={initialsFromEmail(user?.email, user?.id)}
            avatarClassName="bg-blue-600"
          />
        </header>
      ) : null}

      <div className="flex flex-1 flex-col items-center justify-center gap-4 px-4">
        <h1 className="text-6xl font-bold text-gray-800">404</h1>
        <p className="text-xl text-gray-600">Página no encontrada</p>
        <Link
          to={isAuthenticated ? '/dashboard' : '/'}
          className="text-blue-600 underline hover:text-blue-800"
        >
          {isAuthenticated ? 'Ir al dashboard' : 'Volver al inicio'}
        </Link>
      </div>
    </div>
  )
}

import { useAuth } from '@/features/auth/context/AuthContext'
import { UsuariosAdminPanel } from '@/features/admin/components/usuarios/UsuariosAdminPanel'
import { RrhhDashboardShell } from '@/features/dashboard/components/RrhhDashboardShell'
import { displayNameFromEmail, initialsFromEmail } from '@/utils/userDisplay'

export function UsuariosAdminPage() {
  const { user } = useAuth()

  return (
    <RrhhDashboardShell
      headerTitle="Usuarios"
      userName={displayNameFromEmail(user?.email)}
      userInitials={initialsFromEmail(user?.email, user?.id)}
    >
      <UsuariosAdminPanel />
    </RrhhDashboardShell>
  )
}

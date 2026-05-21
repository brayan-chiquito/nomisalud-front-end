import { useAuth } from '@/features/auth/context/AuthContext'
import { RrhhDashboardShell } from '@/features/dashboard/components/RrhhDashboardShell'
import { CobroAnteEntidadRrhhView } from '@/features/cobro-ante-entidad/components/CobroAnteEntidadRrhhView'
import { displayNameFromEmail, initialsFromEmail } from '@/utils/userDisplay'

export function CobroAnteEntidadRrhhPage() {
  const { user } = useAuth()

  return (
    <RrhhDashboardShell
      headerTitle="Cobro ante entidad"
      userName={displayNameFromEmail(user?.email)}
      userInitials={initialsFromEmail(user?.email, user?.id)}
    >
      <CobroAnteEntidadRrhhView />
    </RrhhDashboardShell>
  )
}

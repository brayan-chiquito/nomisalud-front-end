import { useAuth } from '@/features/auth/context/AuthContext'
import { RrhhDashboardShell } from '@/features/dashboard/components/RrhhDashboardShell'
import { PagosRrhhView } from '@/features/pagos/components/PagosRrhhView'
import { displayNameFromEmail, initialsFromEmail } from '@/utils/userDisplay'

export function PagosRrhhPage() {
  const { user } = useAuth()

  return (
    <RrhhDashboardShell
      headerTitle="Pagos"
      userName={displayNameFromEmail(user?.email)}
      userInitials={initialsFromEmail(user?.email, user?.id)}
    >
      <PagosRrhhView />
    </RrhhDashboardShell>
  )
}

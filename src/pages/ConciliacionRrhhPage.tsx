import { useAuth } from '@/features/auth/context/AuthContext'
import { RrhhDashboardShell } from '@/features/dashboard/components/RrhhDashboardShell'
import { ConciliacionView } from '@/features/conciliacion/components/ConciliacionView'
import { displayNameFromEmail, initialsFromEmail } from '@/utils/userDisplay'

export function ConciliacionRrhhPage() {
  const { user } = useAuth()

  return (
    <RrhhDashboardShell
      headerTitle="Conciliación"
      userName={displayNameFromEmail(user?.email)}
      userInitials={initialsFromEmail(user?.email, user?.id)}
    >
      <ConciliacionView />
    </RrhhDashboardShell>
  )
}

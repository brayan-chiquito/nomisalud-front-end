import { useAuth } from '@/features/auth/context/AuthContext'
import { AuditoriaView } from '@/features/auditoria/components/AuditoriaView'
import { RrhhDashboardShell } from '@/features/dashboard/components/RrhhDashboardShell'
import { displayNameFromEmail, initialsFromEmail } from '@/utils/userDisplay'

export function AuditoriaRrhhPage() {
  const { user } = useAuth()

  return (
    <RrhhDashboardShell
      headerTitle="Auditoría"
      userName={displayNameFromEmail(user?.email)}
      userInitials={initialsFromEmail(user?.email, user?.id)}
    >
      <AuditoriaView />
    </RrhhDashboardShell>
  )
}

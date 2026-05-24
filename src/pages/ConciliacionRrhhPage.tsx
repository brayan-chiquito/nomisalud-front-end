import { useAuth } from '@/features/auth/context/AuthContext'
import { FinanzasPageShell } from '@/features/contabilidad/components/FinanzasPageShell'
import { ConciliacionView } from '@/features/conciliacion/components/ConciliacionView'
import { displayNameFromEmail, initialsFromEmail } from '@/utils/userDisplay'

export function ConciliacionRrhhPage() {
  const { user } = useAuth()

  return (
    <FinanzasPageShell
      headerTitle="Conciliación"
      userName={displayNameFromEmail(user?.email)}
      userInitials={initialsFromEmail(user?.email, user?.id)}
    >
      <ConciliacionView />
    </FinanzasPageShell>
  )
}

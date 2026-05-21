import { useAuth } from '@/features/auth/context/AuthContext'
import { FinanzasPageShell } from '@/features/contabilidad/components/FinanzasPageShell'
import { PagosRrhhView } from '@/features/pagos/components/PagosRrhhView'
import { displayNameFromEmail, initialsFromEmail } from '@/utils/userDisplay'

export function PagosRrhhPage() {
  const { user } = useAuth()

  return (
    <FinanzasPageShell
      headerTitle="Pagos"
      userName={displayNameFromEmail(user?.email)}
      userInitials={initialsFromEmail(user?.email, user?.id)}
    >
      <PagosRrhhView />
    </FinanzasPageShell>
  )
}

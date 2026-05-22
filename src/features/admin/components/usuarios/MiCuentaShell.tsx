import type { ReactNode } from 'react'
import { useAuth } from '@/features/auth/context/AuthContext'
import { isContabilidadRole } from '@/features/auth/utils/roleAccess'
import { CollaboratorPortalShell } from '@/features/collaborator-portal/components/CollaboratorPortalShell'
import { ContabilidadPortalShell } from '@/features/contabilidad/components/ContabilidadPortalShell'
import { RrhhDashboardShell } from '@/features/dashboard/components/RrhhDashboardShell'
import { RecepcionPortalShell } from '@/features/recepcion/components/RecepcionPortalShell'
import { displayNameFromEmail, initialsFromEmail } from '@/utils/userDisplay'

export type MiCuentaShellProps = Readonly<{
  children: ReactNode
}>

/** Envuelve Mi cuenta con el layout del rol actual. */
export function MiCuentaShell({ children }: MiCuentaShellProps) {
  const { user } = useAuth()
  const userName = displayNameFromEmail(user?.email)
  const userInitials = initialsFromEmail(user?.email, user?.id)
  const role = user?.role?.trim().toLowerCase()

  if (isContabilidadRole(role)) {
    return (
      <ContabilidadPortalShell
        headerTitle="Mi cuenta"
        userName={userName}
        userInitials={userInitials}
      >
        {children}
      </ContabilidadPortalShell>
    )
  }

  if (role === 'colaborador') {
    return (
      <CollaboratorPortalShell
        headerTitle="Mi cuenta"
        userName={userName}
        userInitials={userInitials}
      >
        {children}
      </CollaboratorPortalShell>
    )
  }

  if (role === 'recepcion') {
    return (
      <RecepcionPortalShell headerTitle="Mi cuenta" userName={userName} userInitials={userInitials}>
        {children}
      </RecepcionPortalShell>
    )
  }

  return (
    <RrhhDashboardShell headerTitle="Mi cuenta" userName={userName} userInitials={userInitials}>
      {children}
    </RrhhDashboardShell>
  )
}

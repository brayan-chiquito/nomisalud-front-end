import type { ReactNode } from 'react'
import { useAuth } from '@/features/auth/context/AuthContext'
import { RrhhDashboardShell } from '@/features/dashboard/components/RrhhDashboardShell'
import { isContabilidadRole } from '@/features/auth/utils/roleAccess'
import { ContabilidadPortalShell } from './ContabilidadPortalShell'

export type FinanzasPageShellProps = Readonly<{
  headerTitle: string
  userName: string
  userInitials: string
  children: ReactNode
}>

/** Shell de pagos/conciliación según rol: RRHH completo o vista restringida de contabilidad. */
export function FinanzasPageShell({
  headerTitle,
  userName,
  userInitials,
  children,
}: FinanzasPageShellProps) {
  const { user } = useAuth()

  if (isContabilidadRole(user?.role)) {
    return (
      <ContabilidadPortalShell
        headerTitle={headerTitle}
        userName={userName}
        userInitials={userInitials}
      >
        {children}
      </ContabilidadPortalShell>
    )
  }

  return (
    <RrhhDashboardShell headerTitle={headerTitle} userName={userName} userInitials={userInitials}>
      {children}
    </RrhhDashboardShell>
  )
}

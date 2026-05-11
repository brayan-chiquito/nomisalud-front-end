import { useAuth } from '@/features/auth/context/AuthContext'
import { RrhhDashboardShell } from '@/features/dashboard/components/RrhhDashboardShell'
import { RrhhDashboardKpis } from '@/features/dashboard/components/RrhhDashboardKpis'
import { RrhhIncapacidadesPanel } from '@/features/dashboard/components/RrhhIncapacidadesPanel'

function displayNameFromEmail(email: string | undefined): string {
  if (!email) return 'Usuario'
  const local = email.split('@')[0] ?? email
  return local.replace(/\./g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

function initialsFromEmail(email: string | undefined, id: string | undefined): string {
  if (email && email.length >= 2) return email.slice(0, 2).toUpperCase()
  if (id && id.length >= 2) return id.slice(0, 2).toUpperCase()
  return 'NS'
}

export function DashboardPage() {
  const { user } = useAuth()

  return (
    <RrhhDashboardShell
      headerTitle="Dashboard RRHH"
      userName={displayNameFromEmail(user?.email)}
      userInitials={initialsFromEmail(user?.email, user?.id)}
    >
      <RrhhDashboardKpis />
      <RrhhIncapacidadesPanel />
    </RrhhDashboardShell>
  )
}

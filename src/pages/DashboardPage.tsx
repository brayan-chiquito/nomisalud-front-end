import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAuth } from '@/features/auth/context/AuthContext'
import { ActionSuccessBanner } from '@/features/dashboard/components/ActionSuccessBanner'
import { RrhhDashboardShell } from '@/features/dashboard/components/RrhhDashboardShell'
import { RrhhDashboardKpis } from '@/features/dashboard/components/RrhhDashboardKpis'
import { RrhhIncapacidadesPanel } from '@/features/dashboard/components/RrhhIncapacidadesPanel'
import type { ActionSuccessKind } from '@/features/dashboard/types/dashboardNavigation'

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

function parseSuccessParam(raw: string | null): ActionSuccessKind | null {
  if (raw === 'confirmada' || raw === 'rechazada') return raw
  return null
}

export function DashboardPage() {
  const { user } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()
  const [actionSuccess, setActionSuccess] = useState<ActionSuccessKind | null>(() =>
    parseSuccessParam(searchParams.get('success')),
  )

  useEffect(() => {
    if (!searchParams.has('success')) return
    const next = new URLSearchParams(searchParams)
    next.delete('success')
    setSearchParams(next, { replace: true })
  }, [searchParams, setSearchParams])

  return (
    <RrhhDashboardShell
      headerTitle="Dashboard RRHH"
      userName={displayNameFromEmail(user?.email)}
      userInitials={initialsFromEmail(user?.email, user?.id)}
    >
      {actionSuccess ? (
        <ActionSuccessBanner kind={actionSuccess} onDismiss={() => setActionSuccess(null)} />
      ) : null}
      <RrhhDashboardKpis />
      <RrhhIncapacidadesPanel />
    </RrhhDashboardShell>
  )
}

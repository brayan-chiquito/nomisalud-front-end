import { useParams } from 'react-router-dom'
import { useAuth } from '@/features/auth/context/AuthContext'
import { CollaboratorHeader } from './CollaboratorHeader'
import { MisTramitesListPanel } from './MisTramitesListPanel'
import { MiTramiteDetallePanel } from './MiTramiteDetallePanel'
import { useMisIncapacidades } from '../hooks/useMisIncapacidades'
import { useMiTramiteDetalle } from '../hooks/useMiTramiteDetalle'

function displayNameFromEmail(email: string | undefined): string {
  if (!email) return 'Colaborador'
  const local = email.split('@')[0] ?? email
  return local.replaceAll('.', ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

function initialsFromEmail(email: string | undefined, id: string | undefined): string {
  if (email && email.length >= 2) return email.slice(0, 2).toUpperCase()
  if (id && id.length >= 2) return id.slice(0, 2).toUpperCase()
  return 'CO'
}

/**
 * Portal colaborador — lista de trámites (`GET /incapacidades/mias`) y detalle con timeline.
 */
export function MiTramiteView() {
  const { tramiteId } = useParams<{ tramiteId?: string }>()
  const { user } = useAuth()
  const { data, loading, error, page, setPage } = useMisIncapacidades(!tramiteId)
  const { detail, loading: loadingDetalle, error: errorDetalle } = useMiTramiteDetalle(tramiteId)

  const headerName =
    detail?.colaborador_nombre?.trim() || displayNameFromEmail(user?.email) || 'Colaborador'

  return (
    <div className="flex min-h-screen flex-col bg-blue-50">
      <CollaboratorHeader
        userName={headerName}
        companyName="Portal colaborador"
        avatarInitials={initialsFromEmail(user?.email, user?.id)}
      />

      {tramiteId ? (
        <MiTramiteDetallePanel detail={detail} loading={loadingDetalle} error={errorDetalle} />
      ) : (
        <MisTramitesListPanel
          items={data?.items ?? []}
          loading={loading}
          error={error}
          page={page}
          pages={data?.pages ?? 1}
          onPageChange={setPage}
        />
      )}
    </div>
  )
}

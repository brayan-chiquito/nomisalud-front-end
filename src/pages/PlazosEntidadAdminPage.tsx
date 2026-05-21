import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { useAuth } from '@/features/auth/context/AuthContext'
import { RrhhDashboardShell } from '@/features/dashboard/components/RrhhDashboardShell'
import { listPlazosEntidad } from '@/features/admin/services/plazosEntidad.service'
import type { PlazoEntidadItem } from '@/features/admin/types/plazoEntidad'
import { buttonClassName } from '@/components/ui/buttonStyles'

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

export function PlazosEntidadAdminPage() {
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'
  const [items, setItems] = useState<readonly PlazoEntidadItem[]>([])
  const [loading, setLoading] = useState(isAdmin)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isAdmin) return
    const ac = new AbortController()
    void listPlazosEntidad(ac.signal)
      .then((res) => {
        if (!ac.signal.aborted) setItems(res.items)
      })
      .catch((e) => {
        if (!ac.signal.aborted) {
          setError(e instanceof Error ? e.message : 'No se pudo cargar la configuración.')
        }
      })
      .finally(() => {
        if (!ac.signal.aborted) setLoading(false)
      })
    return () => ac.abort()
  }, [isAdmin])

  return (
    <RrhhDashboardShell
      headerTitle="Plazos por entidad"
      userName={displayNameFromEmail(user?.email)}
      userInitials={initialsFromEmail(user?.email, user?.id)}
    >
      <Link to="/dashboard" className={`${buttonClassName('secondary', 'mb-6 gap-2')} inline-flex`}>
        <ArrowLeft className="h-4 w-4" aria-hidden />
        Volver al panel
      </Link>

      {!isAdmin ? (
        <div
          className="rounded-card border border-warning/30 bg-warning-light px-5 py-4 text-sm text-gray-800"
          role="status"
        >
          La configuración de plazos por entidad está restringida al rol{' '}
          <span className="font-medium">administrador</span>. Si necesitas consultar o modificar
          plazos, solicita acceso al equipo de administración.
        </div>
      ) : null}

      {isAdmin && loading ? (
        <p className="flex items-center gap-2 text-sm text-gray-500">
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          Cargando plazos…
        </p>
      ) : null}

      {isAdmin && error ? (
        <p className="text-sm text-danger" role="alert">
          {error}
        </p>
      ) : null}

      {isAdmin && !loading && !error ? (
        <div className="overflow-hidden rounded-card border border-gray-200/60 bg-white shadow-card">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-100 bg-gray-50/80 text-xs tracking-widest text-gray-500 uppercase">
              <tr>
                <th className="px-4 py-3 font-medium">Entidad</th>
                <th className="px-4 py-3 font-medium">Tipo</th>
                <th className="px-4 py-3 font-medium">Plazo</th>
                <th className="px-4 py-3 font-medium">Alerta (días)</th>
                <th className="px-4 py-3 font-medium">Pago prom.</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                    No hay plazos configurados.
                  </td>
                </tr>
              ) : (
                items.map((row) => (
                  <tr key={row.id} className="border-b border-gray-50 last:border-0">
                    <td className="px-4 py-3 font-medium text-gray-900">{row.entidad_nombre}</td>
                    <td className="px-4 py-3 text-gray-600">{row.tipo_incapacidad}</td>
                    <td className="px-4 py-3 text-gray-600 tabular-nums">
                      {row.valor_limite} {row.unidad_limite} ({row.dias_limite} días)
                    </td>
                    <td className="px-4 py-3 text-gray-600 tabular-nums">{row.dias_alerta}</td>
                    <td className="px-4 py-3 text-gray-600 tabular-nums">
                      {row.dias_promedio_pago ?? '—'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      ) : null}
    </RrhhDashboardShell>
  )
}

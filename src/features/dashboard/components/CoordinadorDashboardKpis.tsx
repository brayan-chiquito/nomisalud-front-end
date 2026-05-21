import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import type { LucideIcon } from 'lucide-react'
import { AlertTriangle, Brain, Clock, Percent, Settings, Tags, Wallet } from 'lucide-react'
import { useAuth } from '@/features/auth/context/AuthContext'
import {
  fetchCoordinatorKpis,
  type CoordinatorKpis,
} from '@/features/dashboard/services/coordinatorKpis.service'
import { buttonClassName } from '@/components/ui/buttonStyles'

function KpiCard({
  value,
  label,
  hint,
  icon: Icon,
  iconBg,
  iconColor,
}: Readonly<{
  value: string
  label: string
  hint?: string
  icon: LucideIcon
  iconBg: string
  iconColor: string
}>) {
  return (
    <div className="rounded-card border border-gray-200/60 bg-white p-5 shadow-card">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="mb-1 text-xs font-medium tracking-widest text-gray-400 uppercase">
            {label}
          </p>
          <p className="text-3xl font-bold text-gray-900 tabular-nums">{value}</p>
          {hint ? <p className="mt-1 text-xs text-gray-500">{hint}</p> : null}
        </div>
        <div className={`shrink-0 rounded-lg p-2.5 ${iconBg}`}>
          <Icon className={`h-4 w-4 ${iconColor}`} aria-hidden />
        </div>
      </div>
    </div>
  )
}

function formatPct(n: number | null, loading: boolean): string {
  if (loading || n === null) return '—'
  return `${n}%`
}

export function CoordinadorDashboardKpis() {
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'
  const [kpis, setKpis] = useState<CoordinatorKpis | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const ac = new AbortController()
    void fetchCoordinatorKpis(ac.signal)
      .then((d) => {
        if (!ac.signal.aborted) setKpis(d)
      })
      .catch(() => {
        if (!ac.signal.aborted) setKpis(null)
      })
      .finally(() => {
        if (!ac.signal.aborted) setLoading(false)
      })
    return () => ac.abort()
  }, [])

  const num = (
    key: keyof Pick<
      CoordinatorKpis,
      'pendientesVerificacion' | 'inconsistenciasIa' | 'pagosRetrasados'
    >,
  ) => (loading || kpis === null ? '—' : String(kpis[key]))

  return (
    <section className="mb-8" aria-labelledby="coordinador-kpis-heading">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 id="coordinador-kpis-heading" className="text-sm font-semibold text-gray-900">
            Indicadores analíticos
          </h2>
          <p className="text-xs text-gray-500">
            Métricas calculadas desde el listado de trámites (vista coordinador).
          </p>
        </div>
        {isAdmin ? (
          <Link
            to="/admin/plazos-entidad"
            className={buttonClassName('secondary', 'gap-2 text-sm')}
          >
            <Settings className="h-4 w-4" aria-hidden />
            Configuración de plazos
          </Link>
        ) : (
          <span
            className={buttonClassName('secondary', 'cursor-not-allowed gap-2 text-sm opacity-60')}
            title="Solo administradores pueden editar plazos por entidad"
          >
            <Settings className="h-4 w-4" aria-hidden />
            Configuración de plazos
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <KpiCard
          value={formatPct(kpis?.precisionExtraccionPct ?? null, loading)}
          label="Precisión extracción"
          hint="Trámites sin inconsistencia ni doc. incompleta"
          icon={Brain}
          iconBg="bg-primary/10"
          iconColor="text-primary"
        />
        <KpiCard
          value={formatPct(kpis?.tasaClasificacionPct ?? null, loading)}
          label="Tasa clasificación"
          hint="Estados post-IA vs fallos de clasificación"
          icon={Tags}
          iconBg="bg-info-light"
          iconColor="text-info"
        />
        <KpiCard
          value={num('pendientesVerificacion')}
          label="Pendientes verificación"
          icon={Clock}
          iconBg="bg-warning-light"
          iconColor="text-warning"
        />
        <KpiCard
          value={num('inconsistenciasIa')}
          label="Inconsistencias IA"
          icon={AlertTriangle}
          iconBg="bg-danger-light"
          iconColor="text-danger"
        />
        <KpiCard
          value={num('pagosRetrasados')}
          label="Pagos retrasados"
          icon={Wallet}
          iconBg="bg-gray-100"
          iconColor="text-gray-600"
        />
      </div>

      {!isAdmin ? (
        <p className="mt-3 flex items-center gap-1.5 text-xs text-gray-500">
          <Percent className="h-3 w-3 shrink-0" aria-hidden />
          La configuración de plazos por entidad requiere rol administrador.
        </p>
      ) : null}
    </section>
  )
}

import { Link } from 'react-router-dom'
import { AlertCircle, Brain, FileStack, Percent, Settings, Tags } from 'lucide-react'
import { useAuth } from '@/features/auth/context/AuthContext'
import { buttonClassName } from '@/components/ui/buttonStyles'
import { KpiCard } from '@/features/reportes/components/KpiCard'
import { EstadoDistributionChart } from '@/features/reportes/components/EstadoDistributionChart'
import { useReportesKpis } from '@/features/reportes/hooks/useReportesKpis'
import {
  formatReportesRatioPercent,
  mapPorEstadoToChartData,
  urgenciaRojoTotal,
} from '@/features/reportes/utils/reportesKpisDisplay'

function formatEntero(value: number | null | undefined, loading: boolean): string {
  if (loading || value === null || value === undefined) return '—'
  return String(value)
}

/** Panel analítico del coordinador: KPIs + gráfico por estado (SCRUM-214). */
export function CoordinadorDashboardKpis() {
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'
  const { data, loading, error } = useReportesKpis()

  const chartData = mapPorEstadoToChartData(data?.por_estado ?? [])
  const urgenciaCritica = urgenciaRojoTotal(data?.por_urgencia ?? [])

  return (
    <section className="mb-8" aria-labelledby="coordinador-kpis-heading">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 id="coordinador-kpis-heading" className="text-sm font-semibold text-gray-900">
            Indicadores analíticos
          </h2>
          <p className="text-xs text-gray-500">
            Métricas consolidadas desde el servicio de reportes del coordinador.
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

      {error ? (
        <p
          className="mb-4 rounded-lg border border-danger/20 bg-danger-light px-4 py-3 text-sm text-danger-text"
          role="alert"
        >
          {error}
        </p>
      ) : null}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Total trámites"
          value={formatEntero(data?.total_incapacidades, loading)}
          hint="Incapacidades en el universo analizado"
          icon={FileStack}
          iconBg="bg-primary/10"
          iconColor="text-primary"
          loading={loading}
        />
        <KpiCard
          label="Precisión OCR"
          value={formatReportesRatioPercent(data?.precision_ocr_promedio)}
          hint="Promedio de precisión de extracción"
          icon={Brain}
          iconBg="bg-info-light"
          iconColor="text-info"
          loading={loading}
        />
        <KpiCard
          label="Clasificación IA"
          value={formatReportesRatioPercent(data?.tasa_clasificacion_ia_correcta)}
          hint="Tasa de clasificación correcta"
          icon={Tags}
          iconBg="bg-warning-light"
          iconColor="text-warning"
          loading={loading}
        />
        <KpiCard
          label="Urgencia crítica"
          value={formatEntero(urgenciaCritica, loading)}
          hint="Trámites con urgencia roja"
          icon={AlertCircle}
          iconBg="bg-danger-light"
          iconColor="text-danger"
          loading={loading}
        />
      </div>

      <div className="mt-6">
        <EstadoDistributionChart data={chartData} loading={loading} />
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

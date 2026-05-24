import { useEffect, useState } from 'react'
import type { LucideIcon } from 'lucide-react'
import { Inbox, Search, PencilLine, CircleCheck } from 'lucide-react'
import {
  fetchIncapacidadKpis,
  type IncapacidadKpis,
} from '@/features/incapacidades/services/incapacidadKpis.service'

function KpiCard({
  value,
  label,
  icon: Icon,
  iconBg,
  iconColor,
}: Readonly<{
  value: number | null
  label: string
  icon: LucideIcon
  iconBg: string
  iconColor: string
}>) {
  return (
    <div className="rounded-card border border-gray-200/60 bg-white p-5 shadow-card">
      <div className="flex items-start justify-between">
        <div>
          <p className="mb-1 text-xs font-medium tracking-widest text-gray-400 uppercase">
            {label}
          </p>
          <p className="text-3xl font-bold text-gray-900 tabular-nums">
            {value === null ? '—' : value}
          </p>
        </div>
        <div className={`rounded-lg p-2.5 ${iconBg}`}>
          <Icon className={`h-4 w-4 ${iconColor}`} aria-hidden />
        </div>
      </div>
    </div>
  )
}

export function RrhhDashboardKpis() {
  const [kpis, setKpis] = useState<IncapacidadKpis | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const ac = new AbortController()
    void fetchIncapacidadKpis(ac.signal)
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

  const show = (n: keyof IncapacidadKpis) => (loading || kpis === null ? null : kpis[n])

  return (
    <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <KpiCard
        value={show('totalRecibidas')}
        label="Total recibidas"
        icon={Inbox}
        iconBg="bg-primary/10"
        iconColor="text-primary"
      />
      <KpiCard
        value={show('enVerificacion')}
        label="En verificación"
        icon={Search}
        iconBg="bg-info-light"
        iconColor="text-info"
      />
      <KpiCard
        value={show('transcribiendo')}
        label="Transcribiendo"
        icon={PencilLine}
        iconBg="bg-warning-light"
        iconColor="text-warning"
      />
      <KpiCard
        value={show('pagadas')}
        label="Pagadas"
        icon={CircleCheck}
        iconBg="bg-success-light"
        iconColor="text-success"
      />
    </div>
  )
}

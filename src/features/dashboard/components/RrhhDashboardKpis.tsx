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
  iconWrapClass,
  iconClass,
}: Readonly<{
  value: number | null
  label: string
  icon: LucideIcon
  iconWrapClass: string
  iconClass: string
}>) {
  return (
    <div className="flex flex-1 flex-col gap-3 rounded-xl border border-slate-100/80 bg-white p-5 shadow-[0_1px_6px_rgba(0,0,0,0.06)]">
      <div className="flex items-start justify-between gap-2">
        <p className="text-[32px] font-bold leading-none text-slate-900">
          {value === null ? '—' : value}
        </p>
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] ${iconWrapClass}`}
        >
          <Icon className={`h-[22px] w-[22px] ${iconClass}`} aria-hidden />
        </div>
      </div>
      <p className="text-[13px] text-slate-500">{label}</p>
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
    <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <KpiCard
        value={show('totalRecibidas')}
        label="Total recibidas"
        icon={Inbox}
        iconWrapClass="bg-blue-100"
        iconClass="text-blue-600"
      />
      <KpiCard
        value={show('enVerificacion')}
        label="En verificación"
        icon={Search}
        iconWrapClass="bg-amber-100"
        iconClass="text-amber-500"
      />
      <KpiCard
        value={show('transcribiendo')}
        label="Transcribiendo"
        icon={PencilLine}
        iconWrapClass="bg-violet-100"
        iconClass="text-violet-600"
      />
      <KpiCard
        value={show('pagadas')}
        label="Pagadas"
        icon={CircleCheck}
        iconWrapClass="bg-emerald-100"
        iconClass="text-emerald-600"
      />
    </div>
  )
}

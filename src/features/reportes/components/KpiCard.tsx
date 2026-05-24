import type { LucideIcon } from 'lucide-react'

export type KpiCardProps = Readonly<{
  label: string
  value: string
  hint?: string
  deltaPercent?: string | null
  icon: LucideIcon
  iconBg: string
  iconColor: string
  loading?: boolean
}>

/** Tarjeta KPI reutilizable para el panel del coordinador (SCRUM-214). */
export function KpiCard({
  label,
  value,
  hint,
  deltaPercent,
  icon: Icon,
  iconBg,
  iconColor,
  loading = false,
}: KpiCardProps) {
  const displayValue = loading ? '—' : value

  return (
    <div className="rounded-card border border-gray-200/60 bg-white p-5 shadow-card">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="mb-1 text-xs font-medium tracking-widest text-gray-400 uppercase">
            {label}
          </p>
          <p className="text-3xl font-bold text-gray-900 tabular-nums">{displayValue}</p>
          {deltaPercent ? (
            <p className="mt-1 text-xs font-medium text-primary">{deltaPercent}</p>
          ) : null}
          {hint ? <p className="mt-1 text-xs text-gray-500">{hint}</p> : null}
        </div>
        <div className={`shrink-0 rounded-lg p-2.5 ${iconBg}`}>
          <Icon className={`h-4 w-4 ${iconColor}`} aria-hidden />
        </div>
      </div>
    </div>
  )
}

import type { LucideIcon } from 'lucide-react'
import { AlertTriangle, CircleDollarSign, Receipt, Scale, Wallet } from 'lucide-react'
import type { ConciliacionResponse } from '../types/conciliacion'
import { formatMontoConciliacion } from '../utils/conciliacionDisplay'

function KpiCard({
  label,
  value,
  icon: Icon,
  iconBg,
  iconColor,
}: Readonly<{
  label: string
  value: string
  icon: LucideIcon
  iconBg: string
  iconColor: string
}>) {
  return (
    <div className="rounded-card border border-gray-200/60 bg-white p-5 shadow-card">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="mb-1 text-xs font-medium tracking-widest text-gray-400 uppercase">
            {label}
          </p>
          <p className="text-xl font-bold text-gray-900 tabular-nums sm:text-2xl">{value}</p>
        </div>
        <div className={`shrink-0 rounded-lg p-2.5 ${iconBg}`}>
          <Icon className={`h-4 w-4 ${iconColor}`} aria-hidden />
        </div>
      </div>
    </div>
  )
}

export type ConciliacionKpisProps = Readonly<{
  data: ConciliacionResponse | null
  loading: boolean
}>

export function ConciliacionKpis({ data, loading }: ConciliacionKpisProps) {
  if (loading && !data) {
    return (
      <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2 xl:grid-cols-5 sm:px-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="h-[88px] animate-pulse rounded-card border border-gray-200/60 bg-gray-100"
          />
        ))}
      </div>
    )
  }

  if (!data) return null

  return (
    <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2 xl:grid-cols-5 sm:px-6">
      <KpiCard
        label="Total cobrado"
        value={formatMontoConciliacion(data.total_cobrado)}
        icon={Wallet}
        iconBg="bg-primary/10"
        iconColor="text-primary"
      />
      <KpiCard
        label="Total pagado"
        value={formatMontoConciliacion(data.total_pagado)}
        icon={Receipt}
        iconBg="bg-success-light"
        iconColor="text-success"
      />
      <KpiCard
        label="Diferencia"
        value={formatMontoConciliacion(data.diferencia)}
        icon={Scale}
        iconBg="bg-warning-light"
        iconColor="text-warning"
      />
      <KpiCard
        label="Cobradas en periodo"
        value={String(data.cantidad_cobrada_periodo)}
        icon={CircleDollarSign}
        iconBg="bg-info-light"
        iconColor="text-info"
      />
      <KpiCard
        label="Pendientes de pago"
        value={String(data.cantidad_pendiente_pago)}
        icon={AlertTriangle}
        iconBg="bg-danger-light"
        iconColor="text-danger"
      />
    </div>
  )
}

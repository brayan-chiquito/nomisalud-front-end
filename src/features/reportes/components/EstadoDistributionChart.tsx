import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { EstadoChartDatum } from '../utils/reportesKpisDisplay'
import { Card } from '@/components/ui/Card'
import { Loader2 } from 'lucide-react'

export type EstadoDistributionChartProps = Readonly<{
  data: readonly EstadoChartDatum[]
  loading: boolean
}>

type TooltipPayload = Readonly<{
  payload?: Readonly<{ label?: string; total?: number }>
}>

function ChartTooltipContent({
  active,
  payload,
}: Readonly<{
  active?: boolean
  payload?: readonly TooltipPayload[]
}>) {
  if (!active || !payload?.length) return null
  const row = payload[0]?.payload
  if (!row) return null
  return (
    <div className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm shadow-md">
      <p className="font-medium text-gray-900">{row.label}</p>
      <p className="tabular-nums text-gray-600">{row.total} trámites</p>
    </div>
  )
}

/** Distribución de trámites por estado (Recharts). */
export function EstadoDistributionChart({ data, loading }: EstadoDistributionChartProps) {
  return (
    <Card className="overflow-hidden p-5 sm:p-6">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-gray-900">Distribución por estado</h3>
        <p className="text-xs text-gray-500">Volumen de trámites según el estado actual.</p>
      </div>

      {loading && data.length === 0 ? (
        <div className="flex h-64 flex-col items-center justify-center gap-2 text-slate-500">
          <Loader2 className="h-8 w-8 animate-spin text-primary" aria-hidden />
          <span className="text-sm">Cargando gráfico…</span>
        </div>
      ) : data.length === 0 ? (
        <p className="flex h-64 items-center justify-center text-sm text-gray-500">
          No hay datos de estados para mostrar.
        </p>
      ) : (
        <div
          className="h-64 w-full min-w-0"
          aria-label="Gráfico de barras: trámites por estado"
          role="img"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={[...data]} margin={{ top: 8, right: 8, left: 0, bottom: 48 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 11, fill: '#64748b' }}
                interval={0}
                angle={-32}
                textAnchor="end"
                height={56}
              />
              <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#64748b' }} width={40} />
              <Tooltip
                content={<ChartTooltipContent />}
                cursor={{ fill: 'rgba(59, 130, 246, 0.08)' }}
              />
              <Bar dataKey="total" radius={[4, 4, 0, 0]} maxBarSize={48}>
                {data.map((row) => (
                  <Cell key={row.estado} fill={row.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  )
}

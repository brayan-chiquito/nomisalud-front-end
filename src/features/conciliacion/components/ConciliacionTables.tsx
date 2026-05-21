import { formatFechaConciliacion, formatMontoConciliacion } from '../utils/conciliacionDisplay'
import type { ConciliacionDetalleItem, ConciliacionPendienteItem } from '../types/conciliacion'
import { Card } from '@/components/ui/Card'
import { ListPanelBody } from '@/components/ui/ListPanelBody'
import { StatusBadge } from '@/components/ui/StatusBadge'

const PENDIENTES_GRID =
  'minmax(0, 1fr) minmax(0, 1.2fr) minmax(0, 1fr) minmax(0, 100px) minmax(0, 110px) minmax(0, 110px)'

const DETALLE_GRID =
  'minmax(0, 1fr) minmax(0, 88px) minmax(0, 1.1fr) minmax(0, 1fr) minmax(0, 100px) minmax(0, 110px) minmax(0, 120px) minmax(0, 88px)'

function TableHeader({
  columns,
  gridTemplateColumns,
}: Readonly<{ columns: readonly string[]; gridTemplateColumns: string }>) {
  return (
    <div
      className="grid h-11 items-center gap-x-2 border-b border-gray-100 bg-gray-50/80 px-5 text-[11px] font-semibold tracking-wider text-gray-400 uppercase"
      style={{ gridTemplateColumns }}
    >
      {columns.map((col) => (
        <span key={col} className="min-w-0">
          {col}
        </span>
      ))}
    </div>
  )
}

export type ConciliacionTablesProps = Readonly<{
  pendientes: readonly ConciliacionPendienteItem[]
  detalle: readonly ConciliacionDetalleItem[]
  loading: boolean
  hasData: boolean
}>

export function ConciliacionTables({
  pendientes,
  detalle,
  loading,
  hasData,
}: ConciliacionTablesProps) {
  if (!hasData && !loading) return null

  return (
    <div className="flex flex-col gap-6 px-5 pb-6 sm:px-6">
      <Card className="overflow-hidden">
        <div className="border-b border-gray-100 px-5 py-4">
          <h3 className="text-base font-semibold text-gray-900">Por liquidar</h3>
          <p className="text-sm text-gray-500">
            Trámites en cobrada sin pago registrado en el periodo.
          </p>
        </div>
        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            <TableHeader
              columns={['Radicado', 'Colaborador', 'Entidad', 'Tipo', 'Recepción', 'Cobrada']}
              gridTemplateColumns={PENDIENTES_GRID}
            />
            <ListPanelBody
              loading={loading}
              items={pendientes}
              emptyMessage="No hay pendientes de liquidación para este periodo."
              renderItem={(row) => (
                <div
                  key={row.id}
                  className="grid h-12 items-center gap-x-2 border-b border-gray-50 px-5 text-sm"
                  style={{ gridTemplateColumns: PENDIENTES_GRID }}
                >
                  <span className="font-mono text-xs text-gray-700">{row.radicado}</span>
                  <span className="truncate">{row.colaborador_nombre ?? '—'}</span>
                  <span className="truncate text-slate-600">{row.entidad_nombre ?? '—'}</span>
                  <span className="truncate text-slate-500">
                    {row.incapacidad_tipo_extraido ?? '—'}
                  </span>
                  <span className="text-slate-500">
                    {formatFechaConciliacion(row.fecha_recepcion)}
                  </span>
                  <span className="text-slate-500">
                    {formatFechaConciliacion(row.fecha_cobrada)}
                  </span>
                </div>
              )}
            />
          </div>
        </div>
      </Card>

      <Card className="overflow-hidden">
        <div className="border-b border-gray-100 px-5 py-4">
          <h3 className="text-base font-semibold text-gray-900">Detalle del periodo</h3>
          <p className="text-sm text-gray-500">
            Movimientos consolidados con estado de liquidación.
          </p>
        </div>
        <div className="overflow-x-auto">
          <div className="min-w-[960px]">
            <TableHeader
              columns={[
                'Radicado',
                'Estado',
                'Colaborador',
                'Entidad',
                'Tipo',
                'Recepción',
                'Monto pagado',
                'Liquidado',
              ]}
              gridTemplateColumns={DETALLE_GRID}
            />
            <ListPanelBody
              loading={loading}
              items={detalle}
              emptyMessage="No hay detalle para el periodo seleccionado."
              renderItem={(row) => (
                <div
                  key={row.id}
                  className="grid h-12 items-center gap-x-2 border-b border-gray-50 px-5 text-sm"
                  style={{ gridTemplateColumns: DETALLE_GRID }}
                >
                  <span className="font-mono text-xs text-gray-700">{row.radicado}</span>
                  <span>
                    <StatusBadge estado={row.estado} />
                  </span>
                  <span className="truncate">{row.colaborador_nombre ?? '—'}</span>
                  <span className="truncate text-slate-600">{row.entidad_nombre ?? '—'}</span>
                  <span className="truncate text-slate-500">
                    {row.incapacidad_tipo_extraido ?? '—'}
                  </span>
                  <span className="text-slate-500">
                    {formatFechaConciliacion(row.fecha_recepcion)}
                  </span>
                  <span className="tabular-nums text-slate-700">
                    {row.monto_pagado ? formatMontoConciliacion(row.monto_pagado) : '—'}
                  </span>
                  <span className="text-xs text-gray-600">{row.liquidado ? 'Sí' : 'No'}</span>
                </div>
              )}
            />
          </div>
        </div>
      </Card>
    </div>
  )
}

import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'
import type { AuditoriaAccesoItem } from '../types/auditoriaAcceso'
import {
  formatAuditoriaTimestamp,
  usuarioAuditoriaLabel,
  usuarioAuditoriaTooltip,
} from '../utils/auditoriaDisplay'
import { cn } from '@/utils/cn'

const TABLE_GRID =
  'minmax(0, 1.1fr) minmax(0, 2fr) minmax(0, 1fr) minmax(0, 110px) minmax(0, 140px)'

export type AuditoriaTableProps = Readonly<{
  items: readonly AuditoriaAccesoItem[]
  loading: boolean
  page: number
  total: number
  totalPages: number
  pageSize: number
  onPageChange: (page: number) => void
  onFiltrarPorUsuario?: (row: AuditoriaAccesoItem) => void
}>

function paginationRange(page: number, pageSize: number, total: number) {
  const start = total === 0 ? 0 : (page - 1) * pageSize + 1
  const end = total === 0 ? 0 : Math.min(page * pageSize, total)
  return { start, end }
}

type AuditoriaTableBodyProps = Readonly<{
  loading: boolean
  items: readonly AuditoriaAccesoItem[]
  onFiltrarPorUsuario?: (row: AuditoriaAccesoItem) => void
}>

function AuditoriaTableBody({ loading, items, onFiltrarPorUsuario }: AuditoriaTableBodyProps) {
  if (loading && items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-16 text-slate-500">
        <Loader2 className="h-8 w-8 animate-spin text-primary" aria-hidden />
        <span className="text-sm">Cargando registros…</span>
      </div>
    )
  }
  if (items.length === 0) {
    return (
      <p className="py-12 text-center text-sm text-slate-500">
        No hay registros con los filtros seleccionados.
      </p>
    )
  }
  return (
    <div className={cn(loading && items.length > 0 && 'pointer-events-none opacity-60')}>
      {items.map((row) => (
        <div
          key={row.id}
          className="grid h-14 items-center gap-x-2 border-b border-gray-50 px-5 text-sm hover:bg-gray-50/60"
          style={{ gridTemplateColumns: TABLE_GRID }}
        >
          {onFiltrarPorUsuario && (row.usuario_email || row.usuario_nombre) ? (
            <button
              type="button"
              className="min-w-0 truncate text-left font-medium text-gray-900 underline-offset-2 hover:text-primary hover:underline"
              title={`${usuarioAuditoriaTooltip(row)} — Clic para filtrar por este usuario`}
              onClick={() => onFiltrarPorUsuario(row)}
            >
              {usuarioAuditoriaLabel(row)}
            </button>
          ) : (
            <span
              className="min-w-0 truncate font-medium text-gray-900"
              title={usuarioAuditoriaTooltip(row)}
            >
              {usuarioAuditoriaLabel(row)}
            </span>
          )}
          <span className="min-w-0 truncate font-mono text-xs text-slate-600" title={row.accion}>
            {row.accion}
          </span>
          <span className="min-w-0 truncate text-slate-500" title={row.recurso_id ?? undefined}>
            {row.recurso_id ?? '—'}
          </span>
          <span className="min-w-0 truncate text-slate-500">{row.ip ?? '—'}</span>
          <span className="min-w-0 truncate text-slate-500 tabular-nums">
            {formatAuditoriaTimestamp(row.timestamp)}
          </span>
        </div>
      ))}
    </div>
  )
}

export function AuditoriaTable({
  items,
  loading,
  page,
  total,
  totalPages,
  pageSize,
  onPageChange,
  onFiltrarPorUsuario,
}: AuditoriaTableProps) {
  const { start, end } = paginationRange(page, pageSize, total)
  const canPrev = page > 1 && !loading
  const canNext = totalPages > 0 && page < totalPages && !loading

  return (
    <>
      <div className="min-h-0 flex-1 overflow-x-auto">
        <div className="min-w-[960px]">
          <div
            className="grid h-11 items-center gap-x-2 border-b border-gray-100 bg-gray-50/80 px-5 text-[11px] font-semibold tracking-wider text-gray-400 uppercase"
            style={{ gridTemplateColumns: TABLE_GRID }}
          >
            <span>Usuario</span>
            <span>Acción</span>
            <span>Recurso</span>
            <span>IP</span>
            <span>Fecha</span>
          </div>

          <AuditoriaTableBody
            loading={loading}
            items={items}
            onFiltrarPorUsuario={onFiltrarPorUsuario}
          />
        </div>
      </div>

      <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-5 py-3 sm:px-6">
        <p className="text-[13px] text-slate-500">
          Mostrando {start} - {end} de {total} resultados ({pageSize} por página)
        </p>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            disabled={!canPrev}
            onClick={() => onPageChange(Math.max(1, page - 1))}
            className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-30"
            aria-label="Página anterior"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <span className="flex h-8 min-w-8 items-center justify-center rounded-md bg-blue-600 px-2 text-[13px] font-semibold text-white tabular-nums">
            {totalPages === 0 ? 0 : page}
          </span>
          <span className="text-xs text-slate-400">/ {totalPages || 0}</span>
          <button
            type="button"
            disabled={!canNext}
            onClick={() => onPageChange(page + 1)}
            className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-30"
            aria-label="Página siguiente"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </footer>
    </>
  )
}

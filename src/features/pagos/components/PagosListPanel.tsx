import { useCallback, useEffect, useState } from 'react'
import axios from 'axios'
import { Search } from 'lucide-react'
import { listPagos } from '../services/pagos.service'
import type { PagoListItem } from '../types/pago'
import {
  fechaPagoIso,
  formatFechaPago,
  formatMontoPago,
  labelEstadoPago,
} from '../utils/pagoDisplay'
import { Card } from '@/components/ui/Card'
import { ListPanelBody } from '@/components/ui/ListPanelBody'
import { ListPaginationFooter } from '@/components/ui/ListPaginationFooter'
import { messageFromLoadError } from '@/utils/messageFromLoadError'
import { pageSizeFromResponse, paginationRange } from '@/utils/pagination'
import { useAbortableEffect } from '@/hooks/useAbortableEffect'

const LOAD_ERROR_FALLBACK = 'No se pudo cargar el listado de pagos.'

export type PagosListPanelProps = Readonly<{
  refreshToken?: number
}>

/**
 * Tabla de histórico desde `GET /api/v1/pagos`.
 */
export function PagosListPanel({ refreshToken = 0 }: PagosListPanelProps) {
  const [items, setItems] = useState<readonly PagoListItem[]>([])
  const [total, setTotal] = useState(0)
  const [pages, setPages] = useState(0)
  const [page, setPage] = useState(1)
  const [entidadFiltro, setEntidadFiltro] = useState('')
  const [entidadDebounced, setEntidadDebounced] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const t = globalThis.setTimeout(() => setEntidadDebounced(entidadFiltro.trim()), 350)
    return () => globalThis.clearTimeout(t)
  }, [entidadFiltro])

  useEffect(() => {
    setPage(1)
  }, [entidadDebounced])

  const load = useCallback(
    async (signal: AbortSignal) => {
      setLoading(true)
      setError(null)
      try {
        const res = await listPagos({
          page,
          ...(entidadDebounced ? { entidad: entidadDebounced } : {}),
          signal,
        })
        if (!signal.aborted) {
          setItems(res.items)
          setTotal(res.total)
          setPages(res.pages)
        }
      } catch (e) {
        if (signal.aborted || axios.isCancel(e)) return
        setItems([])
        setTotal(0)
        setPages(0)
        setError(messageFromLoadError(e, LOAD_ERROR_FALLBACK))
      } finally {
        if (!signal.aborted) setLoading(false)
      }
    },
    [page, entidadDebounced],
  )

  useAbortableEffect(load, [load, refreshToken])

  const pageSize = pageSizeFromResponse(total, pages, items.length)
  const { start, end } = paginationRange(total, page, pageSize)
  return (
    <Card className="mt-6 overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 px-5 py-4 sm:px-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Historial de pagos</h2>
          <p className="text-sm text-gray-500">Entidad, referencia, monto y fecha por operación.</p>
        </div>
        <div className="relative flex min-w-[200px] max-w-xs flex-1 items-center">
          <Search className="absolute left-3 h-4 w-4 shrink-0 text-gray-400" aria-hidden />
          <input
            type="search"
            value={entidadFiltro}
            onChange={(e) => setEntidadFiltro(e.target.value)}
            disabled={loading}
            placeholder="Filtrar por entidad…"
            className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pr-3 pl-9 text-sm placeholder:text-gray-400 focus:border-primary/50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:outline-none"
            aria-label="Filtrar pagos por entidad"
          />
        </div>
      </div>

      {error ? (
        <p className="mx-5 my-3 border border-danger/20 bg-danger-light px-4 py-3 text-sm text-danger-text sm:mx-6">
          {error}
        </p>
      ) : null}

      <div className="overflow-x-auto">
        <div className="min-w-[720px]">
          <div
            className="grid h-11 items-center gap-x-3 border-b border-gray-100 bg-gray-50/80 px-5 text-[11px] font-semibold tracking-wider text-gray-400 uppercase sm:px-6"
            style={{
              gridTemplateColumns:
                'minmax(0, 1.2fr) minmax(0, 1fr) minmax(0, 120px) minmax(0, 160px) minmax(0, 100px)',
            }}
          >
            <span>Entidad</span>
            <span>Referencia</span>
            <span className="text-right sm:text-left">Monto</span>
            <span>Fecha</span>
            <span>Estado</span>
          </div>

          <ListPanelBody
            loading={loading}
            items={items}
            emptyMessage="Aún no hay pagos registrados."
            renderItem={(row) => (
              <div
                key={row.id}
                className="grid items-center gap-x-3 border-b border-gray-50 px-5 py-3 text-sm sm:px-6"
                style={{
                  gridTemplateColumns:
                    'minmax(0, 1.2fr) minmax(0, 1fr) minmax(0, 120px) minmax(0, 160px) minmax(0, 100px)',
                }}
              >
                <span className="truncate font-medium text-gray-900" title={row.entidad_origen}>
                  {row.entidad_origen}
                </span>
                <span className="truncate font-mono text-xs text-gray-700" title={row.referencia}>
                  {row.referencia}
                </span>
                <span className="text-right tabular-nums text-gray-800 sm:text-left">
                  {formatMontoPago(row.monto)}
                </span>
                <span className="truncate text-slate-600" title={fechaPagoIso(row)}>
                  {formatFechaPago(fechaPagoIso(row))}
                </span>
                <span className="text-xs text-gray-600">{labelEstadoPago(row.estado)}</span>
              </div>
            )}
          />
        </div>
      </div>

      <ListPaginationFooter
        start={start}
        end={end}
        total={total}
        page={page}
        totalPages={pages}
        loading={loading}
        onPrev={() => setPage((p) => Math.max(1, p - 1))}
        onNext={() => setPage((p) => p + 1)}
        pageBadgeClassName="bg-primary"
      />
    </Card>
  )
}

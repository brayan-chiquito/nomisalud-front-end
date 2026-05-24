import { useCallback, useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { IncapacidadEntidadSearchField } from '@/features/incapacidades/components/IncapacidadEntidadSearchField'
import { listPagos, listPagosWithTextSearch } from '../services/pagos.service'
import type { PagoListItem } from '../types/pago'
import {
  fechaPagoIso,
  formatFechaPago,
  formatMontoPago,
  labelEstadoPago,
} from '../utils/pagoDisplay'
import { Card } from '@/components/ui/Card'
import { ListFetchIndicator } from '@/components/ui/ListFetchIndicator'
import { useStableTableRowCount } from '@/hooks/useStableTableRowCount'
import { ListPanelBody } from '@/components/ui/ListPanelBody'
import { ListPaginationFooter } from '@/components/ui/ListPaginationFooter'
import { messageFromLoadError } from '@/utils/messageFromLoadError'
import { pageSizeFromResponse, paginationRange } from '@/utils/pagination'
import { useAbortableEffect } from '@/hooks/useAbortableEffect'
import { awaitMinBusyDuration } from '@/utils/awaitMinBusyDuration'

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
  const [fetching, setFetching] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const hasLoadedOnceRef = useRef(false)

  useEffect(() => {
    const t = globalThis.setTimeout(() => setEntidadDebounced(entidadFiltro.trim()), 350)
    return () => globalThis.clearTimeout(t)
  }, [entidadFiltro])

  useEffect(() => {
    setPage(1)
  }, [entidadDebounced])

  const load = useCallback(
    async (signal: AbortSignal) => {
      const busyStartedAt = Date.now()
      if (hasLoadedOnceRef.current) setFetching(true)
      else setLoading(true)
      setError(null)
      try {
        const res = entidadDebounced
          ? await listPagosWithTextSearch({ page, signal }, entidadDebounced)
          : await listPagos({ page, signal })
        if (!signal.aborted) {
          if (hasLoadedOnceRef.current) await awaitMinBusyDuration(busyStartedAt, signal)
        }
        if (!signal.aborted) {
          hasLoadedOnceRef.current = true
          setItems(res.items)
          setTotal(res.total)
          setPages(res.pages)
        }
      } catch (e) {
        if (signal.aborted || axios.isCancel(e)) return
        hasLoadedOnceRef.current = false
        setItems([])
        setTotal(0)
        setPages(0)
        setError(messageFromLoadError(e, LOAD_ERROR_FALLBACK))
      } finally {
        if (!signal.aborted) {
          setLoading(false)
          setFetching(false)
        }
      }
    },
    [page, entidadDebounced],
  )

  useAbortableEffect(load, [load, refreshToken])

  const stableRowCount = useStableTableRowCount(items.length, fetching)
  const pageSize = pageSizeFromResponse(total, pages, items.length)
  const { start, end } = paginationRange(total, page, pageSize)
  return (
    <Card className="mt-6 overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 px-5 py-4 sm:px-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Historial de pagos</h2>
          <p className="text-sm text-gray-500">Entidad, referencia, monto y fecha por operación.</p>
        </div>
        <IncapacidadEntidadSearchField
          value={entidadFiltro}
          onChange={setEntidadFiltro}
          suggestionSources="pagos"
          entidadPlaceholder="Filtrar por entidad u origen…"
          entidadAriaLabel="Filtrar pagos por entidad"
          className="min-w-[200px] max-w-xs flex-1"
        />
      </div>

      {error ? (
        <p className="mx-5 my-3 border border-danger/20 bg-danger-light px-4 py-3 text-sm text-danger-text sm:mx-6">
          {error}
        </p>
      ) : null}

      <ListFetchIndicator active={fetching} label="Actualizando resultados…" />

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
            fetching={fetching}
            stableRowCount={stableRowCount}
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
                <span className="text-right font-medium tabular-nums text-gray-900 sm:text-left">
                  {formatMontoPago(row.monto)}
                </span>
                <span className="truncate text-gray-600" title={fechaPagoIso(row)}>
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
        loading={loading || fetching}
        onPrev={() => setPage((p) => Math.max(1, p - 1))}
        onNext={() => setPage((p) => p + 1)}
        pageBadgeClassName="bg-primary"
      />
    </Card>
  )
}

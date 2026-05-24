import type { ReactNode } from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '@/utils/cn'

/** Altura aproximada de una fila de tabla (h-14 en cobro/dashboard). */
const ROW_HEIGHT_PX = 56

export type ListPanelBodyProps<T> = Readonly<{
  loading: boolean
  /** Actualización en segundo plano: mantiene filas y altura estable. */
  fetching?: boolean
  items: readonly T[]
  emptyMessage: string
  renderItem: (item: T) => ReactNode
  /** Altura mínima en filas durante `fetching` (evita salto al cambiar resultados). */
  stableRowCount?: number
}>

function minHeightForRows(rowCount: number): number | undefined {
  if (rowCount <= 0) return 120
  return Math.max(120, rowCount * ROW_HEIGHT_PX)
}

/** Evita ternarios anidados loading / vacío / filas en tablas paginadas. */
export function ListPanelBody<T>({
  loading,
  fetching = false,
  items,
  emptyMessage,
  renderItem,
  stableRowCount,
}: ListPanelBodyProps<T>): ReactNode {
  if (loading) {
    return (
      <div className="flex min-h-[220px] flex-col items-center justify-center gap-2 py-16 text-slate-500">
        <Loader2 className="h-8 w-8 animate-spin text-primary" aria-hidden />
        <span className="text-sm">Cargando…</span>
      </div>
    )
  }

  const displayRows = Math.max(items.length, fetching ? (stableRowCount ?? items.length) : 0)
  const minH = minHeightForRows(displayRows)

  if (items.length === 0 && !fetching) {
    return (
      <p className="min-h-[120px] px-6 py-12 text-center text-sm text-slate-500">{emptyMessage}</p>
    )
  }

  if (items.length === 0 && fetching) {
    return (
      <div
        className="flex flex-col items-center justify-center gap-2 py-10 text-slate-500"
        style={{ minHeight: minH }}
      >
        <Loader2 className="h-6 w-6 animate-spin text-primary" aria-hidden />
        <span className="text-sm">Buscando…</span>
      </div>
    )
  }

  return (
    <div className="relative" style={{ minHeight: minH }} aria-busy={fetching}>
      {fetching ? (
        <div
          className="pointer-events-none absolute inset-0 z-10 bg-white/40 dark:bg-gray-50/40"
          aria-hidden
        />
      ) : null}
      <div className={cn(fetching && 'opacity-70')}>{items.map(renderItem)}</div>
    </div>
  )
}

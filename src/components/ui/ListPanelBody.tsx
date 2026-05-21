import type { ReactNode } from 'react'
import { Loader2 } from 'lucide-react'

export type ListPanelBodyProps<T> = Readonly<{
  loading: boolean
  items: readonly T[]
  emptyMessage: string
  renderItem: (item: T) => ReactNode
}>

/** Evita ternarios anidados loading / vacío / filas en tablas paginadas. */
export function ListPanelBody<T>({
  loading,
  items,
  emptyMessage,
  renderItem,
}: ListPanelBodyProps<T>): ReactNode {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-16 text-slate-500">
        <Loader2 className="h-8 w-8 animate-spin text-primary" aria-hidden />
        <span className="text-sm">Cargando…</span>
      </div>
    )
  }
  if (items.length === 0) {
    return <p className="px-6 py-12 text-center text-sm text-slate-500">{emptyMessage}</p>
  }
  return <>{items.map(renderItem)}</>
}

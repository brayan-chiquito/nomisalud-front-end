import { Loader2 } from 'lucide-react'
import type { RadicadoDisponible } from '../types/radicadoDisponible'
import { radicadoDisponibleSubtitle } from '../utils/radicadoDisponibleDisplay'

export type CobradasCheckboxListProps = Readonly<{
  loading: boolean
  items: readonly RadicadoDisponible[]
  selectedRadicados: ReadonlySet<string>
  submitting: boolean
  emptyMessage: string
  onToggle: (radicado: string) => void
}>

export function CobradasCheckboxList({
  loading,
  items,
  selectedRadicados,
  submitting,
  emptyMessage,
  onToggle,
}: CobradasCheckboxListProps) {
  if (loading) {
    return (
      <div className="flex items-center gap-2 px-3 py-4 text-sm text-gray-500">
        <Loader2 className="h-4 w-4 animate-spin text-primary" aria-hidden />
        Cargando radicados disponibles…
      </div>
    )
  }
  if (items.length === 0) {
    return <p className="px-3 py-4 text-sm text-gray-500">{emptyMessage}</p>
  }
  return (
    <ul className="divide-y divide-gray-100">
      {items.map((row) => {
        const subtitle = radicadoDisponibleSubtitle(row)
        return (
          <li
            key={row.incapacidad_id}
            className="flex items-start gap-3 px-3 py-2.5 hover:bg-white/80"
          >
            <input
              type="checkbox"
              id={`rad-${row.radicado}`}
              checked={selectedRadicados.has(row.radicado)}
              onChange={() => onToggle(row.radicado)}
              disabled={submitting}
              className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary/30"
            />
            <label htmlFor={`rad-${row.radicado}`} className="min-w-0 flex-1 cursor-pointer">
              <span className="font-mono text-xs text-gray-800">{row.radicado}</span>
              {subtitle ? (
                <span className="mt-0.5 block text-xs text-gray-500">{subtitle}</span>
              ) : null}
            </label>
          </li>
        )
      })}
    </ul>
  )
}

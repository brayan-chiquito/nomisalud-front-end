import { Loader2, Pencil, Trash2 } from 'lucide-react'
import { buttonClassName } from '@/components/ui/buttonStyles'
import type { PlazoEntidadItem } from '../../types/plazoEntidad'
import {
  formatDiasPromedioPago,
  formatPlazoLimite,
  labelTipoIncapacidad,
} from '../../utils/plazoEntidadDisplay'
import { cn } from '@/utils/cn'

export type PlazosEntidadTableProps = Readonly<{
  items: readonly PlazoEntidadItem[]
  loading: boolean
  onEdit: (item: PlazoEntidadItem) => void
  onDelete: (item: PlazoEntidadItem) => void
}>

export function PlazosEntidadTable({ items, loading, onEdit, onDelete }: PlazosEntidadTableProps) {
  const initialLoad = loading && items.length === 0
  const refreshing = loading && items.length > 0

  return (
    <div
      className={cn('overflow-x-auto transition-opacity duration-150', refreshing && 'opacity-60')}
    >
      <table className="w-full min-w-[760px] text-left text-sm">
        <thead className="border-b border-gray-100 bg-gray-50/80 text-xs tracking-widest text-gray-500 uppercase">
          <tr>
            <th className="px-4 py-3 font-medium">Entidad</th>
            <th className="px-4 py-3 font-medium">Tipo</th>
            <th className="px-4 py-3 font-medium">Plazo</th>
            <th className="px-4 py-3 font-medium">Alerta</th>
            <th className="px-4 py-3 font-medium">Pago prom.</th>
            <th className="px-4 py-3 font-medium text-right">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {initialLoad ? (
            <tr>
              <td colSpan={6} className="px-4 py-10 text-center text-gray-500">
                <Loader2 className="mx-auto mb-2 h-5 w-5 animate-spin" aria-hidden />
                Cargando plazos…
              </td>
            </tr>
          ) : items.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-4 py-10 text-center text-gray-500">
                No hay plazos configurados.
              </td>
            </tr>
          ) : (
            items.map((row) => (
              <tr key={row.id} className="border-b border-gray-50 last:border-0">
                <td className="px-4 py-3 font-medium text-gray-900">{row.entidad_nombre}</td>
                <td className="px-4 py-3 text-gray-600">
                  {labelTipoIncapacidad(row.tipo_incapacidad)}
                </td>
                <td className="px-4 py-3 text-gray-600 tabular-nums">{formatPlazoLimite(row)}</td>
                <td className="px-4 py-3 text-gray-600 tabular-nums">{row.dias_alerta}</td>
                <td className="px-4 py-3 text-gray-600 tabular-nums">
                  {formatDiasPromedioPago(row.dias_promedio_pago)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1">
                    <button
                      type="button"
                      onClick={() => onEdit(row)}
                      className={buttonClassName('ghost', 'gap-1.5 px-2')}
                      aria-label={`Editar plazo de ${row.entidad_nombre}`}
                    >
                      <Pencil className="h-4 w-4" aria-hidden />
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(row)}
                      className={buttonClassName(
                        'ghost',
                        'gap-1.5 px-2 text-danger hover:bg-danger-light',
                      )}
                      aria-label={`Eliminar plazo de ${row.entidad_nombre}`}
                    >
                      <Trash2 className="h-4 w-4" aria-hidden />
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

import { Search } from 'lucide-react'
import { labelClassName } from '@/components/ui/buttonStyles'
import { AUDITORIA_PAGE_SIZE } from '../services/listAuditoriaAccesos.service'

export type AuditoriaFiltersProps = Readonly<{
  userId: string
  accion: string
  fechaDesde: string
  fechaHasta: string
  loading: boolean
  onUserIdChange: (value: string) => void
  onAccionChange: (value: string) => void
  onFechaDesdeChange: (value: string) => void
  onFechaHastaChange: (value: string) => void
}>

const inputClassName =
  'w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-50'

export function AuditoriaFilters({
  userId,
  accion,
  fechaDesde,
  fechaHasta,
  loading,
  onUserIdChange,
  onAccionChange,
  onFechaDesdeChange,
  onFechaHastaChange,
}: AuditoriaFiltersProps) {
  return (
    <div className="flex flex-col gap-4 border-b border-gray-100 bg-gray-50/50 px-5 py-4 sm:px-6">
      <p className="text-xs text-gray-500">
        Filtra por usuario (UUID), tipo de acción o rango de fechas. Se muestran hasta{' '}
        {AUDITORIA_PAGE_SIZE} registros por página.
      </p>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="auditoria-user-id" className={labelClassName}>
            Usuario (ID)
          </label>
          <input
            id="auditoria-user-id"
            type="text"
            value={userId}
            onChange={(e) => onUserIdChange(e.target.value)}
            disabled={loading}
            placeholder="UUID del usuario"
            className={inputClassName}
            autoComplete="off"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="auditoria-accion" className={labelClassName}>
            Acción
          </label>
          <div className="relative">
            <Search
              className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400"
              aria-hidden
            />
            <input
              id="auditoria-accion"
              type="search"
              value={accion}
              onChange={(e) => onAccionChange(e.target.value)}
              disabled={loading}
              placeholder="Ej. GET /incapacidades"
              className={`${inputClassName} pl-9`}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="auditoria-desde" className={labelClassName}>
            Desde
          </label>
          <input
            id="auditoria-desde"
            type="date"
            value={fechaDesde}
            onChange={(e) => onFechaDesdeChange(e.target.value)}
            disabled={loading}
            className={inputClassName}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="auditoria-hasta" className={labelClassName}>
            Hasta
          </label>
          <input
            id="auditoria-hasta"
            type="date"
            value={fechaHasta}
            onChange={(e) => onFechaHastaChange(e.target.value)}
            disabled={loading}
            min={fechaDesde || undefined}
            className={inputClassName}
          />
        </div>
      </div>
    </div>
  )
}

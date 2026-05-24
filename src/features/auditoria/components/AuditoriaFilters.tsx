import { Search } from 'lucide-react'
import { inputClassName, labelClassName } from '@/components/ui/buttonStyles'
import { AUDITORIA_PAGE_SIZE } from '../services/listAuditoriaAccesos.service'
import { AuditoriaUsuarioSearchField } from './AuditoriaUsuarioSearchField'
import type { UsuarioAuditoriaOption } from '../utils/auditoriaUsuarioSearch'

export type AuditoriaFiltersProps = Readonly<{
  usuario: string
  accion: string
  fechaDesde: string
  fechaHasta: string
  onUsuarioChange: (value: string) => void
  onSelectUsuario: (option: UsuarioAuditoriaOption) => void
  onAccionChange: (value: string) => void
  onFechaDesdeChange: (value: string) => void
  onFechaHastaChange: (value: string) => void
}>

export function AuditoriaFilters({
  usuario,
  accion,
  fechaDesde,
  fechaHasta,
  onUsuarioChange,
  onSelectUsuario,
  onAccionChange,
  onFechaDesdeChange,
  onFechaHastaChange,
}: AuditoriaFiltersProps) {
  return (
    <div className="flex flex-col gap-4 border-b border-gray-100 bg-gray-50/50 px-5 py-4 sm:px-6">
      <p className="text-xs text-gray-500">
        Filtra por correo o nombre de usuario, tipo de acción o rango de fechas. También puedes
        pegar el UUID si lo tienes. Se muestran hasta {AUDITORIA_PAGE_SIZE} registros por página.
      </p>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="auditoria-usuario" className={labelClassName}>
            Usuario
          </label>
          <AuditoriaUsuarioSearchField
            value={usuario}
            onChange={onUsuarioChange}
            onSelectUsuario={onSelectUsuario}
            className="min-w-0 flex-1"
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
            min={fechaDesde || undefined}
            className={inputClassName}
          />
        </div>
      </div>
    </div>
  )
}

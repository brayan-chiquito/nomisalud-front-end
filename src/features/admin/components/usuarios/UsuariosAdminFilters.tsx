import { Search } from 'lucide-react'
import { inputClassName, labelClassName } from '@/components/ui/buttonStyles'
import { USUARIO_ADMIN_ROLES } from '../../utils/usuarioAdminDisplay'
import type { ActivoFilter } from '../../hooks/useUsuariosAdminList'

export type UsuariosAdminFiltersProps = Readonly<{
  roleFilter: string
  activoFilter: ActivoFilter
  search: string
  onRoleChange: (v: string) => void
  onActivoChange: (v: ActivoFilter) => void
  onSearchChange: (v: string) => void
}>

export function UsuariosAdminFilters({
  roleFilter,
  activoFilter,
  search,
  onRoleChange,
  onActivoChange,
  onSearchChange,
}: UsuariosAdminFiltersProps) {
  return (
    <div className="grid gap-4 border-b border-gray-100 px-5 py-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
      <div className="lg:col-span-2">
        <label htmlFor="usuarios-search" className={labelClassName}>
          Buscar
        </label>
        <div className="relative">
          <Search
            className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400"
            aria-hidden
          />
          <input
            id="usuarios-search"
            type="search"
            placeholder="Correo o nombre…"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className={`${inputClassName} pl-9`}
          />
        </div>
      </div>
      <div>
        <label htmlFor="usuarios-role" className={labelClassName}>
          Rol
        </label>
        <select
          id="usuarios-role"
          value={roleFilter}
          onChange={(e) => onRoleChange(e.target.value)}
          className={inputClassName}
        >
          <option value="">Todos</option>
          {USUARIO_ADMIN_ROLES.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="usuarios-activo" className={labelClassName}>
          Estado
        </label>
        <select
          id="usuarios-activo"
          value={activoFilter}
          onChange={(e) => onActivoChange(e.target.value as ActivoFilter)}
          className={inputClassName}
        >
          <option value="">Todos</option>
          <option value="true">Activos</option>
          <option value="false">Inactivos</option>
        </select>
      </div>
    </div>
  )
}

import { KeyRound, Loader2, Pencil, UserX } from 'lucide-react'
import { ListPaginationFooter } from '@/components/ui/ListPaginationFooter'
import { buttonClassName } from '@/components/ui/buttonStyles'
import type { UsuarioAdmin } from '../../types/usuarioAdmin'
import { formatUsuarioFecha, labelUsuarioRole } from '../../utils/usuarioAdminDisplay'
import { cn } from '@/utils/cn'

export type UsuariosAdminTableProps = Readonly<{
  items: readonly UsuarioAdmin[]
  loading: boolean
  page: number
  total: number
  totalPages: number
  pageSize: number
  currentUserId?: string
  onPageChange: (p: number) => void
  onEdit: (u: UsuarioAdmin) => void
  onDeactivate: (u: UsuarioAdmin) => void
  onResetPassword: (u: UsuarioAdmin) => void
}>

export function UsuariosAdminTable({
  items,
  loading,
  page,
  total,
  totalPages,
  pageSize,
  currentUserId,
  onPageChange,
  onEdit,
  onDeactivate,
  onResetPassword,
}: UsuariosAdminTableProps) {
  const start = total === 0 ? 0 : (page - 1) * pageSize + 1
  const end = Math.min(page * pageSize, total)
  const initialLoad = loading && items.length === 0
  const refreshing = loading && items.length > 0

  return (
    <>
      <div
        className={cn(
          'overflow-x-auto transition-opacity duration-150',
          refreshing && 'opacity-60',
        )}
      >
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-gray-100 bg-gray-50/80 text-xs tracking-widest text-gray-500 uppercase">
            <tr>
              <th className="px-4 py-3 font-medium sm:px-6">Correo</th>
              <th className="px-4 py-3 font-medium">Nombre</th>
              <th className="px-4 py-3 font-medium">Rol</th>
              <th className="px-4 py-3 font-medium">Estado</th>
              <th className="px-4 py-3 font-medium">Creado</th>
              <th className="px-4 py-3 font-medium text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {initialLoad ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                  <Loader2 className="mx-auto mb-2 h-5 w-5 animate-spin" aria-hidden />
                  Cargando usuarios…
                </td>
              </tr>
            ) : null}
            {!loading && items.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                  No hay usuarios que coincidan con los filtros.
                </td>
              </tr>
            ) : null}
            {items.map((row) => {
              const isSelf = row.id === currentUserId
              return (
                <tr key={row.id} className="border-b border-gray-50 last:border-0">
                  <td className="px-4 py-3 font-medium text-gray-900 sm:px-6">{row.email}</td>
                  <td className="px-4 py-3 text-gray-600">{row.nombre_completo ?? '—'}</td>
                  <td className="px-4 py-3 text-gray-600">{labelUsuarioRole(row.role)}</td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        row.activo
                          ? 'inline-flex rounded-full bg-success-light px-2 py-0.5 text-xs font-medium text-success-text'
                          : 'inline-flex rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600'
                      }
                    >
                      {row.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600 tabular-nums">
                    {formatUsuarioFecha(row.created_at)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <button
                        type="button"
                        title="Editar"
                        onClick={() => onEdit(row)}
                        className={buttonClassName('icon')}
                        aria-label={`Editar ${row.email}`}
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        title="Restablecer contraseña"
                        onClick={() => onResetPassword(row)}
                        className={buttonClassName('icon')}
                        aria-label={`Restablecer contraseña de ${row.email}`}
                      >
                        <KeyRound className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        title={isSelf ? 'No puedes desactivar tu propia cuenta' : 'Desactivar'}
                        disabled={isSelf || !row.activo}
                        onClick={() => onDeactivate(row)}
                        className={buttonClassName('icon')}
                        aria-label={`Desactivar ${row.email}`}
                      >
                        <UserX className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <ListPaginationFooter
        start={start}
        end={end}
        total={total}
        page={page}
        totalPages={totalPages}
        loading={loading}
        onPrev={() => onPageChange(Math.max(1, page - 1))}
        onNext={() => onPageChange(page + 1)}
        resultsLabel="usuarios"
        pageBadgeClassName="bg-primary"
      />
    </>
  )
}

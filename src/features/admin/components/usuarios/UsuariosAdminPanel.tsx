import { useState } from 'react'
import { Plus, UserPlus } from 'lucide-react'
import { useAuth } from '@/features/auth/context/AuthContext'
import { Card } from '@/components/ui/Card'
import { buttonClassName } from '@/components/ui/buttonStyles'
import { useUsuariosAdminList } from '../../hooks/useUsuariosAdminList'
import type { UsuarioAdmin } from '../../types/usuarioAdmin'
import { UsuariosAdminFilters } from './UsuariosAdminFilters'
import { UsuariosAdminTable } from './UsuariosAdminTable'
import { UsuarioCreateModal } from './UsuarioCreateModal'
import { UsuarioEditModal } from './UsuarioEditModal'
import { UsuarioDeactivateModal } from './UsuarioDeactivateModal'
import { UsuarioPasswordAdminModal } from './UsuarioPasswordAdminModal'

/** Panel de gestión de usuarios (solo admin). */
export function UsuariosAdminPanel() {
  const { user } = useAuth()
  const {
    data,
    loading,
    error,
    page,
    setPage,
    roleFilter,
    setRoleFilter,
    activoFilter,
    setActivoFilter,
    search,
    setSearch,
    pageSize,
    reload,
  } = useUsuariosAdminList()

  const [createOpen, setCreateOpen] = useState(false)
  const [editUser, setEditUser] = useState<UsuarioAdmin | null>(null)
  const [deactivateUser, setDeactivateUser] = useState<UsuarioAdmin | null>(null)
  const [passwordUser, setPasswordUser] = useState<UsuarioAdmin | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  const items = data?.items ?? []
  const total = data?.total ?? 0
  const totalPages = data?.pages ?? 0

  const handleMutationSuccess = (message: string) => {
    setSuccessMsg(message)
    reload()
    window.setTimeout(() => setSuccessMsg(null), 4000)
  }

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-gray-100 px-5 py-5 sm:px-6">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
            <UserPlus className="h-5 w-5 text-primary" aria-hidden />
            Gestión de usuarios
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Crear, editar y desactivar cuentas del sistema. Solo rol administrador.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setCreateOpen(true)}
          className={buttonClassName('primary', 'gap-2')}
        >
          <Plus className="h-4 w-4" aria-hidden />
          Nuevo usuario
        </button>
      </div>

      {successMsg ? (
        <p
          className="mx-5 mt-3 rounded-lg border border-success/20 bg-success-light px-4 py-2 text-sm text-success-text sm:mx-6"
          role="status"
        >
          {successMsg}
        </p>
      ) : null}

      <UsuariosAdminFilters
        roleFilter={roleFilter}
        activoFilter={activoFilter}
        search={search}
        onRoleChange={setRoleFilter}
        onActivoChange={setActivoFilter}
        onSearchChange={setSearch}
      />

      {error ? (
        <p
          className="mx-5 my-3 rounded-lg border border-danger/20 bg-danger-light px-4 py-3 text-sm text-danger-text sm:mx-6"
          role="alert"
        >
          {error}
        </p>
      ) : null}

      <section className="flex min-h-[420px] flex-col">
        <UsuariosAdminTable
          items={items}
          loading={loading}
          page={page}
          total={total}
          totalPages={totalPages}
          pageSize={pageSize}
          currentUserId={user?.id}
          onPageChange={setPage}
          onEdit={setEditUser}
          onDeactivate={setDeactivateUser}
          onResetPassword={setPasswordUser}
        />
      </section>

      <UsuarioCreateModal
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        onSuccess={() => handleMutationSuccess('Usuario creado correctamente.')}
      />
      <UsuarioEditModal
        usuario={editUser}
        onClose={() => setEditUser(null)}
        onSuccess={() => handleMutationSuccess('Usuario actualizado.')}
      />
      <UsuarioDeactivateModal
        usuario={deactivateUser}
        onClose={() => setDeactivateUser(null)}
        onSuccess={() => handleMutationSuccess('Usuario desactivado.')}
      />
      <UsuarioPasswordAdminModal
        usuario={passwordUser}
        onClose={() => setPasswordUser(null)}
        onSuccess={() => handleMutationSuccess('Contraseña actualizada.')}
      />
    </Card>
  )
}

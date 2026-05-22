import { useEffect, useState } from 'react'
import { buttonClassName } from '@/components/ui/buttonStyles'
import { messageFromLoadError } from '@/utils/messageFromLoadError'
import { updateUsuarioAdmin } from '../../services/usuariosAdmin.service'
import type { UsuarioAdmin, UsuarioAdminRole } from '../../types/usuarioAdmin'
import { AdminDialog, AdminDialogSubmitButton } from './AdminDialog'
import { UsuarioFormFields, type UsuarioFormCoreValues } from './UsuarioFormFields'
import {
  buildOptionalUsuarioFields,
  type UsuarioFormExtraValues,
} from '../../utils/usuarioFormPayload'

function coreFromUsuario(u: UsuarioAdmin): UsuarioFormCoreValues {
  return {
    email: u.email,
    role: u.role,
    nombre_completo: u.nombre_completo ?? '',
    activo: u.activo,
  }
}

function extraFromUsuario(u: UsuarioAdmin): UsuarioFormExtraValues {
  return {
    tipo_documento: u.tipo_documento ?? '',
    numero_documento: u.numero_documento ?? '',
    area: u.area ?? '',
    cargo: u.cargo ?? '',
    eps_afiliacion: u.eps_afiliacion ?? '',
    arl_afiliacion: u.arl_afiliacion ?? '',
  }
}

export type UsuarioEditModalProps = Readonly<{
  usuario: UsuarioAdmin | null
  onClose: () => void
  onSuccess: () => void
}>

export function UsuarioEditModal({ usuario, onClose, onSuccess }: UsuarioEditModalProps) {
  const [core, setCore] = useState<UsuarioFormCoreValues>({
    email: '',
    role: 'colaborador',
    nombre_completo: '',
    activo: true,
  })
  const [extra, setExtra] = useState<UsuarioFormExtraValues>({
    tipo_documento: '',
    numero_documento: '',
    area: '',
    cargo: '',
    eps_afiliacion: '',
    arl_afiliacion: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!usuario) return
    setCore(coreFromUsuario(usuario))
    setExtra(extraFromUsuario(usuario))
    setError(null)
  }, [usuario])

  const handleClose = () => {
    if (submitting) return
    setError(null)
    onClose()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!usuario) return
    setSubmitting(true)
    setError(null)
    try {
      const optional = buildOptionalUsuarioFields(extra)
      await updateUsuarioAdmin(usuario.id, {
        email: core.email.trim(),
        role: core.role as UsuarioAdminRole,
        nombre_completo: core.nombre_completo.trim() || undefined,
        activo: core.activo,
        ...optional,
      })
      onSuccess()
      handleClose()
    } catch (err) {
      setError(messageFromLoadError(err, 'No se pudo actualizar el usuario.'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AdminDialog
      isOpen={usuario !== null}
      titleId="usuario-edit-title"
      title="Editar usuario"
      onClose={handleClose}
      isSubmitting={submitting}
      footer={
        <>
          <button
            type="button"
            onClick={handleClose}
            disabled={submitting}
            className={buttonClassName('secondary')}
          >
            Cancelar
          </button>
          <AdminDialogSubmitButton
            label="Guardar cambios"
            isSubmitting={submitting}
            form="usuario-edit-form"
          />
        </>
      }
    >
      <form id="usuario-edit-form" onSubmit={handleSubmit}>
        <UsuarioFormFields
          core={core}
          extra={extra}
          onCoreChange={(p) => setCore((c) => ({ ...c, ...p }))}
          onExtraChange={(p) => setExtra((x) => ({ ...x, ...p }))}
        />
        {error ? (
          <p className="mt-3 text-sm text-danger" role="alert">
            {error}
          </p>
        ) : null}
      </form>
    </AdminDialog>
  )
}

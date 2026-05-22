import { useState } from 'react'
import { buttonClassName } from '@/components/ui/buttonStyles'
import { messageFromLoadError } from '@/utils/messageFromLoadError'
import { createUsuarioAdmin } from '../../services/usuariosAdmin.service'
import type { UsuarioAdminRole } from '../../types/usuarioAdmin'
import { AdminDialog, AdminDialogSubmitButton } from './AdminDialog'
import { UsuarioFormFields, type UsuarioFormCoreValues } from './UsuarioFormFields'
import {
  buildOptionalUsuarioFields,
  type UsuarioFormExtraValues,
} from '../../utils/usuarioFormPayload'

const emptyExtra = (): UsuarioFormExtraValues => ({
  tipo_documento: '',
  numero_documento: '',
  area: '',
  cargo: '',
  eps_afiliacion: '',
  arl_afiliacion: '',
})

export type UsuarioCreateModalProps = Readonly<{
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}>

export function UsuarioCreateModal({ isOpen, onClose, onSuccess }: UsuarioCreateModalProps) {
  const [core, setCore] = useState<UsuarioFormCoreValues>({
    email: '',
    role: 'colaborador',
    nombre_completo: '',
    activo: true,
  })
  const [extra, setExtra] = useState(emptyExtra)
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleClose = () => {
    if (submitting) return
    setError(null)
    onClose()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.')
      return
    }
    setSubmitting(true)
    setError(null)
    try {
      const optional = buildOptionalUsuarioFields(extra)
      await createUsuarioAdmin({
        email: core.email.trim(),
        password,
        role: core.role as UsuarioAdminRole,
        nombre_completo: core.nombre_completo.trim() || undefined,
        activo: core.activo,
        ...optional,
      })
      onSuccess()
      handleClose()
      setCore({ email: '', role: 'colaborador', nombre_completo: '', activo: true })
      setExtra(emptyExtra())
      setPassword('')
    } catch (err) {
      setError(messageFromLoadError(err, 'No se pudo crear el usuario.'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AdminDialog
      isOpen={isOpen}
      titleId="usuario-create-title"
      title="Nuevo usuario"
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
            label="Crear usuario"
            isSubmitting={submitting}
            form="usuario-create-form"
          />
        </>
      }
    >
      <form id="usuario-create-form" onSubmit={handleSubmit}>
        <UsuarioFormFields
          core={core}
          extra={extra}
          onCoreChange={(p) => setCore((c) => ({ ...c, ...p }))}
          onExtraChange={(p) => setExtra((x) => ({ ...x, ...p }))}
          showPassword
          password={password}
          onPasswordChange={setPassword}
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

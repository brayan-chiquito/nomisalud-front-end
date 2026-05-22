import { useState } from 'react'
import { buttonClassName, inputClassName, labelClassName } from '@/components/ui/buttonStyles'
import { messageFromLoadError } from '@/utils/messageFromLoadError'
import { resetUsuarioAdminPassword } from '../../services/usuariosAdmin.service'
import type { UsuarioAdmin } from '../../types/usuarioAdmin'
import { AdminDialog, AdminDialogSubmitButton } from './AdminDialog'

export type UsuarioPasswordAdminModalProps = Readonly<{
  usuario: UsuarioAdmin | null
  onClose: () => void
  onSuccess: () => void
}>

export function UsuarioPasswordAdminModal({
  usuario,
  onClose,
  onSuccess,
}: UsuarioPasswordAdminModalProps) {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleClose = () => {
    if (submitting) return
    setPassword('')
    setConfirm('')
    setError(null)
    onClose()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!usuario) return
    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.')
      return
    }
    if (password !== confirm) {
      setError('Las contraseñas no coinciden.')
      return
    }
    setSubmitting(true)
    setError(null)
    try {
      await resetUsuarioAdminPassword(usuario.id, password)
      onSuccess()
      handleClose()
    } catch (err) {
      setError(messageFromLoadError(err, 'No se pudo restablecer la contraseña.'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AdminDialog
      isOpen={usuario !== null}
      titleId="usuario-password-title"
      title="Restablecer contraseña"
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
            label="Guardar contraseña"
            isSubmitting={submitting}
            form="usuario-password-form"
          />
        </>
      }
    >
      <form id="usuario-password-form" onSubmit={handleSubmit}>
        <p className="mb-4 text-sm text-gray-600">
          Nueva contraseña para <span className="font-medium">{usuario?.email}</span>
        </p>
        <div className="flex flex-col gap-4">
          <div>
            <label htmlFor="admin-new-password" className={labelClassName}>
              Nueva contraseña
            </label>
            <input
              id="admin-new-password"
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClassName}
            />
          </div>
          <div>
            <label htmlFor="admin-confirm-password" className={labelClassName}>
              Confirmar contraseña
            </label>
            <input
              id="admin-confirm-password"
              type="password"
              required
              minLength={8}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className={inputClassName}
            />
          </div>
        </div>
        {error ? (
          <p className="mt-3 text-sm text-danger" role="alert">
            {error}
          </p>
        ) : null}
      </form>
    </AdminDialog>
  )
}

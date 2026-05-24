import { useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import { buttonClassName } from '@/components/ui/buttonStyles'
import { messageFromLoadError } from '@/utils/messageFromLoadError'
import { deactivateUsuarioAdmin } from '../../services/usuariosAdmin.service'
import type { UsuarioAdmin } from '../../types/usuarioAdmin'
import { AdminDialog } from './AdminDialog'

export type UsuarioDeactivateModalProps = Readonly<{
  usuario: UsuarioAdmin | null
  onClose: () => void
  onSuccess: () => void
}>

export function UsuarioDeactivateModal({
  usuario,
  onClose,
  onSuccess,
}: UsuarioDeactivateModalProps) {
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleClose = () => {
    if (submitting) return
    setError(null)
    onClose()
  }

  const handleConfirm = async () => {
    if (!usuario) return
    setSubmitting(true)
    setError(null)
    try {
      await deactivateUsuarioAdmin(usuario.id)
      onSuccess()
      handleClose()
    } catch (err) {
      setError(messageFromLoadError(err, 'No se pudo desactivar el usuario.'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AdminDialog
      isOpen={usuario !== null}
      titleId="usuario-deactivate-title"
      title="Desactivar usuario"
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
          <button
            type="button"
            disabled={submitting}
            onClick={() => void handleConfirm()}
            className={buttonClassName('danger')}
          >
            {submitting ? 'Desactivando…' : 'Desactivar'}
          </button>
        </>
      }
    >
      <div className="flex items-start gap-2.5 rounded-lg border border-warning/30 bg-warning-light p-3">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning" aria-hidden />
        <p className="text-sm text-gray-800">
          El usuario <span className="font-medium">{usuario?.email}</span> quedará inactivo y no
          podrá iniciar sesión. Esta acción se puede revertir editando el usuario.
        </p>
      </div>
      {error ? (
        <p className="mt-3 text-sm text-danger" role="alert">
          {error}
        </p>
      ) : null}
    </AdminDialog>
  )
}

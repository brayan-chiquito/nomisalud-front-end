import { useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import { buttonClassName } from '@/components/ui/buttonStyles'
import { messageFromLoadError } from '@/utils/messageFromLoadError'
import { deletePlazoEntidad } from '../../services/plazosEntidad.service'
import type { PlazoEntidadItem } from '../../types/plazoEntidad'
import { labelTipoIncapacidad } from '../../utils/plazoEntidadDisplay'
import { AdminDialog } from '../usuarios/AdminDialog'

export type PlazoEntidadDeleteModalProps = Readonly<{
  plazo: PlazoEntidadItem | null
  onClose: () => void
  onSuccess: () => void
}>

export function PlazoEntidadDeleteModal({
  plazo,
  onClose,
  onSuccess,
}: PlazoEntidadDeleteModalProps) {
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleClose = () => {
    if (submitting) return
    setError(null)
    onClose()
  }

  const handleConfirm = async () => {
    if (!plazo) return
    setSubmitting(true)
    setError(null)
    try {
      await deletePlazoEntidad(plazo.id)
      onSuccess()
      handleClose()
    } catch (err) {
      setError(messageFromLoadError(err, 'No se pudo eliminar el plazo.'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AdminDialog
      isOpen={plazo !== null}
      titleId="plazo-delete-title"
      title="Eliminar plazo"
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
            {submitting ? 'Eliminando…' : 'Eliminar'}
          </button>
        </>
      }
    >
      <div className="flex items-start gap-2.5 rounded-lg border border-warning/30 bg-warning-light p-3">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning" aria-hidden />
        <p className="text-sm text-gray-800">
          Se eliminará permanentemente el plazo de{' '}
          <span className="font-medium">{plazo?.entidad_nombre}</span> (
          {plazo ? labelTipoIncapacidad(plazo.tipo_incapacidad) : ''}). Esta acción no se puede
          deshacer.
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

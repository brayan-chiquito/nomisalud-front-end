import { useEffect, useState } from 'react'
import { buttonClassName } from '@/components/ui/buttonStyles'
import { messageFromLoadError } from '@/utils/messageFromLoadError'
import { updatePlazoEntidad } from '../../services/plazosEntidad.service'
import type { PlazoEntidadItem } from '../../types/plazoEntidad'
import { AdminDialog, AdminDialogSubmitButton } from '../usuarios/AdminDialog'
import { PlazoEntidadFormFields } from './PlazoEntidadFormFields'
import {
  buildUpdatePlazoEntidadPayload,
  plazoEntidadFormValuesFromItem,
  type PlazoEntidadFormValues,
} from '../../utils/plazoEntidadFormPayload'

export type PlazoEntidadEditModalProps = Readonly<{
  plazo: PlazoEntidadItem | null
  onClose: () => void
  onSuccess: () => void
}>

export function PlazoEntidadEditModal({ plazo, onClose, onSuccess }: PlazoEntidadEditModalProps) {
  const [values, setValues] = useState<PlazoEntidadFormValues>({
    entidad_nombre: '',
    tipo_incapacidad: 'general',
    valor_limite: '',
    unidad_limite: 'dias',
    dias_alerta: '',
    dias_promedio_pago: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!plazo) return
    setValues(plazoEntidadFormValuesFromItem(plazo))
    setError(null)
  }, [plazo])

  const handleClose = () => {
    if (submitting) return
    setError(null)
    onClose()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!plazo) return
    setSubmitting(true)
    setError(null)
    try {
      const payload = buildUpdatePlazoEntidadPayload(values, plazo)
      await updatePlazoEntidad(plazo.id, payload)
      onSuccess()
      handleClose()
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : messageFromLoadError(err, 'No se pudo actualizar el plazo.')
      setError(msg)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AdminDialog
      isOpen={plazo !== null}
      titleId="plazo-edit-title"
      title="Editar plazo por entidad"
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
            form="plazo-edit-form"
          />
        </>
      }
    >
      <form id="plazo-edit-form" onSubmit={handleSubmit}>
        <PlazoEntidadFormFields
          values={values}
          onChange={(patch) => setValues((v) => ({ ...v, ...patch }))}
          idPrefix="plazo-edit"
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

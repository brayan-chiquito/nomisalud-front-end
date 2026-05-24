import { useState } from 'react'
import { buttonClassName } from '@/components/ui/buttonStyles'
import { messageFromLoadError } from '@/utils/messageFromLoadError'
import { createPlazoEntidad } from '../../services/plazosEntidad.service'
import { AdminDialog, AdminDialogSubmitButton } from '../usuarios/AdminDialog'
import { PlazoEntidadFormFields } from './PlazoEntidadFormFields'
import {
  buildCreatePlazoEntidadPayload,
  emptyPlazoEntidadFormValues,
  type PlazoEntidadFormValues,
} from '../../utils/plazoEntidadFormPayload'

export type PlazoEntidadCreateModalProps = Readonly<{
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}>

export function PlazoEntidadCreateModal({
  isOpen,
  onClose,
  onSuccess,
}: PlazoEntidadCreateModalProps) {
  const [values, setValues] = useState<PlazoEntidadFormValues>(emptyPlazoEntidadFormValues)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleClose = () => {
    if (submitting) return
    setError(null)
    onClose()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      const payload = buildCreatePlazoEntidadPayload(values)
      await createPlazoEntidad(payload)
      onSuccess()
      handleClose()
      setValues(emptyPlazoEntidadFormValues())
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : messageFromLoadError(err, 'No se pudo crear el plazo.')
      setError(msg)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AdminDialog
      isOpen={isOpen}
      titleId="plazo-create-title"
      title="Nuevo plazo por entidad"
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
            label="Crear plazo"
            isSubmitting={submitting}
            form="plazo-create-form"
          />
        </>
      }
    >
      <form id="plazo-create-form" onSubmit={handleSubmit}>
        <PlazoEntidadFormFields
          values={values}
          onChange={(patch) => setValues((v) => ({ ...v, ...patch }))}
          idPrefix="plazo-create"
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

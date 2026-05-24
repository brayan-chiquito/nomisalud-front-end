import { useCallback, useState } from 'react'
import { Link } from 'react-router-dom'
import { marcarIncapacidadCobrada } from '../services/marcarCobrada.service'
import { messageFromPatchEstadoError } from '../utils/patchEstadoErrorMessage'
import { MarcarCobradaModal } from './MarcarCobradaModal'
import { buttonClassName } from '@/components/ui/buttonStyles'

export type MarcarCobradaDetalleActionProps = Readonly<{
  incapacidadId: string
  radicado: string
  onEstadoActualizado: (nuevoEstado: string) => void
}>

/** Botón en detalle de revisión cuando `estado === 'transcrita'` (opción B SCRUM-187-2). */
export function MarcarCobradaDetalleAction({
  incapacidadId,
  radicado,
  onEstadoActualizado,
}: MarcarCobradaDetalleActionProps) {
  const [modalOpen, setModalOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleConfirm = useCallback(
    async (observacion?: string) => {
      setSubmitting(true)
      setError(null)
      try {
        const res = await marcarIncapacidadCobrada(incapacidadId, observacion)
        onEstadoActualizado(res.estado)
        return true
      } catch (e) {
        setError(messageFromPatchEstadoError(e))
        return false
      } finally {
        setSubmitting(false)
      }
    },
    [incapacidadId, onEstadoActualizado],
  )

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={() => {
          setError(null)
          setModalOpen(true)
        }}
        className={buttonClassName('secondary', 'px-[22px] py-[11px]')}
      >
        Marcar como cobrada
      </button>
      <Link
        to="/dashboard/cobro-ante-entidad"
        className="text-[13px] font-medium text-primary hover:underline"
      >
        Ver listado transcrita
      </Link>
      <MarcarCobradaModal
        isOpen={modalOpen}
        radicado={radicado}
        onClose={() => {
          if (!submitting) setModalOpen(false)
        }}
        onConfirm={handleConfirm}
        isSubmitting={submitting}
        error={error}
      />
    </div>
  )
}

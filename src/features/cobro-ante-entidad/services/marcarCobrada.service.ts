import { patchIncapacidadEstado } from '@/features/incapacity-ai-review/services/incapacidadReview.service'
import type { PatchIncapacidadEstadoResponse } from '@/features/incapacity-ai-review/types/incapacidadDetalle'

/**
 * Pasa un trámite de `transcrita` a `cobrada` (`PATCH /incapacidades/{id}/estado`).
 */
export async function marcarIncapacidadCobrada(
  incapacidadId: string,
  observacion?: string,
  signal?: AbortSignal,
): Promise<PatchIncapacidadEstadoResponse> {
  const obs = observacion?.trim()
  return patchIncapacidadEstado(
    incapacidadId,
    {
      estado: 'cobrada',
      ...(obs ? { observacion: obs } : {}),
    },
    signal,
  )
}

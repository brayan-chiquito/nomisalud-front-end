import { listIncapacidades } from './listIncapacidades.service'

const MAX_PAGES = 10

export type ParsedUploadIncapacityResponse = Readonly<{
  radicado: string
  estado: string
  id?: string
}>

function pickIdFromPayload(o: Record<string, unknown>): string | undefined {
  const rawId = typeof o.id === 'string' ? o.id.trim() : ''
  const rawTramiteId = typeof o.tramite_id === 'string' ? o.tramite_id.trim() : ''
  if (rawId) return rawId
  if (rawTramiteId) return rawTramiteId
  return undefined
}

/**
 * Interpreta el JSON típico de `POST /incapacidades/upload` (radicado + estado; `id` o `tramite_id` opcional).
 */
export function parseUploadIncapacityResponse(
  data: unknown,
): ParsedUploadIncapacityResponse | null {
  if (!data || typeof data !== 'object') return null
  const o = data as Record<string, unknown>
  const radicado = typeof o.radicado === 'string' ? o.radicado.trim() : ''
  const estado = typeof o.estado === 'string' ? o.estado.trim() : ''
  const idFromPayload = pickIdFromPayload(o)

  if ((!radicado || !estado) && idFromPayload) {
    return { radicado: radicado || '—', estado: estado || 'registrada', id: idFromPayload }
  }

  if (!radicado || !estado) return null
  return { radicado, estado, id: idFromPayload }
}

/**
 * Resuelve el UUID de la incapacidad tras el upload: usa `id` de la respuesta si existe; si no, busca en el listado por `radicado`.
 */
export async function resolveIncapacidadIdAfterUpload(
  uploadPayload: unknown,
  options?: Readonly<{ signal?: AbortSignal }>,
): Promise<string | null> {
  const parsed = parseUploadIncapacityResponse(uploadPayload)
  if (!parsed) return null
  if (parsed.id) return parsed.id

  const signal = options?.signal
  for (let page = 1; page <= MAX_PAGES; page++) {
    const res = await listIncapacidades({ page, signal })
    const hit = res.items.find((it) => it.radicado === parsed.radicado)
    if (hit) return hit.id
    if (page >= res.pages || res.items.length === 0) break
  }
  return null
}

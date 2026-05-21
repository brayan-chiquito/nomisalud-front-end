import axios from 'axios'
import { listPagos } from '@/features/pagos/services/pagos.service'
import { entidadNombreLegible } from '../utils/listIncapacidadItemDisplay'
import { listIncapacidades } from './listIncapacidades.service'

/** Nombres de entidad distintos que coinciden con el texto (incapacidades + pagos). */
export async function fetchEntidadNombreSuggestions(
  query: string,
  signal?: AbortSignal,
): Promise<string[]> {
  const q = query.trim()
  if (q.length < 2) return []

  const names = new Set<string>()
  try {
    const [inc, pag] = await Promise.all([
      listIncapacidades({ page: 1, entidad: q, signal }),
      listPagos({ page: 1, entidad: q, signal }),
    ])
    for (const row of inc.items) {
      const nombre = entidadNombreLegible(row).trim()
      if (nombre) names.add(nombre)
    }
    for (const row of pag.items) {
      const origen = row.entidad_origen?.trim()
      if (origen) names.add(origen)
    }
  } catch (e) {
    if (axios.isCancel(e)) throw e
    return []
  }

  return [...names].sort((a, b) => a.localeCompare(b, 'es'))
}

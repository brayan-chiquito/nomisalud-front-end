import axios from 'axios'
import { listPagos } from '@/features/pagos/services/pagos.service'
import { entidadNombreLegible } from '../utils/listIncapacidadItemDisplay'
import { listIncapacidades } from './listIncapacidades.service'
import type { IncapacidadesListResponse } from '../types/listIncapacidades'
import type { PagosListResponse } from '@/features/pagos/types/pago'

export type EntidadSuggestionsSource = 'all' | 'pagos'

export type FetchEntidadNombreSuggestionsOptions = Readonly<{
  signal?: AbortSignal
  /** `pagos` omite incapacidades (rol contabilidad — SCRUM-201). */
  sources?: EntidadSuggestionsSource
}>

const EMPTY_INCAPACIDADES: IncapacidadesListResponse = { items: [], total: 0, pages: 0 }
const EMPTY_PAGOS: PagosListResponse = { items: [], total: 0, pages: 0 }

async function fetchIncapacidadesEntidades(
  q: string,
  signal?: AbortSignal,
): Promise<IncapacidadesListResponse> {
  try {
    return await listIncapacidades({ page: 1, entidad: q, signal })
  } catch (e) {
    if (axios.isCancel(e)) throw e
    return EMPTY_INCAPACIDADES
  }
}

async function fetchPagosEntidades(q: string, signal?: AbortSignal): Promise<PagosListResponse> {
  try {
    return await listPagos({ page: 1, entidad: q, signal })
  } catch (e) {
    if (axios.isCancel(e)) throw e
    return EMPTY_PAGOS
  }
}

function collectNames(inc: IncapacidadesListResponse, pag: PagosListResponse): string[] {
  const names = new Set<string>()
  for (const row of inc.items) {
    const nombre = entidadNombreLegible(row).trim()
    if (nombre) names.add(nombre)
  }
  for (const row of pag.items) {
    const origen = row.entidad_origen?.trim()
    if (origen) names.add(origen)
  }
  return [...names].sort((a, b) => a.localeCompare(b, 'es'))
}

/** Nombres de entidad distintos que coinciden con el texto (incapacidades y/o pagos). */
export async function fetchEntidadNombreSuggestions(
  query: string,
  options?: FetchEntidadNombreSuggestionsOptions,
): Promise<string[]> {
  const q = query.trim()
  if (q.length < 2) return []

  const signal = options?.signal
  const sources = options?.sources ?? 'all'

  if (sources === 'pagos') {
    const pag = await fetchPagosEntidades(q, signal)
    return collectNames(EMPTY_INCAPACIDADES, pag)
  }

  const [inc, pag] = await Promise.all([
    fetchIncapacidadesEntidades(q, signal),
    fetchPagosEntidades(q, signal),
  ])
  return collectNames(inc, pag)
}

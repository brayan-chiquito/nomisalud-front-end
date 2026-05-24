import axios from 'axios'
import { listPagos, listRadicadosDisponibles } from '@/features/pagos/services/pagos.service'
import type { RadicadosDisponiblesResponse } from '@/features/pagos/types/radicadoDisponible'
import { colaboradorNombreLegible, entidadNombreLegible } from '../utils/listIncapacidadItemDisplay'
import {
  fetchIncapacidadesPageForSuggestions,
  filterStringsMatchingSearch,
} from '../utils/listIncapacidadSearch'
import type { IncapacidadesFilterParams } from './listIncapacidades.service'
import type { IncapacidadesListResponse } from '../types/listIncapacidades'
import type { PagosListResponse } from '@/features/pagos/types/pago'

/** `incapacidades` = solo trámites del listado (p. ej. estado transcrita). */
export type EntidadSuggestionsSource = 'all' | 'pagos' | 'incapacidades' | 'radicados-disponibles'

export type FetchEntidadNombreSuggestionsOptions = Readonly<{
  signal?: AbortSignal
  /** `pagos` omite incapacidades (rol contabilidad — SCRUM-201). */
  sources?: EntidadSuggestionsSource
  /** Mismos filtros que el listado visible (estado, tipo, etc.). */
  listFilters?: IncapacidadesFilterParams
}>

const EMPTY_INCAPACIDADES: IncapacidadesListResponse = { items: [], total: 0, pages: 0 }
const EMPTY_PAGOS: PagosListResponse = { items: [], total: 0, pages: 0 }
const EMPTY_RADICADOS_DISPONIBLES: RadicadosDisponiblesResponse = { items: [], total: 0, pages: 0 }

async function fetchIncapacidadesEntidades(
  query: string,
  listFilters?: IncapacidadesFilterParams,
  signal?: AbortSignal,
): Promise<IncapacidadesListResponse> {
  try {
    return await fetchIncapacidadesPageForSuggestions(query, listFilters, signal)
  } catch (e) {
    if (axios.isCancel(e)) throw e
    return EMPTY_INCAPACIDADES
  }
}

async function fetchPagosEntidades(q: string, signal?: AbortSignal): Promise<PagosListResponse> {
  try {
    return await listPagos({ page: 1, q, signal })
  } catch (e) {
    if (axios.isCancel(e)) throw e
    return EMPTY_PAGOS
  }
}

async function fetchRadicadosDisponiblesEntidades(
  q: string,
  signal?: AbortSignal,
): Promise<RadicadosDisponiblesResponse> {
  try {
    return await listRadicadosDisponibles({ page: 1, q, signal })
  } catch (e) {
    if (axios.isCancel(e)) throw e
    return EMPTY_RADICADOS_DISPONIBLES
  }
}

function collectRadicadosDisponiblesNames(
  query: string,
  res: RadicadosDisponiblesResponse,
): string[] {
  const names: string[] = []
  for (const row of res.items) {
    const entidad = row.entidad_nombre?.trim()
    if (entidad) names.push(entidad)
  }
  return filterStringsMatchingSearch(names, query)
}

function collectNames(
  query: string,
  inc: IncapacidadesListResponse,
  pag: PagosListResponse,
): string[] {
  const names: string[] = []
  for (const row of inc.items) {
    const entidad = entidadNombreLegible(row).trim()
    if (entidad) names.push(entidad)
    const colaborador = colaboradorNombreLegible(row).trim()
    if (colaborador) names.push(colaborador)
    const radicado = row.radicado?.trim()
    if (radicado) names.push(radicado)
  }
  for (const row of pag.items) {
    const origen = row.entidad_origen?.trim()
    if (origen) names.push(origen)
  }
  return filterStringsMatchingSearch(names, query)
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

  const listFilters = options?.listFilters

  if (sources === 'pagos') {
    const pag = await fetchPagosEntidades(q, signal)
    return collectNames(q, EMPTY_INCAPACIDADES, pag)
  }

  if (sources === 'incapacidades') {
    const inc = await fetchIncapacidadesEntidades(q, listFilters, signal)
    return collectNames(q, inc, EMPTY_PAGOS)
  }

  if (sources === 'radicados-disponibles') {
    const rad = await fetchRadicadosDisponiblesEntidades(q, signal)
    return collectRadicadosDisponiblesNames(q, rad)
  }

  const [inc, pag] = await Promise.all([
    fetchIncapacidadesEntidades(q, listFilters, signal),
    fetchPagosEntidades(q, signal),
  ])
  return collectNames(q, inc, pag)
}

import {
  listIncapacidades,
  type IncapacidadesFilterParams,
  type ListIncapacidadesParams,
} from '../services/listIncapacidades.service'
import type { IncapacidadListItem } from '../types/listIncapacidades'
import type { IncapacidadesListResponse } from '../types/listIncapacidades'
import { listSearchQueryVariants } from './listSearchQuery'
import { colaboradorNombreLegible, entidadNombreLegible } from './listIncapacidadItemDisplay'

/** ¿El trámite coincide con el texto de búsqueda (radicado, colaborador, entidad)? */
export function matchesIncapacidadListSearch(row: IncapacidadListItem, term: string): boolean {
  const q = term.trim().toLowerCase()
  if (!q) return true
  const hay = (value?: string | null) => value?.toLowerCase().includes(q) ?? false
  return (
    hay(row.radicado) ||
    hay(row.colaborador_email) ||
    hay(row.colaborador_nombre) ||
    hay(row.nombre_colaborador) ||
    hay(row.entidad_nombre) ||
    hay(entidadNombreLegible(row)) ||
    hay(colaboradorNombreLegible(row))
  )
}

/** Solo cadenas que contienen el término (para autocompletado). */
export function filterStringsMatchingSearch(values: readonly string[], term: string): string[] {
  const q = term.trim().toLowerCase()
  if (q.length < 2) return []
  const seen = new Set<string>()
  const out: string[] = []
  for (const raw of values) {
    const v = raw.trim()
    if (!v || !v.toLowerCase().includes(q) || seen.has(v)) continue
    seen.add(v)
    out.push(v)
  }
  return out.sort((a, b) => a.localeCompare(b, 'es'))
}

/** Parámetros de búsqueda para listado y exportación (`GET /incapacidades` con `q` multi-campo). */
export function incapacidadesSearchFilterParams(term: string): IncapacidadesFilterParams {
  const t = term.trim()
  if (!t) return {}
  return { q: t }
}

/** Quita `q`/`entidad` para no mezclar el texto del buscador con filtros de panel (sugerencias). */
export function stripIncapacidadesSearchFilters(
  filters?: IncapacidadesFilterParams,
): IncapacidadesFilterParams {
  if (!filters) return {}
  const rest = { ...filters }
  delete rest.q
  delete rest.entidad
  return rest
}

/**
 * Listado con `q` en API (SCRUM-216). Reintenta variantes de correo (parte local).
 */
export async function listIncapacidadesWithTextSearch(
  params: ListIncapacidadesParams,
  searchTerm: string,
  signal?: AbortSignal,
): Promise<IncapacidadesListResponse> {
  const req = { ...params, signal: signal ?? params.signal }
  const term = searchTerm.trim()
  if (!term) return listIncapacidades(req)

  const variants = listSearchQueryVariants(term)
  for (let i = 0; i < variants.length; i++) {
    const res = await listIncapacidades({
      ...req,
      q: variants[i],
    })
    if (res.items.length > 0 || res.total > 0 || i === variants.length - 1) {
      return res
    }
  }

  return listIncapacidades({ ...req, q: term })
}

/** Página 1 del listado con `q` para autocompletado (mismos filtros de panel, sin texto duplicado). */
export async function fetchIncapacidadesPageForSuggestions(
  query: string,
  listFilters: IncapacidadesFilterParams | undefined,
  signal: AbortSignal | undefined,
): Promise<IncapacidadesListResponse> {
  const term = query.trim()
  if (term.length < 2) {
    return { items: [], total: 0, pages: 0 }
  }
  return listIncapacidadesWithTextSearch(
    { page: 1, ...stripIncapacidadesSearchFilters(listFilters), signal },
    term,
    signal,
  )
}

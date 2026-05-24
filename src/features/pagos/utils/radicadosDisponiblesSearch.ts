import {
  listRadicadosDisponibles,
  listRadicadosDisponiblesWithTextSearch,
} from '../services/pagos.service'
import type { ListRadicadosDisponiblesParams } from '../services/pagos.service'
import type { RadicadoDisponible } from '../types/radicadoDisponible'
import { radicadoDisponibleSubtitle } from './radicadoDisponibleDisplay'

/** ¿El radicado disponible coincide con el término (entidad, colaborador, radicado)? */
export function matchesRadicadoDisponibleSearch(row: RadicadoDisponible, term: string): boolean {
  const q = term.trim().toLowerCase()
  if (!q) return true
  const hay = (value?: string | null) => value?.toLowerCase().includes(q) ?? false
  return (
    hay(row.radicado) ||
    hay(row.entidad_nombre) ||
    hay(row.colaborador_nombre) ||
    hay(row.colaborador_email) ||
    hay(radicadoDisponibleSubtitle(row))
  )
}

/**
 * Listado con búsqueda por texto vía API (`q`, SCRUM-216).
 * @deprecated Usar `listRadicadosDisponiblesWithTextSearch` del servicio.
 */
export async function listRadicadosDisponiblesWithEntidadSearch(
  params: ListRadicadosDisponiblesParams,
): Promise<Awaited<ReturnType<typeof listRadicadosDisponiblesWithTextSearch>>> {
  const { signal, entidad, q, ...rest } = params
  const term = q?.trim() || entidad?.trim() || ''
  if (!term) return listRadicadosDisponibles({ ...rest, signal })
  return listRadicadosDisponiblesWithTextSearch({ ...rest, signal }, term)
}

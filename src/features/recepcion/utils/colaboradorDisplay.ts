import type { ColaboradorBusquedaItem } from '../types/colaboradorBusqueda'

export function colaboradorDisplayLabel(item: ColaboradorBusquedaItem): string {
  return item.nombre_completo.trim() || item.email
}

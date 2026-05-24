import type {
  PlazoEntidadItem,
  TipoIncapacidadPlazo,
  UnidadLimitePlazo,
} from '../types/plazoEntidad'

export const TIPO_INCAPACIDAD_OPTIONS: ReadonlyArray<{
  value: TipoIncapacidadPlazo
  label: string
}> = [
  { value: 'general', label: 'General' },
  { value: 'accidente_transito', label: 'Accidente de tránsito' },
  { value: 'accidente_trabajo', label: 'Accidente de trabajo' },
]

export const UNIDAD_LIMITE_OPTIONS: ReadonlyArray<{
  value: UnidadLimitePlazo
  label: string
}> = [
  { value: 'dias', label: 'Días' },
  { value: 'meses', label: 'Meses' },
  { value: 'anos', label: 'Años' },
]

export function labelTipoIncapacidad(tipo: string): string {
  return TIPO_INCAPACIDAD_OPTIONS.find((o) => o.value === tipo)?.label ?? tipo
}

export function labelUnidadLimite(unidad: string): string {
  return UNIDAD_LIMITE_OPTIONS.find((o) => o.value === unidad)?.label ?? unidad
}

export function formatPlazoLimite(row: PlazoEntidadItem): string {
  return `${row.valor_limite} ${labelUnidadLimite(row.unidad_limite).toLowerCase()} (${row.dias_limite} días)`
}

export function formatDiasPromedioPago(value: number | null | undefined): string {
  return value == null ? '—' : String(value)
}

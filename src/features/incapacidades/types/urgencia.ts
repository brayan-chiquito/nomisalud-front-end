/** Semáforo calculado por el backend (`GET /incapacidades`, ver docs/README.md). */
export type UrgenciaNivel = 'verde' | 'amarillo' | 'rojo'

export const URGENCIA_NIVELES: readonly UrgenciaNivel[] = ['rojo', 'amarillo', 'verde'] as const

export const URGENCIA_FILTRO_OPTIONS: readonly Readonly<{
  value: '' | UrgenciaNivel
  label: string
}>[] = [
  { value: '', label: 'Todas' },
  { value: 'rojo', label: 'Rojo' },
  { value: 'amarillo', label: 'Amarillo' },
  { value: 'verde', label: 'Verde' },
]

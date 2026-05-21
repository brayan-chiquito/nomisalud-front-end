export type PlazoEntidadItem = Readonly<{
  id: string
  entidad_nombre: string
  tipo_incapacidad: string
  valor_limite: number
  unidad_limite: string
  dias_limite: number
  dias_alerta: number
  dias_promedio_pago?: number | null
}>

export type PlazosEntidadListResponse = Readonly<{
  items: PlazoEntidadItem[]
  total: number
}>

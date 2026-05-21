/** Item de `GET /pagos/radicados-disponibles` (SCRUM-206). */
export type RadicadoDisponible = Readonly<{
  incapacidad_id: string
  radicado: string
  colaborador_nombre?: string | null
  colaborador_email?: string | null
  entidad_nombre?: string | null
  fecha_recepcion?: string | null
}>

export type RadicadosDisponiblesResponse = Readonly<{
  items: readonly RadicadoDisponible[]
  total: number
  pages: number
  page?: number
}>

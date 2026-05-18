/**
 * Ítem de `GET /incapacidades/mias` (ver docs/README.md).
 */
export type MisIncapacidadItem = Readonly<{
  id: string
  radicado: string
  estado: string
  updated_at: string
}>

export type MisIncapacidadesResponse = Readonly<{
  items: MisIncapacidadItem[]
  total: number
  pages: number
}>

/** Ítem de `GET /colaboradores/buscar` (SCRUM-197). */
export type ColaboradorBusquedaItem = Readonly<{
  id: string
  nombre_completo: string
  numero_documento: string
  email: string
}>

export type ColaboradoresBuscarResponse = Readonly<{
  items: ColaboradorBusquedaItem[]
}>

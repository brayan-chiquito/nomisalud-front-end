/** Ítem de `GET /auditoria/accesos` (SCRUM-205). */
export type AuditoriaAccesoItem = Readonly<{
  id: string
  user_id: string
  usuario_email?: string | null
  usuario_nombre?: string | null
  accion: string
  recurso_id?: string | null
  ip?: string | null
  timestamp: string
}>

export type AuditoriaAccesosListResponse = Readonly<{
  items: AuditoriaAccesoItem[]
  total: number
  pages: number
  page: number
  page_size: number
}>

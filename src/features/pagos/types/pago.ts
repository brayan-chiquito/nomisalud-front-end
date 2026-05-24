/**
 * Dominio de pagos (`POST/GET /api/v1/pagos`) — ver `docs/README.md`.
 * El backend puede enviar fechas o montos con nombres ligeramente distintos; el front normaliza en utilidades.
 */
export type PagoListItem = Readonly<{
  id: string
  entidad_origen: string
  referencia: string
  /** Monto como número o string decimal (ej. "1500000.50"). */
  monto: string | number
  estado?: string | null
  /** Fecha de la operación o alta del registro (ISO). */
  fecha_operacion?: string | null
  fecha_registro?: string | null
  created_at?: string | null
  radicados?: readonly string[] | null
}>

export type PagosListResponse = Readonly<{
  items: readonly PagoListItem[]
  total: number
  pages: number
}>

export type CreatePagoPayload = Readonly<{
  entidad_origen: string
  referencia: string
  monto: string
  radicados: readonly string[]
}>

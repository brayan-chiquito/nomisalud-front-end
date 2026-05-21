import type { PagoListItem } from '../types/pago'

export function fechaPagoIso(item: PagoListItem): string {
  return (item.fecha_operacion ?? item.fecha_registro ?? item.created_at ?? '').trim()
}

export function formatFechaPago(iso: string): string {
  if (!iso) return '—'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleString('es-CO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatMontoPago(monto: string | number): string {
  const n = typeof monto === 'string' ? Number.parseFloat(monto.replace(',', '.')) : monto
  if (!Number.isFinite(n)) return String(monto)
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 2,
  }).format(n)
}

export function labelEstadoPago(estado: string | null | undefined): string {
  if (!estado?.trim()) return '—'
  const e = estado.trim().toLowerCase()
  if (e === 'registrado') return 'Registrado'
  if (e === 'anulado') return 'Anulado'
  return estado
}

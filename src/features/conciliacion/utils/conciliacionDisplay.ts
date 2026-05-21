const MESES = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
] as const

export function labelMes(mes: number): string {
  if (mes >= 1 && mes <= 12) return MESES[mes - 1]
  return String(mes)
}

export function formatMontoConciliacion(valor: string | number): string {
  const n = typeof valor === 'string' ? Number.parseFloat(valor.replace(',', '.')) : valor
  if (!Number.isFinite(n)) return String(valor)
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 2,
  }).format(n)
}

export function formatFechaConciliacion(iso: string): string {
  if (!iso) return '—'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString('es-CO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

export function aniosConciliacionOptions(centro = new Date().getFullYear()): number[] {
  const years: number[] = []
  for (let y = centro - 5; y <= centro + 1; y += 1) years.push(y)
  return years
}

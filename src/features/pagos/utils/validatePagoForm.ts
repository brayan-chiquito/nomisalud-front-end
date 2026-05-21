export type PagoFormFields = Readonly<{
  entidadOrigen: string
  referencia: string
  monto: string
  radicadosCount: number
}>

export function validatePagoFormFields(fields: PagoFormFields): Record<string, string> {
  const fe: Record<string, string> = {}
  if (!fields.entidadOrigen.trim()) fe.entidad_origen = 'Indica la entidad origen del pago.'
  if (!fields.referencia.trim()) fe.referencia = 'Indica el número o código de referencia.'

  const montoTrim = fields.monto.trim()
  if (montoTrim.length === 0) {
    fe.monto = 'Indica el monto.'
  } else {
    const n = Number.parseFloat(montoTrim.replace(',', '.'))
    if (!Number.isFinite(n) || n <= 0) {
      fe.monto = 'El monto debe ser un número mayor que cero.'
    }
  }

  if (fields.radicadosCount === 0) {
    fe.radicados = 'Selecciona al menos una incapacidad en estado cobrada.'
  }
  return fe
}

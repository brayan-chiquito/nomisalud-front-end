export type UsuarioFormExtraValues = Readonly<{
  tipo_documento: string
  numero_documento: string
  area: string
  cargo: string
  eps_afiliacion: string
  arl_afiliacion: string
}>

export function buildOptionalUsuarioFields(
  extra: UsuarioFormExtraValues,
): Record<string, string> | undefined {
  const out: Record<string, string> = {}
  if (extra.tipo_documento.trim()) out.tipo_documento = extra.tipo_documento.trim()
  if (extra.numero_documento.trim()) out.numero_documento = extra.numero_documento.trim()
  if (extra.area.trim()) out.area = extra.area.trim()
  if (extra.cargo.trim()) out.cargo = extra.cargo.trim()
  if (extra.eps_afiliacion.trim()) out.eps_afiliacion = extra.eps_afiliacion.trim()
  if (extra.arl_afiliacion.trim()) out.arl_afiliacion = extra.arl_afiliacion.trim()
  return Object.keys(out).length > 0 ? out : undefined
}

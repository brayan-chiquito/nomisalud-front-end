import type { ReviewFormFields } from './reviewFormTypes'

export type { ReviewFormFields } from './reviewFormTypes'

export function emptyReviewForm(): ReviewFormFields {
  return {
    nombreColaborador: '',
    documentoColaborador: '',
    tipoIncapacidad: '',
    fechaInicio: '',
    fechaFin: '',
    diagnostico: '',
    codigoCie10: '',
    diasIncapacidad: '',
    entidadNombre: '',
    entidadTipo: '',
    entidadNit: '',
  }
}

function pickStr(v: unknown): string {
  if (v === null || v === undefined) return ''
  return String(v).trim()
}

function nestedObj(v: unknown): Record<string, unknown> {
  return v && typeof v === 'object' && !Array.isArray(v) ? (v as Record<string, unknown>) : {}
}

/** `diagnostico` puede ser string (UI) u objeto anidado (prompt IA); ver docs/README.md § detalle. */
function pickDiagnosticoNested(
  d: Record<string, unknown> | null | undefined,
  inc: Record<string, unknown>,
): { codigo: string; descripcion: string } {
  const blocks: Record<string, unknown>[] = []
  const rootD = d?.diagnostico
  const incD = inc.diagnostico
  if (rootD && typeof rootD === 'object' && !Array.isArray(rootD))
    blocks.push(rootD as Record<string, unknown>)
  if (incD && typeof incD === 'object' && !Array.isArray(incD))
    blocks.push(incD as Record<string, unknown>)
  for (const b of blocks) {
    const codigo = pickStr(
      b.codigo ?? b.codigo_cie10 ?? b.codigo_cie ?? b.cie10 ?? b.codigoCIE10 ?? b.codigo_cie_10,
    )
    const descripcion = pickStr(
      b.descripcion ??
        b.nombre ??
        b.texto ??
        (typeof b.diagnostico === 'string' ? b.diagnostico : ''),
    )
    if (codigo || descripcion) return { codigo, descripcion }
  }
  return { codigo: '', descripcion: '' }
}

/** La IA a veces devuelve `paciente` / `afiliado` en lugar de `colaborador`; prioridad: colaborador gana. */
function mergedPersonaBlock(
  d: Record<string, unknown> | null | undefined,
): Record<string, unknown> {
  if (!d) return {}
  return {
    ...nestedObj(d.paciente),
    ...nestedObj(d.afiliado),
    ...nestedObj(d.beneficiario),
    ...nestedObj(d.persona),
    ...nestedObj(d.trabajador),
    ...nestedObj(d.colaborador),
  }
}

/** Texto tipo "K30X - Dispepsia" o "J069: Infección…" → código + descripción. */
export function splitDiagnosticoCie10(raw: string): { codigo: string; descripcion: string } {
  const t = raw.trim()
  if (!t) return { codigo: '', descripcion: '' }
  // Guiones Unicode frecuentes en PDFs/IA: - ‐ ‑ – — −
  const m = /^([A-Z][A-Z0-9.-]*)\s*[-‐‑–—−:]\s*(.+)$/iu.exec(t)
  if (m && m[2].trim().length > 0) {
    return { codigo: m[1].toUpperCase(), descripcion: m[2].trim() }
  }
  return { codigo: '', descripcion: t }
}

/** Lee `datos_extraidos` de la extracción y llena el formulario de revisión. */
export function datosExtraidosToForm(
  d: Record<string, unknown> | null | undefined,
): ReviewFormFields {
  const col = mergedPersonaBlock(d ?? undefined)
  const inc = nestedObj(d?.incapacidad)
  const ent = nestedObj(d?.entidad)
  const root = d && typeof d === 'object' ? (d as Record<string, unknown>) : {}
  const nombreColaborador = pickStr(
    col.nombre_completo ??
      col.nombre ??
      col.nombres ??
      col.nombre_completo_colaborador ??
      col.nombre_paciente ??
      col.nombres_y_apellidos,
  )
  const documentoColaborador = pickStr(
    col.documento ??
      col.numero_documento ??
      col.cedula ??
      col.identificacion ??
      col.numero_identificacion ??
      col.documento_identidad ??
      col.cc ??
      col.numero_cedula,
  )
  const diagLine =
    (typeof inc.diagnostico === 'string' ? pickStr(inc.diagnostico) : '') ||
    pickStr(inc.diagnostico_principal) ||
    pickStr(inc.diagnostico_cie10) ||
    pickStr(inc.diagnostico_descripcion) ||
    pickStr(inc.descripcion_diagnostico) ||
    pickStr(inc['diagnosticoPrincipal']) ||
    pickStr(inc['diagnostico_principal_cie10']) ||
    (typeof root.diagnostico === 'string' ? pickStr(root.diagnostico) : '') ||
    pickStr(root.diagnostico_principal)
  let codigoCie10 = pickStr(
    inc.codigo_cie10 ??
      inc.cie10 ??
      inc.codigo_cie ??
      inc.codigoCIE10 ??
      inc.codigo_cie_10 ??
      inc.codigo_diagnostico ??
      root.codigo_cie10,
  )
  let diagnostico = diagLine
  const nestedDiag = pickDiagnosticoNested(d ?? undefined, inc)
  if (!codigoCie10 && nestedDiag.codigo) codigoCie10 = nestedDiag.codigo
  if (!diagnostico && nestedDiag.descripcion) diagnostico = nestedDiag.descripcion
  if (!codigoCie10 && diagLine) {
    const split = splitDiagnosticoCie10(diagLine)
    if (split.codigo) {
      codigoCie10 = split.codigo
      diagnostico = split.descripcion || diagLine
    }
  }
  return {
    nombreColaborador,
    documentoColaborador,
    tipoIncapacidad: pickStr(inc.tipo ?? inc.tipo_incapacidad ?? inc.origen),
    fechaInicio: pickStr(inc.fecha_inicio ?? inc.inicio),
    fechaFin: pickStr(inc.fecha_fin ?? inc.fin),
    diagnostico,
    codigoCie10,
    diasIncapacidad: pickStr(
      inc.dias ?? inc.dias_incapacidad ?? inc.dias_de_incapacidad ?? inc.total_dias,
    ),
    entidadNombre: pickStr(ent.nombre),
    entidadTipo: pickStr(ent.tipo),
    entidadNit: pickStr(ent.nit),
  }
}

/** Construye el JSON `datos_extraidos` para PUT verificar, preservando claves extra del original. */
export function mergeFormIntoDatosExtraidos(
  original: Record<string, unknown> | null | undefined,
  f: ReviewFormFields,
): Record<string, unknown> {
  const base = original && typeof original === 'object' ? { ...original } : {}
  const prevCol = nestedObj(base.colaborador)
  const prevInc = nestedObj(base.incapacidad)
  const prevEnt = nestedObj(base.entidad)
  const diasMerged =
    f.diasIncapacidad.trim() ||
    pickStr(prevInc.dias ?? prevInc.dias_incapacidad ?? prevInc.total_dias)
  const diagDesc = f.diagnostico.trim() || pickStr(prevInc.diagnostico)
  const diagCodigo = f.codigoCie10.trim() || pickStr(prevInc.codigo_cie10)
  const diagPrincipal =
    diagCodigo && diagDesc ? `${diagCodigo} - ${diagDesc}` : pickStr(prevInc.diagnostico_principal)

  return {
    ...base,
    colaborador: {
      ...prevCol,
      nombre_completo: f.nombreColaborador || pickStr(prevCol.nombre_completo),
      documento: f.documentoColaborador || pickStr(prevCol.documento),
    },
    incapacidad: {
      ...prevInc,
      tipo: f.tipoIncapacidad || pickStr(prevInc.tipo),
      fecha_inicio: f.fechaInicio || pickStr(prevInc.fecha_inicio),
      fecha_fin: f.fechaFin || pickStr(prevInc.fecha_fin),
      diagnostico: diagDesc || pickStr(prevInc.diagnostico),
      codigo_cie10: diagCodigo || pickStr(prevInc.codigo_cie10),
      diagnostico_principal: diagPrincipal,
      dias: diasMerged,
      total_dias: diasMerged,
    },
    entidad: {
      ...prevEnt,
      nombre: f.entidadNombre || pickStr(prevEnt.nombre),
      tipo: f.entidadTipo || pickStr(prevEnt.tipo),
      nit: f.entidadNit || pickStr(prevEnt.nit),
    },
  }
}

const VERIFY_ROLES = new Set(['admin', 'auxiliar_rrhh', 'coordinador_rrhh'])

export function canHumanVerifyIncapacidad(role: string | undefined): boolean {
  if (!role) return false
  return VERIFY_ROLES.has(role.trim().toLowerCase())
}

export function calidadDocPercent(raw: number | string | null | undefined): number | null {
  if (raw === null || raw === undefined || raw === '') return null
  const n = typeof raw === 'string' ? Number.parseFloat(raw) : raw
  if (!Number.isFinite(n)) return null
  if (n > 0 && n <= 1) return Math.round(n * 100)
  if (n > 1 && n <= 100) return Math.round(n)
  return Math.round(n)
}

export function contarAlertasValidacion(validaciones: unknown): number {
  if (!Array.isArray(validaciones)) return 0
  return validaciones.filter((v) => {
    if (!v || typeof v !== 'object') return false
    const o = v as Record<string, unknown>
    const nivel = pickStr(o.nivel ?? o.severidad).toLowerCase()
    if (nivel === 'error' || nivel === 'warning' || nivel === 'warn') return true
    return o.ok === false
  }).length
}

function parseFechaFlexible(s: string): number | null {
  const t = s.trim()
  if (!t) return null
  const dmY = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(t)
  if (dmY) {
    const d = new Date(Number(dmY[3]), Number(dmY[2]) - 1, Number(dmY[1]))
    return Number.isNaN(d.getTime()) ? null : d.getTime()
  }
  const iso = Date.parse(t)
  if (!Number.isNaN(iso)) return iso
  return null
}

/** Días inclusivos entre dos fechas si ambas se pueden interpretar; si no, null. */
export function computeDiasIncapacidad(inicio: string, fin: string): number | null {
  const a = parseFechaFlexible(inicio)
  const b = parseFechaFlexible(fin)
  if (a === null || b === null) return null
  const ms = Math.abs(b - a)
  return Math.floor(ms / 86_400_000) + 1
}

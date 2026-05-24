export type InconsistenciaItem = Readonly<{
  tipo: string
  descripcion: string
}>

/** Registro de `inconsistencias[]` en `GET /incapacidades/{id}` (docs/README.md). */
export type InconsistenciaRecord = Readonly<{
  id?: string
  tipo: string
  descripcion: string
  created_at?: string
}>

function pickStr(v: unknown): string {
  return typeof v === 'string' ? v.trim() : ''
}

function esHallazgoInconsistencia(o: Record<string, unknown>): boolean {
  const nivel = pickStr(o.nivel ?? o.severidad).toLowerCase()
  if (nivel === 'error' || nivel === 'warning' || nivel === 'warn') return true
  return o.ok === false
}

function mapHallazgo(o: Record<string, unknown>): InconsistenciaItem {
  const tipo =
    pickStr(o.tipo ?? o.tipo_validacion ?? o.campo ?? o.codigo ?? o.regla) || 'Validación'
  const descripcion =
    pickStr(o.descripcion ?? o.mensaje ?? o.detalle ?? o.message ?? o.texto) || 'Sin descripción'
  return { tipo, descripcion }
}

/**
 * Hallazgos desde `validaciones` en `extraccion_ia` (respaldo si el detalle no trae `inconsistencias[]`).
 */
export function inconsistenciasFromValidaciones(
  validaciones: unknown,
): readonly InconsistenciaItem[] {
  if (!Array.isArray(validaciones)) return []
  const out: InconsistenciaItem[] = []
  for (const v of validaciones) {
    if (!v || typeof v !== 'object') continue
    const o = v as Record<string, unknown>
    if (!esHallazgoInconsistencia(o)) continue
    out.push(mapHallazgo(o))
  }
  return out
}

function fromRecords(records: readonly InconsistenciaRecord[]): readonly InconsistenciaItem[] {
  return records
    .map((r) => ({
      tipo: pickStr(r.tipo) || 'Validación',
      descripcion: pickStr(r.descripcion) || 'Sin descripción',
    }))
    .filter((r) => r.descripcion !== 'Sin descripción' || r.tipo !== 'Validación')
}

/**
 * Prioriza `inconsistencias[]` del detalle (tabla BD); si viene vacío, usa `extraccion_ia.validaciones`.
 */
export function inconsistenciasFromDetalle(
  inconsistencias: readonly InconsistenciaRecord[] | null | undefined,
  validaciones: unknown,
): readonly InconsistenciaItem[] {
  const fromTable = inconsistencias ? fromRecords(inconsistencias) : []
  if (fromTable.length > 0) return fromTable
  return inconsistenciasFromValidaciones(validaciones)
}

/**
 * Tras registrar excepción, el backend deja el trámite en `en_verificacion` (PATCH estado + observación).
 */
export function overridePermiteContinuar(estado: string, overrideLocalOk: boolean): boolean {
  if (overrideLocalOk) return true
  return (
    estado === 'en_verificacion' ||
    estado === 'transcrita' ||
    estado === 'cobrada' ||
    estado === 'pagada'
  )
}

export function requiereOverrideAntesDeContinuar(
  estado: string,
  hallazgos: readonly InconsistenciaItem[],
): boolean {
  return hallazgos.length > 0 && estado === 'inconsistencia_detectada'
}

/** Normaliza el término de búsqueda para la API (`q`). */
export function normalizeListSearchTerm(term: string): string {
  return term.trim()
}

/**
 * Variantes de `q` para consultar el listado.
 * Si el correo completo no devuelve filas, reintenta con la parte local (antes de `@`).
 */
export function listSearchQueryVariants(term: string): readonly string[] {
  const normalized = normalizeListSearchTerm(term)
  if (!normalized) return []

  const variants = [normalized]
  const at = normalized.indexOf('@')
  if (at > 0) {
    const local = normalized.slice(0, at).trim()
    if (local.length >= 2 && local !== normalized) variants.push(local)
  }
  return variants
}

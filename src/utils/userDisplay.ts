/** Nombre legible a partir del correo (p. ej. panel RRHH). */
export function displayNameFromEmail(email: string | undefined): string {
  if (!email) return 'Usuario'
  const local = email.split('@')[0] ?? email
  return local.replaceAll('.', ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

/** Iniciales para avatar cuando no hay foto. */
export function initialsFromEmail(email: string | undefined, id: string | undefined): string {
  if (email && email.length >= 2) return email.slice(0, 2).toUpperCase()
  if (id && id.length >= 2) return id.slice(0, 2).toUpperCase()
  return 'NS'
}

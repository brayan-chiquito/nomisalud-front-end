import { describe, it, expect } from 'vitest'
import { formatUsuarioFecha, labelUsuarioRole } from './usuarioAdminDisplay'

describe('usuarioAdminDisplay', () => {
  it('labelUsuarioRole devuelve etiqueta conocida', () => {
    expect(labelUsuarioRole('admin')).toBe('Administrador')
    expect(labelUsuarioRole('desconocido')).toBe('desconocido')
  })

  it('formatUsuarioFecha formatea ISO', () => {
    const out = formatUsuarioFecha('2026-01-15T10:00:00Z')
    expect(out).toMatch(/\d{2}\/\d{2}\/\d{4}/)
  })
})

import { describe, it, expect } from 'vitest'
import {
  accessDeniedRedirectForRole,
  FINANZAS_HOME_PATH,
  isContabilidadRole,
  ROLES_MODULO_FINANZAS,
} from './roleAccess'

describe('roleAccess', () => {
  it('identifica rol contabilidad', () => {
    expect(isContabilidadRole('contabilidad')).toBe(true)
    expect(isContabilidadRole('admin')).toBe(false)
  })

  it('incluye contabilidad en roles del módulo financiero', () => {
    expect(ROLES_MODULO_FINANZAS).toContain('contabilidad')
  })

  it('redirige contabilidad al inicio financiero cuando se deniega acceso', () => {
    expect(accessDeniedRedirectForRole('contabilidad')).toBe(FINANZAS_HOME_PATH)
  })

  it('redirige otros roles a login por defecto', () => {
    expect(accessDeniedRedirectForRole('colaborador')).toBe('/login')
  })

  it('respeta redirect explícito', () => {
    expect(accessDeniedRedirectForRole('contabilidad', '/custom')).toBe('/custom')
  })
})

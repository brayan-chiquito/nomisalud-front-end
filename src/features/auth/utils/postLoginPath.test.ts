import { describe, it, expect } from 'vitest'
import { getPostLoginPathFromToken, postLoginPathForRole } from './postLoginPath'

describe('postLoginPathForRole', () => {
  it('envía colaborador al portal', () => {
    expect(postLoginPathForRole('colaborador')).toBe('/portal/mi-tramite')
  })

  it('envía RRHH al dashboard', () => {
    expect(postLoginPathForRole('admin')).toBe('/dashboard')
    expect(postLoginPathForRole('auxiliar_rrhh')).toBe('/dashboard')
  })
})

describe('getPostLoginPathFromToken', () => {
  it('lee el rol del JWT', () => {
    const payload = btoa(JSON.stringify({ user_id: '1', email: 'a@t.com', role: 'colaborador' }))
    const token = `h.${payload}.s`
    expect(getPostLoginPathFromToken(token)).toBe('/portal/mi-tramite')
  })
})

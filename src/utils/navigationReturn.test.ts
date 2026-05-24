import { describe, it, expect } from 'vitest'
import {
  currentAppPath,
  isDashboardReturnPath,
  navigationReturnState,
  readReturnTo,
  sanitizeReturnTo,
} from './navigationReturn'

describe('navigationReturn', () => {
  it('sanitizeReturnTo acepta rutas internas', () => {
    expect(sanitizeReturnTo('/dashboard/cobro-ante-entidad')).toBe('/dashboard/cobro-ante-entidad')
    expect(sanitizeReturnTo('https://evil.com')).toBeNull()
    expect(sanitizeReturnTo('//evil.com')).toBeNull()
  })

  it('readReturnTo lee state de router', () => {
    expect(readReturnTo({ returnTo: '/dashboard/pagos' })).toBe('/dashboard/pagos')
    expect(readReturnTo(null)).toBeNull()
  })

  it('currentAppPath incluye query y hash', () => {
    expect(
      currentAppPath({
        pathname: '/dashboard',
        search: '?x=1',
        hash: '#panel-incapacidades',
      }),
    ).toBe('/dashboard?x=1#panel-incapacidades')
  })

  it('isDashboardReturnPath detecta dashboard', () => {
    expect(isDashboardReturnPath('/dashboard')).toBe(true)
    expect(isDashboardReturnPath('/dashboard?success=confirmada')).toBe(true)
    expect(isDashboardReturnPath('/dashboard/cobro-ante-entidad')).toBe(false)
  })

  it('navigationReturnState ignora rutas inválidas', () => {
    expect(navigationReturnState('/admin/plazos-entidad')).toEqual({
      returnTo: '/admin/plazos-entidad',
    })
    expect(navigationReturnState('bad')).toEqual({})
  })
})

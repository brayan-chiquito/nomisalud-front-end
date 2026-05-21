import { describe, it, expect } from 'vitest'
import axios from 'axios'
import {
  FINANCIAL_MODULE_ONLY_MESSAGE,
  isRestrictedDocumentApiPath,
  messageFromFinancialForbiddenError,
  RADICADOS_DISPONIBLES_API_PATH,
} from './financialModuleAccess'

describe('financialModuleAccess', () => {
  it('detecta rutas restringidas para contabilidad', () => {
    expect(isRestrictedDocumentApiPath('/api/v1/incapacidades')).toBe(true)
    expect(isRestrictedDocumentApiPath('/colaboradores/buscar')).toBe(true)
    expect(isRestrictedDocumentApiPath(RADICADOS_DISPONIBLES_API_PATH)).toBe(false)
  })

  it('devuelve mensaje financiero en 403 de incapacidades para contabilidad', () => {
    const err = new axios.AxiosError('Forbidden', '403', undefined, undefined, {
      status: 403,
      data: {},
      statusText: 'Forbidden',
      headers: {},
      config: {} as never,
    })
    Object.assign(err, { config: { url: '/incapacidades' } })
    expect(messageFromFinancialForbiddenError(err, 'contabilidad')).toBe(
      FINANCIAL_MODULE_ONLY_MESSAGE,
    )
  })

  it('no aplica mensaje financiero a otros roles', () => {
    const err = new axios.AxiosError('Forbidden', '403', undefined, undefined, {
      status: 403,
      data: {},
      statusText: 'Forbidden',
      headers: {},
      config: {} as never,
    })
    Object.assign(err, { config: { url: '/incapacidades' } })
    expect(messageFromFinancialForbiddenError(err, 'admin')).toBeNull()
  })
})

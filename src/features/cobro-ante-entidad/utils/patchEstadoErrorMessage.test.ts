import { describe, it, expect } from 'vitest'
import axios from 'axios'
import { messageFromPatchEstadoError } from './patchEstadoErrorMessage'

describe('messageFromPatchEstadoError', () => {
  it('prioriza detail del API cuando existe', () => {
    const err = new axios.AxiosError('fail', 'ERR', undefined, undefined, {
      status: 409,
      data: { detail: 'Transición no permitida de en_verificacion a cobrada.' },
      statusText: 'Conflict',
      headers: {},
      config: {} as never,
    })
    expect(messageFromPatchEstadoError(err)).toBe(
      'Transición no permitida de en_verificacion a cobrada.',
    )
  })

  it('mapea 403 sin detail', () => {
    const err = new axios.AxiosError('fail', 'ERR', undefined, undefined, {
      status: 403,
      data: {},
      statusText: 'Forbidden',
      headers: {},
      config: {} as never,
    })
    expect(messageFromPatchEstadoError(err)).toBe('No tienes permisos para realizar esta acción.')
  })

  it('mapea 404 sin detail', () => {
    const err = new axios.AxiosError('fail', 'ERR', undefined, undefined, {
      status: 404,
      data: {},
      statusText: 'Not Found',
      headers: {},
      config: {} as never,
    })
    expect(messageFromPatchEstadoError(err)).toBe('Incapacidad no encontrada.')
  })

  it('devuelve mensaje genérico para Error', () => {
    expect(messageFromPatchEstadoError(new Error('red'))).toBe('red')
  })
})

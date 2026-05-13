import { describe, it, expect } from 'vitest'
import { AxiosError } from 'axios'
import { messageFromHttpError } from './httpErrorMessage'

describe('messageFromHttpError', () => {
  it('usa detail string de Axios', () => {
    const err = new AxiosError('x')
    err.response = { status: 400, data: { detail: 'No autorizado' } } as never
    expect(messageFromHttpError(err)).toBe('No autorizado')
  })

  it('usa message de Axios si detail no es string', () => {
    const err = new AxiosError('fallo de red')
    err.response = { status: 500, data: { detail: { x: 1 } } } as never
    expect(messageFromHttpError(err)).toBe('fallo de red')
  })

  it('usa Error genérico', () => {
    expect(messageFromHttpError(new Error('timeout'))).toBe('timeout')
  })

  it('mensaje por defecto para valores desconocidos', () => {
    expect(messageFromHttpError(123)).toBe('Ocurrió un error inesperado. Intenta de nuevo.')
  })

  it('usa message de Axios sin response body', () => {
    const err = new AxiosError('Network Error')
    expect(messageFromHttpError(err)).toBe('Network Error')
  })
})

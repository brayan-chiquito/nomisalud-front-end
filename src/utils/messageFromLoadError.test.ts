import { describe, it, expect } from 'vitest'
import axios from 'axios'
import { messageFromLoadError } from './messageFromLoadError'

describe('messageFromLoadError', () => {
  it('lee detail del API', () => {
    const err = new axios.AxiosError('fail', 'ERR', undefined, undefined, {
      status: 400,
      data: { detail: 'Listado no disponible' },
      statusText: 'Bad',
      headers: {},
      config: {} as never,
    })
    expect(messageFromLoadError(err, 'fallback')).toBe('Listado no disponible')
  })

  it('usa fallback genérico', () => {
    expect(messageFromLoadError(new Error('x'), 'fallback')).toBe('x')
    expect(messageFromLoadError({}, 'fallback')).toBe('fallback')
  })
})

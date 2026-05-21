import { describe, it, expect } from 'vitest'
import axios from 'axios'
import {
  EXPORT_INCAPACIDADES_FORBIDDEN,
  EXPORT_INCAPACIDADES_TOO_LARGE_HINT,
  messageFromIncapacidadesExportError,
} from './incapacidadesExportMessage'

describe('incapacidadesExportMessage', () => {
  it('mapea 403 a mensaje de permisos', async () => {
    const err = new axios.AxiosError('Forbidden', '403', undefined, undefined, {
      status: 403,
      data: {},
      statusText: 'Forbidden',
      headers: {},
      config: {} as never,
    })
    expect(await messageFromIncapacidadesExportError(err)).toBe(EXPORT_INCAPACIDADES_FORBIDDEN)
  })

  it('mapea 413 con detail del backend', async () => {
    const err = new axios.AxiosError('Large', '413', undefined, undefined, {
      status: 413,
      data: new Blob([JSON.stringify({ detail: 'Refina filtros' })], { type: 'application/json' }),
      statusText: 'Payload Too Large',
      headers: {},
      config: {} as never,
    })
    expect(await messageFromIncapacidadesExportError(err)).toBe('Refina filtros')
  })

  it('usa hint por defecto en 413 sin detail', async () => {
    const err = new axios.AxiosError('Large', '413', undefined, undefined, {
      status: 413,
      data: new Blob(['not-json'], { type: 'text/plain' }),
      statusText: 'Payload Too Large',
      headers: {},
      config: {} as never,
    })
    expect(await messageFromIncapacidadesExportError(err)).toBe(EXPORT_INCAPACIDADES_TOO_LARGE_HINT)
  })
})

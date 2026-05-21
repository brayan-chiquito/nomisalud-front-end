import { describe, it, expect } from 'vitest'
import { filenameFromContentDisposition } from './downloadBlob'

describe('filenameFromContentDisposition', () => {
  it('extrae filename entre comillas', () => {
    expect(filenameFromContentDisposition('attachment; filename="conciliacion_2024_05.xlsx"')).toBe(
      'conciliacion_2024_05.xlsx',
    )
  })

  it('devuelve null sin header', () => {
    expect(filenameFromContentDisposition(undefined)).toBeNull()
  })
})

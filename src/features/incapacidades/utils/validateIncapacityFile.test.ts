import { describe, it, expect } from 'vitest'
import { validateIncapacityFile, INCAPACITY_MAX_BYTES } from './validateIncapacityFile'

describe('validateIncapacityFile', () => {
  it('acepta PDF con MIME correcto', () => {
    const file = new File(['%PDF'], 'doc.pdf', { type: 'application/pdf' })
    expect(validateIncapacityFile(file)).toBeNull()
  })

  it('acepta PNG', () => {
    const file = new File(['x'], 'x.png', { type: 'image/png' })
    expect(validateIncapacityFile(file)).toBeNull()
  })

  it('acepta JPEG', () => {
    const file = new File(['x'], 'x.jpg', { type: 'image/jpeg' })
    expect(validateIncapacityFile(file)).toBeNull()
  })

  it('acepta archivo sin MIME pero extensión permitida', () => {
    const file = new File(['x'], 'legacy.pdf', { type: '' })
    expect(validateIncapacityFile(file)).toBeNull()
  })

  it('rechaza si supera el tamaño máximo', () => {
    const buf = new Uint8Array(INCAPACITY_MAX_BYTES + 1)
    const file = new File([buf], 'big.pdf', { type: 'application/pdf' })
    const err = validateIncapacityFile(file)
    expect(err?.code).toBe('SIZE')
    expect(err?.message).toMatch(/10 MB/)
  })

  it('rechaza tipo no permitido', () => {
    const file = new File(['x'], 'x.exe', { type: 'application/octet-stream' })
    const err = validateIncapacityFile(file)
    expect(err?.code).toBe('TYPE')
  })

  it('rechaza extensión no permitida sin MIME', () => {
    const file = new File(['x'], 'x.doc', { type: '' })
    const err = validateIncapacityFile(file)
    expect(err?.code).toBe('TYPE')
  })
})

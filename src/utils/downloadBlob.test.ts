import { describe, it, expect, vi, afterEach } from 'vitest'
import { filenameFromContentDisposition, triggerBrowserDownload } from './downloadBlob'

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

describe('triggerBrowserDownload', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('crea enlace temporal y dispara descarga', () => {
    const click = vi.fn()
    const remove = vi.fn()
    const anchor = {
      href: '',
      download: '',
      rel: '',
      click,
      remove,
    } as unknown as HTMLAnchorElement
    vi.spyOn(document, 'createElement').mockReturnValue(anchor)
    vi.spyOn(document.body, 'appendChild').mockImplementation(() => anchor)
    vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:test')
    const revoke = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => undefined)

    triggerBrowserDownload(new Blob(['x']), 'reporte.xlsx')

    expect(anchor.download).toBe('reporte.xlsx')
    expect(anchor.href).toBe('blob:test')
    expect(click).toHaveBeenCalled()
    expect(remove).toHaveBeenCalled()
    expect(revoke).toHaveBeenCalledWith('blob:test')
  })
})

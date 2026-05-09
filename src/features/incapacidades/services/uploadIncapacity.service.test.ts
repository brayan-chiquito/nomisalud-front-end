import { describe, it, expect, vi, beforeEach } from 'vitest'
import { AxiosError } from 'axios'
import { uploadIncapacityFile } from './uploadIncapacity.service'

vi.mock('@/services/uploadHttp', () => ({
  uploadHttp: {
    post: vi.fn(),
  },
}))

import { uploadHttp } from '@/services/uploadHttp'

describe('uploadIncapacityFile', () => {
  beforeEach(() => {
    vi.mocked(uploadHttp.post).mockReset()
  })

  it('envía multipart y devuelve el cuerpo de la respuesta', async () => {
    vi.mocked(uploadHttp.post).mockResolvedValue({ data: { tramite_id: '1' } })
    const file = new File(['x'], 'a.pdf', { type: 'application/pdf' })

    const result = await uploadIncapacityFile(file)

    expect(result).toEqual({ tramite_id: '1' })
    expect(uploadHttp.post).toHaveBeenCalledWith(
      '/incapacidades/upload',
      expect.any(FormData),
      expect.objectContaining({
        onUploadProgress: expect.any(Function),
      }),
    )
    const fd = vi.mocked(uploadHttp.post).mock.calls[0][1] as FormData
    expect(fd.get('archivo')).toBe(file)
  })

  it('adjunta colaborador_id cuando se proporciona', async () => {
    vi.mocked(uploadHttp.post).mockResolvedValue({ data: {} })
    const file = new File(['x'], 'a.pdf', { type: 'application/pdf' })
    await uploadIncapacityFile(file, { colaboradorId: 'uuid-123' })
    const fd = vi.mocked(uploadHttp.post).mock.calls[0][1] as FormData
    expect(fd.get('colaborador_id')).toBe('uuid-123')
  })

  it('invoca onProgress con el porcentaje', async () => {
    const onProgress = vi.fn()
    vi.mocked(uploadHttp.post).mockImplementation((_url, _data, config) => {
      config?.onUploadProgress?.({
        loaded: 50,
        total: 100,
        lengthComputable: true,
        bytes: 50,
      })
      return Promise.resolve({ data: { ok: true } })
    })

    await uploadIncapacityFile(new File(['x'], 'a.pdf', { type: 'application/pdf' }), {
      onProgress,
    })

    expect(onProgress).toHaveBeenCalledWith(50)
  })

  it('lanza Error con el detalle del backend', async () => {
    const err = new AxiosError('fail')
    err.response = {
      status: 400,
      data: { detail: 'Archivo corrupto' },
    } as AxiosError['response']
    vi.mocked(uploadHttp.post).mockRejectedValue(err)

    await expect(
      uploadIncapacityFile(new File(['x'], 'a.pdf', { type: 'application/pdf' })),
    ).rejects.toThrow('Archivo corrupto')
  })

  it('lanza mensaje genérico si no es AxiosError', async () => {
    vi.mocked(uploadHttp.post).mockRejectedValue(new Error('oops'))
    await expect(
      uploadIncapacityFile(new File(['x'], 'a.pdf', { type: 'application/pdf' })),
    ).rejects.toThrow('oops')
  })

  it('lanza mensaje genérico para AxiosError sin detail', async () => {
    vi.mocked(uploadHttp.post).mockRejectedValue(new AxiosError('fail'))
    await expect(
      uploadIncapacityFile(new File(['x'], 'a.pdf', { type: 'application/pdf' })),
    ).rejects.toThrow(/No se pudo completar la carga/)
  })

  it('usa el primer mensaje si detail es lista (FastAPI)', async () => {
    const err = new AxiosError('fail')
    err.response = {
      status: 422,
      data: { detail: [{ msg: 'Campo inválido' }] },
    } as AxiosError['response']
    vi.mocked(uploadHttp.post).mockRejectedValue(err)
    await expect(
      uploadIncapacityFile(new File(['x'], 'a.pdf', { type: 'application/pdf' })),
    ).rejects.toThrow('Campo inválido')
  })

  it('usa message si viene en el cuerpo', async () => {
    const err = new AxiosError('fail')
    err.response = {
      status: 500,
      data: { message: 'Error interno' },
    } as AxiosError['response']
    vi.mocked(uploadHttp.post).mockRejectedValue(err)
    await expect(
      uploadIncapacityFile(new File(['x'], 'a.pdf', { type: 'application/pdf' })),
    ).rejects.toThrow('Error interno')
  })

  it('ignora detail en lista sin msg útil y usa message si existe', async () => {
    const err = new AxiosError('fail')
    err.response = {
      status: 422,
      data: { detail: [{}], message: 'Validación' },
    } as AxiosError['response']
    vi.mocked(uploadHttp.post).mockRejectedValue(err)
    await expect(
      uploadIncapacityFile(new File(['x'], 'a.pdf', { type: 'application/pdf' })),
    ).rejects.toThrow('Validación')
  })

  it('lanza Error genérico si la causa no es Error', async () => {
    vi.mocked(uploadHttp.post).mockRejectedValue('fatal')
    await expect(
      uploadIncapacityFile(new File(['x'], 'a.pdf', { type: 'application/pdf' })),
    ).rejects.toThrow(/No se pudo completar la carga/)
  })
})

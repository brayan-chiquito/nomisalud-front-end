import { describe, it, expect, vi, beforeEach } from 'vitest'
import { buscarColaboradores } from './buscarColaboradores.service'

vi.mock('@/services/http', () => ({
  http: { get: vi.fn() },
}))

import { http } from '@/services/http'

describe('buscarColaboradores', () => {
  beforeEach(() => {
    vi.mocked(http.get).mockReset()
  })

  it('retorna vacío si la consulta tiene menos de 2 caracteres', async () => {
    await expect(buscarColaboradores({ q: 'a' })).resolves.toEqual([])
    expect(http.get).not.toHaveBeenCalled()
  })

  it('consulta el endpoint con q y limit', async () => {
    vi.mocked(http.get).mockResolvedValue({
      data: {
        items: [
          {
            id: 'uuid-1',
            nombre_completo: 'Ana Pérez',
            numero_documento: '123',
            email: 'ana@test.com',
          },
        ],
      },
    })

    const items = await buscarColaboradores({ q: 'ana', limit: 5 })
    expect(items).toHaveLength(1)
    expect(http.get).toHaveBeenCalledWith('/colaboradores/buscar', {
      params: { q: 'ana', limit: 5 },
      signal: undefined,
    })
  })

  it('retorna arreglo vacío si items no viene en la respuesta', async () => {
    vi.mocked(http.get).mockResolvedValue({ data: {} })
    await expect(buscarColaboradores({ q: 'xx' })).resolves.toEqual([])
  })

  it('normaliza respuesta como arreglo directo', async () => {
    vi.mocked(http.get).mockResolvedValue({
      data: [
        {
          id: 'uuid-2',
          nombre: 'Laura M',
          documento: '200',
          email: 'l@test.com',
        },
      ],
    })
    const items = await buscarColaboradores({ q: 'lau' })
    expect(items).toEqual([
      {
        id: 'uuid-2',
        nombre_completo: 'Laura M',
        numero_documento: '200',
        email: 'l@test.com',
      },
    ])
  })

  it('normaliza claves results en el cuerpo', async () => {
    vi.mocked(http.get).mockResolvedValue({
      data: {
        results: [{ id: 'x1', nombre_completo: 'Ana', numero_documento: '1', email: 'a@t.com' }],
      },
    })
    const items = await buscarColaboradores({ q: 'an' })
    expect(items).toHaveLength(1)
  })
})

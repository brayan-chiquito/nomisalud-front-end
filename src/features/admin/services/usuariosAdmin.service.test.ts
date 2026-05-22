import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  listUsuariosAdmin,
  getUsuarioAdmin,
  createUsuarioAdmin,
  updateUsuarioAdmin,
  deactivateUsuarioAdmin,
  resetUsuarioAdminPassword,
  changeOwnPassword,
} from './usuariosAdmin.service'

vi.mock('@/services/http', () => ({
  http: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}))

import { http } from '@/services/http'

describe('usuariosAdmin.service', () => {
  beforeEach(() => {
    vi.mocked(http.get).mockReset()
    vi.mocked(http.post).mockReset()
    vi.mocked(http.put).mockReset()
    vi.mocked(http.delete).mockReset()
  })

  it('listUsuariosAdmin GET con paginación y filtros', async () => {
    vi.mocked(http.get).mockResolvedValue({
      data: { items: [], total: 0, page: 1, page_size: 20, pages: 0 },
    })
    await listUsuariosAdmin({ page: 2, role: 'admin', activo: true, q: 'ana' })
    expect(http.get).toHaveBeenCalledWith('/admin/usuarios', {
      params: { page: 2, page_size: 20, role: 'admin', activo: 'true', q: 'ana' },
      signal: undefined,
    })
  })

  it('listUsuariosAdmin envía activo false', async () => {
    vi.mocked(http.get).mockResolvedValue({
      data: { items: [], total: 0, page: 1, page_size: 20, pages: 0 },
    })
    await listUsuariosAdmin({ activo: false })
    expect(http.get).toHaveBeenCalledWith('/admin/usuarios', {
      params: { page: 1, page_size: 20, activo: 'false' },
      signal: undefined,
    })
  })

  it('getUsuarioAdmin GET por id', async () => {
    const usuario = { id: 'u1', email: 'a@b.com', role: 'admin', activo: true, created_at: '' }
    vi.mocked(http.get).mockResolvedValue({ data: usuario })
    const res = await getUsuarioAdmin('u1')
    expect(res).toEqual(usuario)
    expect(http.get).toHaveBeenCalledWith('/admin/usuarios/u1', { signal: undefined })
  })

  it('createUsuarioAdmin POST', async () => {
    const created = {
      id: 'u1',
      email: 'a@b.com',
      role: 'colaborador',
      activo: true,
      created_at: '',
    }
    vi.mocked(http.post).mockResolvedValue({ data: created })
    const res = await createUsuarioAdmin({
      email: 'a@b.com',
      password: 'secret123',
      role: 'colaborador',
    })
    expect(res).toEqual(created)
    expect(http.post).toHaveBeenCalledWith('/admin/usuarios', expect.any(Object), {
      signal: undefined,
    })
  })

  it('updateUsuarioAdmin PUT', async () => {
    vi.mocked(http.put).mockResolvedValue({ data: { id: 'u1' } })
    await updateUsuarioAdmin('u1', { email: 'n@b.com' })
    expect(http.put).toHaveBeenCalledWith(
      '/admin/usuarios/u1',
      { email: 'n@b.com' },
      {
        signal: undefined,
      },
    )
  })

  it('deactivateUsuarioAdmin DELETE', async () => {
    vi.mocked(http.delete).mockResolvedValue({})
    await deactivateUsuarioAdmin('u1')
    expect(http.delete).toHaveBeenCalledWith('/admin/usuarios/u1', { signal: undefined })
  })

  it('resetUsuarioAdminPassword PUT password', async () => {
    vi.mocked(http.put).mockResolvedValue({})
    await resetUsuarioAdminPassword('u1', 'nueva1234')
    expect(http.put).toHaveBeenCalledWith(
      '/admin/usuarios/u1/password',
      { password: 'nueva1234' },
      { signal: undefined },
    )
  })

  it('changeOwnPassword PUT /auth/password', async () => {
    vi.mocked(http.put).mockResolvedValue({})
    await changeOwnPassword({ password_actual: 'old', password_nueva: 'new12345' })
    expect(http.put).toHaveBeenCalledWith(
      '/auth/password',
      { password_actual: 'old', password_nueva: 'new12345' },
      { signal: undefined },
    )
  })
})

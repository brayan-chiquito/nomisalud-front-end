import { describe, it, expect, vi, beforeEach } from 'vitest'
import { buscarUsuariosAuditoria, resolveAuditoriaUserId } from './buscarUsuariosAuditoria.service'
import { buscarColaboradores } from '@/features/recepcion/services/buscarColaboradores.service'
import { listUsuariosAdmin } from '@/features/admin/services/usuariosAdmin.service'

vi.mock('@/features/recepcion/services/buscarColaboradores.service', () => ({
  buscarColaboradores: vi.fn(),
}))

vi.mock('@/features/admin/services/usuariosAdmin.service', () => ({
  listUsuariosAdmin: vi.fn(),
}))

describe('buscarUsuariosAuditoria', () => {
  beforeEach(() => {
    vi.mocked(buscarColaboradores).mockReset()
    vi.mocked(listUsuariosAdmin).mockReset()
  })

  it('combina colaboradores y usuarios admin cuando includeAdminDirectory', async () => {
    vi.mocked(buscarColaboradores).mockResolvedValue([
      {
        id: 'c1',
        email: 'col@test.com',
        nombre_completo: 'Colaborador',
        numero_documento: '1',
      },
    ])
    vi.mocked(listUsuariosAdmin).mockResolvedValue({
      items: [
        {
          id: 'a1',
          email: 'admin@nomisalud.com',
          nombre_completo: 'Admin',
          role: 'admin',
          activo: true,
          created_at: '',
          tipo_documento: null,
          numero_documento: null,
          area: null,
          cargo: null,
          eps_afiliacion: null,
          arl_afiliacion: null,
        },
      ],
      total: 1,
      page: 1,
      page_size: 15,
      pages: 1,
    })

    const items = await buscarUsuariosAuditoria({
      q: 'admin',
      includeAdminDirectory: true,
    })
    expect(items.some((i) => i.email === 'admin@nomisalud.com')).toBe(true)
    expect(listUsuariosAdmin).toHaveBeenCalled()
  })

  it('resolveAuditoriaUserId devuelve UUID si el término ya es UUID', async () => {
    const res = await resolveAuditoriaUserId('550e8400-e29b-41d4-a716-446655440000', false)
    expect(res.userId).toBe('550e8400-e29b-41d4-a716-446655440000')
    expect(buscarColaboradores).not.toHaveBeenCalled()
  })
})

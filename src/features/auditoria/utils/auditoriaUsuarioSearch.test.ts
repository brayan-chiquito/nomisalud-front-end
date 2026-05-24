import { describe, it, expect } from 'vitest'
import {
  matchesAuditoriaUsuarioRow,
  pickUniqueUsuarioAuditoriaOption,
  usuarioAuditoriaOptionLabel,
} from './auditoriaUsuarioSearch'

describe('auditoriaUsuarioSearch', () => {
  it('usuarioAuditoriaOptionLabel combina nombre y correo', () => {
    expect(usuarioAuditoriaOptionLabel('a@test.com', 'Ana')).toBe('Ana · a@test.com')
  })

  it('pickUniqueUsuarioAuditoriaOption elige por correo exacto', () => {
    const options = [
      { id: '1', email: 'admin@test.com', label: 'Admin · admin@test.com' },
      { id: '2', email: 'other@test.com', label: 'Otro' },
    ]
    expect(pickUniqueUsuarioAuditoriaOption(options, 'admin@test.com')?.id).toBe('1')
  })

  it('matchesAuditoriaUsuarioRow busca en email y nombre', () => {
    expect(
      matchesAuditoriaUsuarioRow(
        {
          id: '1',
          user_id: 'u1',
          usuario_email: 'admin@nomisalud.com',
          accion: 'GET',
          timestamp: '2026-01-01',
        },
        'nomisalud',
      ),
    ).toBe(true)
  })
})

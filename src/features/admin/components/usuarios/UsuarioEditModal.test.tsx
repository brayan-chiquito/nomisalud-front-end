import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { UsuarioEditModal } from './UsuarioEditModal'

vi.mock('../../services/usuariosAdmin.service', () => ({
  updateUsuarioAdmin: vi.fn(),
}))

import { updateUsuarioAdmin } from '../../services/usuariosAdmin.service'

const usuario = {
  id: 'u2',
  email: 'col@test.com',
  role: 'colaborador' as const,
  nombre_completo: 'Col Test',
  tipo_documento: 'CC',
  numero_documento: '1',
  area: '',
  cargo: '',
  eps_afiliacion: '',
  arl_afiliacion: '',
  activo: true,
  created_at: '2026-01-01T00:00:00Z',
}

describe('UsuarioEditModal', () => {
  beforeEach(() => {
    vi.mocked(updateUsuarioAdmin).mockReset()
  })

  it('actualiza usuario', async () => {
    vi.mocked(updateUsuarioAdmin).mockResolvedValue(usuario)
    const onSuccess = vi.fn()
    const user = userEvent.setup()

    render(<UsuarioEditModal usuario={usuario} onClose={vi.fn()} onSuccess={onSuccess} />)

    await user.click(screen.getByRole('button', { name: /guardar cambios/i }))
    await waitFor(() => expect(updateUsuarioAdmin).toHaveBeenCalled())
    expect(onSuccess).toHaveBeenCalled()
  })
})

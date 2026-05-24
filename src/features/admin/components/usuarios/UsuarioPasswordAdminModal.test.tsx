import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { UsuarioPasswordAdminModal } from './UsuarioPasswordAdminModal'

vi.mock('../../services/usuariosAdmin.service', () => ({
  resetUsuarioAdminPassword: vi.fn(),
}))

import { resetUsuarioAdminPassword } from '../../services/usuariosAdmin.service'

const usuario = {
  id: 'u2',
  email: 'col@test.com',
  role: 'colaborador' as const,
  nombre_completo: null,
  tipo_documento: null,
  numero_documento: null,
  area: null,
  cargo: null,
  eps_afiliacion: null,
  arl_afiliacion: null,
  activo: true,
  created_at: '2026-01-01T00:00:00Z',
}

describe('UsuarioPasswordAdminModal', () => {
  beforeEach(() => {
    vi.mocked(resetUsuarioAdminPassword).mockReset()
  })

  it('restablece contraseña', async () => {
    vi.mocked(resetUsuarioAdminPassword).mockResolvedValue(undefined)
    const onSuccess = vi.fn()
    const user = userEvent.setup()

    render(<UsuarioPasswordAdminModal usuario={usuario} onClose={vi.fn()} onSuccess={onSuccess} />)

    await user.type(screen.getByLabelText(/nueva contraseña/i), 'nueva12345')
    await user.type(screen.getByLabelText(/confirmar contraseña/i), 'nueva12345')
    await user.click(screen.getByRole('button', { name: /guardar contraseña/i }))

    await waitFor(() => expect(resetUsuarioAdminPassword).toHaveBeenCalledWith('u2', 'nueva12345'))
    expect(onSuccess).toHaveBeenCalled()
  })
})

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { UsuarioCreateModal } from './UsuarioCreateModal'

vi.mock('../../services/usuariosAdmin.service', () => ({
  createUsuarioAdmin: vi.fn(),
}))

import { createUsuarioAdmin } from '../../services/usuariosAdmin.service'

describe('UsuarioCreateModal', () => {
  beforeEach(() => {
    vi.mocked(createUsuarioAdmin).mockReset()
  })

  it('crea usuario con datos mínimos', async () => {
    vi.mocked(createUsuarioAdmin).mockResolvedValue({
      id: 'n1',
      email: 'nuevo@test.com',
      role: 'colaborador',
      nombre_completo: null,
      tipo_documento: null,
      numero_documento: null,
      area: null,
      cargo: null,
      eps_afiliacion: null,
      arl_afiliacion: null,
      activo: true,
      created_at: '2026-01-01T00:00:00Z',
    })
    const onSuccess = vi.fn()
    const onClose = vi.fn()
    const user = userEvent.setup()

    render(<UsuarioCreateModal isOpen onClose={onClose} onSuccess={onSuccess} />)

    await user.type(screen.getByLabelText(/correo electrónico/i), 'nuevo@test.com')
    await user.type(screen.getByLabelText(/^contraseña$/i), 'password123')
    await user.click(screen.getByRole('button', { name: /crear usuario/i }))

    await waitFor(() => expect(createUsuarioAdmin).toHaveBeenCalled())
    expect(onSuccess).toHaveBeenCalled()
  })

  it('valida longitud mínima de contraseña', async () => {
    const user = userEvent.setup()
    render(<UsuarioCreateModal isOpen onClose={vi.fn()} onSuccess={vi.fn()} />)

    await user.type(screen.getByLabelText(/correo electrónico/i), 'nuevo@test.com')
    await user.type(screen.getByLabelText(/^contraseña$/i), 'corta')
    await user.click(screen.getByRole('button', { name: /crear usuario/i }))

    expect(screen.getByRole('alert')).toHaveTextContent(/al menos 8 caracteres/i)
    expect(createUsuarioAdmin).not.toHaveBeenCalled()
  })
})

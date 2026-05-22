import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { UsuarioDeactivateModal } from './UsuarioDeactivateModal'

vi.mock('../../services/usuariosAdmin.service', () => ({
  deactivateUsuarioAdmin: vi.fn(),
}))

import { deactivateUsuarioAdmin } from '../../services/usuariosAdmin.service'

const usuario = {
  id: 'u2',
  email: 'col@test.com',
  role: 'colaborador' as const,
  nombre_completo: 'Col',
  tipo_documento: null,
  numero_documento: null,
  area: null,
  cargo: null,
  eps_afiliacion: null,
  arl_afiliacion: null,
  activo: true,
  created_at: '2026-01-01T00:00:00Z',
}

describe('UsuarioDeactivateModal', () => {
  beforeEach(() => {
    vi.mocked(deactivateUsuarioAdmin).mockReset()
  })

  it('desactiva usuario al confirmar', async () => {
    vi.mocked(deactivateUsuarioAdmin).mockResolvedValue(undefined)
    const onSuccess = vi.fn()
    const onClose = vi.fn()
    const user = userEvent.setup()

    render(<UsuarioDeactivateModal usuario={usuario} onClose={onClose} onSuccess={onSuccess} />)

    await user.click(screen.getByRole('button', { name: /^desactivar$/i }))
    await waitFor(() => expect(deactivateUsuarioAdmin).toHaveBeenCalledWith('u2'))
    expect(onSuccess).toHaveBeenCalled()
  })
})

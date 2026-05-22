import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CambiarPasswordPropioForm } from './CambiarPasswordPropioForm'

vi.mock('../../services/usuariosAdmin.service', () => ({
  changeOwnPassword: vi.fn(),
}))

import { changeOwnPassword } from '../../services/usuariosAdmin.service'

describe('CambiarPasswordPropioForm', () => {
  beforeEach(() => {
    vi.mocked(changeOwnPassword).mockReset()
  })

  it('envía contraseñas al API', async () => {
    vi.mocked(changeOwnPassword).mockResolvedValue(undefined)
    const user = userEvent.setup()
    render(<CambiarPasswordPropioForm />)

    await user.type(screen.getByLabelText(/contraseña actual/i), 'Actual123!')
    await user.type(screen.getByLabelText(/^nueva contraseña$/i), 'Nueva12345!')
    await user.type(screen.getByLabelText(/confirmar nueva/i), 'Nueva12345!')
    await user.click(screen.getByRole('button', { name: /guardar contraseña/i }))

    await waitFor(() => {
      expect(changeOwnPassword).toHaveBeenCalledWith({
        password_actual: 'Actual123!',
        password_nueva: 'Nueva12345!',
      })
    })
    expect(screen.getByText(/actualizada correctamente/i)).toBeInTheDocument()
  })

  it('muestra error si las contraseñas no coinciden', async () => {
    const user = userEvent.setup()
    render(<CambiarPasswordPropioForm />)

    await user.type(screen.getByLabelText(/contraseña actual/i), 'Actual123!')
    await user.type(screen.getByLabelText(/^nueva contraseña$/i), 'Nueva12345!')
    await user.type(screen.getByLabelText(/confirmar nueva/i), 'Otra12345!')
    await user.click(screen.getByRole('button', { name: /guardar contraseña/i }))

    expect(screen.getByRole('alert')).toHaveTextContent(/no coincide/i)
    expect(changeOwnPassword).not.toHaveBeenCalled()
  })
})

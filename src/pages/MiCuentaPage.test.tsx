import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MiCuentaPage } from './MiCuentaPage'

vi.mock('@/features/admin/components/usuarios/MiCuentaShell', () => ({
  MiCuentaShell: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="shell">{children}</div>
  ),
}))

vi.mock('@/features/admin/components/usuarios/CambiarPasswordPropioForm', () => ({
  CambiarPasswordPropioForm: () => <div>Cambiar contraseña mock</div>,
}))

describe('MiCuentaPage', () => {
  it('renderiza formulario dentro del shell', () => {
    render(<MiCuentaPage />)
    expect(screen.getByTestId('shell')).toBeInTheDocument()
    expect(screen.getByText(/cambiar contraseña mock/i)).toBeInTheDocument()
  })
})

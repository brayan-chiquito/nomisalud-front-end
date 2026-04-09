import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { LoginPage } from './LoginPage'

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>()
  return { ...actual, useNavigate: () => vi.fn() }
})

vi.mock('@/assets/logo.png', () => ({ default: 'logo.png' }))

vi.mock('@/features/auth/context/AuthContext', () => ({
  useAuth: () => ({ login: vi.fn() }),
}))

vi.mock('@/features/auth/services/auth.service', () => ({
  loginService: vi.fn(),
}))

describe('LoginPage', () => {
  it('renderiza el formulario de login', () => {
    render(<LoginPage />)
    expect(screen.getByLabelText('Correo electrónico')).toBeInTheDocument()
    expect(screen.getByLabelText('Contraseña')).toBeInTheDocument()
  })

  it('muestra el logo de Nomisalud', () => {
    render(<LoginPage />)
    expect(screen.getByAltText('Nomisalud')).toBeInTheDocument()
  })
})

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { DashboardPage } from './DashboardPage'

describe('DashboardPage', () => {
  it('muestra el mensaje de inicio de sesión exitoso', () => {
    render(<DashboardPage />)
    expect(screen.getByText(/inicio de sesión exitoso/i)).toBeInTheDocument()
  })

  it('muestra el mensaje de bienvenida al sistema', () => {
    render(<DashboardPage />)
    expect(screen.getByText(/bienvenido al sistema nomisalud/i)).toBeInTheDocument()
  })
})

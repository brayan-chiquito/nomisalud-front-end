import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { AuthProvider } from '@/features/auth/context/AuthContext'
import { RadicarIncapacidadView } from './RadicarIncapacidadView'

vi.mock('@/assets/logo.png', () => ({ default: 'logo.png' }))

describe('RadicarIncapacidadView', () => {
  it('muestra el título y el enlace volver a mi trámite', () => {
    render(
      <AuthProvider>
        <MemoryRouter>
          <RadicarIncapacidadView />
        </MemoryRouter>
      </AuthProvider>,
    )
    expect(screen.getByRole('heading', { name: /radicar nueva incapacidad/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /mi trámite/i })).toHaveAttribute(
      'href',
      '/portal/mi-tramite',
    )
    expect(screen.getByRole('link', { name: /cancelar/i })).toHaveAttribute(
      'href',
      '/portal/mi-tramite',
    )
  })
})

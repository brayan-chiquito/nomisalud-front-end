import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { AuthProvider } from '@/features/auth/context/AuthContext'
import { CollaboratorRadicarIncapacidadPage } from './CollaboratorRadicarIncapacidadPage'

vi.mock('@/assets/logo.png', () => ({ default: 'logo.png' }))

describe('CollaboratorRadicarIncapacidadPage', () => {
  it('renderiza el formulario de radicación', () => {
    render(
      <AuthProvider>
        <MemoryRouter>
          <CollaboratorRadicarIncapacidadPage />
        </MemoryRouter>
      </AuthProvider>,
    )
    expect(screen.getByText('Sube el documento de incapacidad')).toBeInTheDocument()
  })
})

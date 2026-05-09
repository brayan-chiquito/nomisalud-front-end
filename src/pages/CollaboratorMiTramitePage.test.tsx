import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { CollaboratorMiTramitePage } from './CollaboratorMiTramitePage'

vi.mock('@/assets/logo.png', () => ({ default: 'logo.png' }))

describe('CollaboratorMiTramitePage', () => {
  it('renderiza la vista de mi trámite', () => {
    render(
      <MemoryRouter>
        <CollaboratorMiTramitePage />
      </MemoryRouter>,
    )
    expect(screen.getByText('Mi incapacidad activa')).toBeInTheDocument()
  })
})

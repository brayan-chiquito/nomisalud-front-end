import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { MiTramiteView } from './MiTramiteView'

vi.mock('@/assets/logo.png', () => ({ default: 'logo.png' }))

describe('MiTramiteView', () => {
  it('muestra el título y el enlace a radicar', () => {
    render(
      <MemoryRouter>
        <MiTramiteView />
      </MemoryRouter>,
    )
    expect(screen.getByText('Mi incapacidad activa')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /estado del trámite/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /radicar nueva incapacidad/i })).toHaveAttribute(
      'href',
      '/portal/radicar-incapacidad',
    )
  })
})

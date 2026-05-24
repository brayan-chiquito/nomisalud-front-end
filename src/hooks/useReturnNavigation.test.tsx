import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'
import { useCurrentReturnState, useReturnNavigation } from './useReturnNavigation'

function ReturnProbe({ fallback }: Readonly<{ fallback: string }>) {
  const location = useLocation()
  const { backTarget, goBack, returnTo } = useReturnNavigation(fallback)
  const returnState = useCurrentReturnState()
  return (
    <div>
      <span data-testid="pathname">{location.pathname}</span>
      <span data-testid="back-target">{backTarget}</span>
      <span data-testid="return-to">{returnTo ?? 'none'}</span>
      <span data-testid="return-state">{JSON.stringify(returnState)}</span>
      <button type="button" onClick={goBack}>
        Volver
      </button>
    </div>
  )
}

describe('useReturnNavigation', () => {
  it('navega a returnTo cuando existe en el state', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter
        initialEntries={[
          { pathname: '/admin/plazos-entidad', state: { returnTo: '/dashboard/pagos' } },
        ]}
      >
        <Routes>
          <Route path="/admin/plazos-entidad" element={<ReturnProbe fallback="/dashboard" />} />
          <Route path="/dashboard/pagos" element={<div>Pagos</div>} />
        </Routes>
      </MemoryRouter>,
    )

    expect(screen.getByTestId('back-target')).toHaveTextContent('/dashboard/pagos')
    await user.click(screen.getByRole('button', { name: /volver/i }))
    expect(await screen.findByText('Pagos')).toBeInTheDocument()
  })

  it('usa fallback cuando no hay returnTo', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter initialEntries={['/admin/plazos-entidad']}>
        <Routes>
          <Route path="/admin/plazos-entidad" element={<ReturnProbe fallback="/dashboard" />} />
          <Route path="/dashboard" element={<div>Inicio</div>} />
        </Routes>
      </MemoryRouter>,
    )

    expect(screen.getByTestId('return-to')).toHaveTextContent('none')
    await user.click(screen.getByRole('button', { name: /volver/i }))
    expect(await screen.findByText('Inicio')).toBeInTheDocument()
  })

  it('useCurrentReturnState expone returnTo para la ruta actual', () => {
    render(
      <MemoryRouter initialEntries={['/admin/plazos-entidad']}>
        <ReturnProbe fallback="/dashboard" />
      </MemoryRouter>,
    )

    expect(screen.getByTestId('return-state')).toHaveTextContent('returnTo')
    expect(screen.getByTestId('return-state')).toHaveTextContent('/admin/plazos-entidad')
  })
})

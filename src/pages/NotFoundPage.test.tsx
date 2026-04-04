import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { NotFoundPage } from './NotFoundPage'

function renderPage() {
  return render(
    <MemoryRouter>
      <NotFoundPage />
    </MemoryRouter>,
  )
}

describe('NotFoundPage', () => {
  it('muestra el código 404', () => {
    renderPage()
    expect(screen.getByText('404')).toBeInTheDocument()
  })

  it('muestra el mensaje de página no encontrada', () => {
    renderPage()
    expect(screen.getByText(/página no encontrada/i)).toBeInTheDocument()
  })

  it('muestra el link para volver al inicio', () => {
    renderPage()
    expect(screen.getByRole('link', { name: /volver al inicio/i })).toBeInTheDocument()
  })

  it('el link apunta a la ruta raíz', () => {
    renderPage()
    expect(screen.getByRole('link', { name: /volver al inicio/i })).toHaveAttribute('href', '/')
  })
})

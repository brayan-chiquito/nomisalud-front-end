import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { DocumentacionPendienteBanner } from './DocumentacionPendienteBanner'

describe('DocumentacionPendienteBanner', () => {
  it('lista documentos, plazo y enlace para cargar', () => {
    render(
      <MemoryRouter>
        <DocumentacionPendienteBanner
          data={{
            documentos: ['Fórmula médica', 'Historia clínica'],
            diasHabilesRestantes: 2,
            plazoMaximoDiasHabiles: 8,
            fechaVencimientoIso: null,
          }}
        />
      </MemoryRouter>,
    )

    expect(screen.getByRole('alert')).toHaveTextContent(/documentación pendiente/i)
    expect(screen.getByText('Fórmula médica')).toBeInTheDocument()
    expect(screen.getByText(/te quedan 2 días hábiles/i)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /cargar documentos/i })).toHaveAttribute(
      'href',
      '/portal/radicar-incapacidad',
    )
  })
})

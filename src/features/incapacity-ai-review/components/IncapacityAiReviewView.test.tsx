import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { IncapacityAiReviewView } from './IncapacityAiReviewView'

describe('IncapacityAiReviewView', () => {
  it('muestra el panel de revisión y abre el modal de rechazo', () => {
    render(
      <MemoryRouter>
        <IncapacityAiReviewView />
      </MemoryRouter>,
    )
    expect(screen.getByText('Datos extraídos por IA')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /rechazar con motivo/i }))
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText('Rechazar incapacidad')).toBeInTheDocument()
  })
})

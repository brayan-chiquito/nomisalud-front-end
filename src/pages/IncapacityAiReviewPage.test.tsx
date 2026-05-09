import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { IncapacityAiReviewPage } from './IncapacityAiReviewPage'

describe('IncapacityAiReviewPage', () => {
  it('renderiza la revisión IA', () => {
    render(
      <MemoryRouter>
        <IncapacityAiReviewPage />
      </MemoryRouter>,
    )
    expect(screen.getByText('Documento adjunto')).toBeInTheDocument()
  })
})

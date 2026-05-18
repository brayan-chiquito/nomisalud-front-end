import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { MisTramitesListPanel } from './MisTramitesListPanel'

describe('MisTramitesListPanel', () => {
  it('renderiza radicado, estado y fecha de cada trámite', () => {
    render(
      <MemoryRouter>
        <MisTramitesListPanel
          items={[
            {
              id: 'uuid-1',
              radicado: 'IN-TEST-001',
              estado: 'en_verificacion',
              updated_at: '2025-06-02T14:00:00.000Z',
            },
          ]}
          loading={false}
          error={null}
          page={1}
          pages={1}
          onPageChange={() => undefined}
        />
      </MemoryRouter>,
    )
    expect(screen.getByText('IN-TEST-001')).toBeInTheDocument()
    expect(screen.getByText(/en verificación/i)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /IN-TEST-001/i })).toHaveAttribute(
      'href',
      '/portal/mi-tramite/uuid-1',
    )
  })
})

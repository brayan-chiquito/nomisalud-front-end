import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { IncapacityAiReviewPage } from './IncapacityAiReviewPage'

vi.mock('@/features/auth/context/AuthContext', () => ({
  useAuth: () => ({
    user: { id: '1', email: 'admin@nomisalud.com', role: 'admin' },
    isAuthenticated: true,
    login: vi.fn(),
    logout: vi.fn(),
  }),
}))

vi.mock('@/features/incapacity-ai-review/services/incapacidadReview.service', () => ({
  getIncapacidadDetalle: vi.fn(),
  fetchIncapacidadArchivoBlob: vi.fn(),
  verificarIncapacidad: vi.fn(),
}))

import {
  getIncapacidadDetalle,
  fetchIncapacidadArchivoBlob,
} from '@/features/incapacity-ai-review/services/incapacidadReview.service'

describe('IncapacityAiReviewPage', () => {
  beforeEach(() => {
    vi.mocked(getIncapacidadDetalle).mockResolvedValue({
      id: 'id-1',
      radicado: 'IN01',
      estado: 'en_verificacion',
      archivo_tipo: 'pdf',
      extraccion_ia: { datos_extraidos: { colaborador: { nombre_completo: 'Test' } } },
    })
    vi.mocked(fetchIncapacidadArchivoBlob).mockResolvedValue(
      new Blob(['%PDF'], { type: 'application/pdf' }),
    )
  })

  it('renderiza la revisión IA con detalle cargado', async () => {
    render(
      <MemoryRouter initialEntries={['/incapacidad/revision-ia?id=id-1']}>
        <Routes>
          <Route path="/incapacidad/revision-ia" element={<IncapacityAiReviewPage />} />
        </Routes>
      </MemoryRouter>,
    )
    await waitFor(() => expect(screen.getByText('Documento adjunto')).toBeInTheDocument())
    expect(screen.getByText('IN01')).toBeInTheDocument()
  })
})

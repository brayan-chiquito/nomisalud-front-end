import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { RecepcionRadicarView } from './RecepcionRadicarView'

vi.mock('@/features/auth/context/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 'u1', email: 'recepcion@nomisalud.com', role: 'recepcion' },
    isAuthenticated: true,
  }),
}))

vi.mock('@/hooks/useColaboradorBuscar', () => ({
  useColaboradorBuscar: () => ({
    items: [
      {
        id: 'col-1',
        nombre_completo: 'María López',
        numero_documento: '12345',
        email: 'maria@test.com',
      },
    ],
    loading: false,
  }),
}))

vi.mock('@/features/incapacidades/services/uploadIncapacity.service', () => ({
  uploadIncapacityFile: vi.fn(),
}))

import { uploadIncapacityFile } from '@/features/incapacidades/services/uploadIncapacity.service'

function renderView() {
  return render(
    <MemoryRouter>
      <RecepcionRadicarView />
    </MemoryRouter>,
  )
}

describe('RecepcionRadicarView', () => {
  beforeEach(() => {
    vi.mocked(uploadIncapacityFile).mockReset()
  })

  it('muestra el buscador de colaborador', () => {
    renderView()
    expect(screen.getByLabelText(/buscar colaborador/i)).toBeInTheDocument()
  })

  it('envía colaborador_id al subir el documento', async () => {
    vi.mocked(uploadIncapacityFile).mockResolvedValue({ tramite_id: 'T-1' })
    const user = userEvent.setup()
    renderView()

    await user.type(screen.getByLabelText(/buscar colaborador/i), 'maria')
    await user.click(screen.getByRole('button', { name: /maría lópez/i }))

    const file = new File(['pdf'], 'inc.pdf', { type: 'application/pdf' })
    const input = document.querySelector('input[type="file"]') as HTMLInputElement
    await user.upload(input, file)

    await user.click(screen.getByRole('button', { name: /radicar documento/i }))

    await waitFor(() => {
      expect(uploadIncapacityFile).toHaveBeenCalledWith(
        file,
        expect.objectContaining({ colaboradorId: 'col-1' }),
      )
    })
  })
})

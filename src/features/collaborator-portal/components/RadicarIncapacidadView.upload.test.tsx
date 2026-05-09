import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { AuthProvider } from '@/features/auth/context/AuthContext'
import { RadicarIncapacidadView } from './RadicarIncapacidadView'

vi.mock('@/assets/logo.png', () => ({ default: 'logo.png' }))

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>()
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

vi.mock('@/features/incapacidades/services/uploadIncapacity.service', () => ({
  uploadIncapacityFile: vi.fn(),
}))

import { uploadIncapacityFile } from '@/features/incapacidades/services/uploadIncapacity.service'

function renderView() {
  return render(
    <AuthProvider>
      <MemoryRouter>
        <RadicarIncapacidadView />
      </MemoryRouter>
    </AuthProvider>,
  )
}

describe('RadicarIncapacidadView — subida', () => {
  beforeEach(() => {
    mockNavigate.mockClear()
    vi.mocked(uploadIncapacityFile).mockReset()
  })

  it('tras archivo válido y continuar, sube y navega a revisión IA', async () => {
    vi.mocked(uploadIncapacityFile).mockResolvedValue({ tramite_id: 'abc' })

    const { container } = renderView()
    const input = container.querySelector('input[type="file"]') as HTMLInputElement
    const file = new File(['%PDF'], 'doc.pdf', { type: 'application/pdf' })
    fireEvent.change(input, { target: { files: [file] } })

    fireEvent.click(screen.getByRole('button', { name: /continuar al resumen/i }))

    await waitFor(() => {
      expect(uploadIncapacityFile).toHaveBeenCalled()
    })

    expect(mockNavigate).toHaveBeenCalledWith('/incapacidad/revision-ia', {
      state: { uploadResponse: { tramite_id: 'abc' }, fileName: 'doc.pdf' },
    })
  })

  it('muestra error del servidor si la subida falla', async () => {
    vi.mocked(uploadIncapacityFile).mockRejectedValue(new Error('Falló el servidor'))

    const { container } = renderView()
    const input = container.querySelector('input[type="file"]') as HTMLInputElement
    fireEvent.change(input, {
      target: { files: [new File(['x'], 'a.pdf', { type: 'application/pdf' })] },
    })

    fireEvent.click(screen.getByRole('button', { name: /continuar al resumen/i }))

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Falló el servidor')
    })
    expect(mockNavigate).not.toHaveBeenCalled()
  })
})

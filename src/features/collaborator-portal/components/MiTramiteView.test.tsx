import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { AuthProvider } from '@/features/auth/context/AuthContext'
import { MiTramiteView } from './MiTramiteView'

vi.mock('@/assets/logo.png', () => ({ default: 'logo.png' }))

const mockUseMisIncapacidades = vi.fn()
const mockUseMiTramiteDetalle = vi.fn()

vi.mock('../hooks/useMisIncapacidades', () => ({
  useMisIncapacidades: (enabled: boolean) => mockUseMisIncapacidades(enabled),
}))

vi.mock('../hooks/useMiTramiteDetalle', () => ({
  useMiTramiteDetalle: (id: string | undefined) => mockUseMiTramiteDetalle(id),
}))

const mockUseDocumentacionPendienteAlert = vi.fn()

vi.mock('../hooks/useDocumentacionPendienteAlert', () => ({
  useDocumentacionPendienteAlert: (...args: unknown[]) =>
    mockUseDocumentacionPendienteAlert(...args),
}))

function renderAt(path: string) {
  return render(
    <AuthProvider>
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route path="/portal/mi-tramite" element={<MiTramiteView />} />
          <Route path="/portal/mi-tramite/:tramiteId" element={<MiTramiteView />} />
        </Routes>
      </MemoryRouter>
    </AuthProvider>,
  )
}

describe('MiTramiteView', () => {
  beforeEach(() => {
    mockUseMisIncapacidades.mockReset()
    mockUseMiTramiteDetalle.mockReset()
    mockUseDocumentacionPendienteAlert.mockReset()
    mockUseDocumentacionPendienteAlert.mockReturnValue({ data: null, loading: false })
    mockUseMisIncapacidades.mockReturnValue({
      data: { items: [], total: 0, pages: 1 },
      loading: false,
      error: null,
      page: 1,
      setPage: vi.fn(),
      reload: vi.fn(),
    })
    mockUseMiTramiteDetalle.mockReturnValue({
      detail: null,
      loading: false,
      error: null,
    })
  })

  it('muestra la lista de trámites en la ruta base', () => {
    mockUseMisIncapacidades.mockReturnValue({
      data: {
        items: [
          {
            id: 'a1',
            radicado: 'IN-LIST',
            estado: 'recibida',
            updated_at: '2025-06-01T10:00:00.000Z',
          },
        ],
        total: 1,
        pages: 1,
      },
      loading: false,
      error: null,
      page: 1,
      setPage: vi.fn(),
      reload: vi.fn(),
    })
    renderAt('/portal/mi-tramite')
    expect(screen.getByRole('heading', { name: /mis trámites/i })).toBeInTheDocument()
    expect(screen.getByText('IN-LIST')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /dashboard/i })).toHaveAttribute('href', '/dashboard')
    expect(mockUseMisIncapacidades).toHaveBeenCalledWith(true)
  })

  it('muestra el detalle cuando hay tramiteId en la URL', () => {
    mockUseMiTramiteDetalle.mockReturnValue({
      detail: {
        id: 'a1',
        radicado: 'IN-DET',
        estado: 'en_verificacion',
        archivo_tipo: 'pdf',
        historial_estados: [],
        extraccion_ia: null,
      },
      loading: false,
      error: null,
    })
    renderAt('/portal/mi-tramite/a1')
    expect(screen.getByText('IN-DET')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /estado del trámite/i })).toBeInTheDocument()
    expect(mockUseMisIncapacidades).toHaveBeenCalledWith(false)
  })

  it('muestra nombre del colaborador desde el detalle en la cabecera', () => {
    mockUseMiTramiteDetalle.mockReturnValue({
      detail: {
        id: 'a1',
        radicado: 'IN-DET',
        estado: 'recibida',
        archivo_tipo: 'pdf',
        colaborador_nombre: 'María López',
        historial_estados: [],
        extraccion_ia: null,
      },
      loading: false,
      error: null,
    })
    renderAt('/portal/mi-tramite/a1')
    expect(screen.getByText('María López')).toBeInTheDocument()
  })

  it('muestra el banner de documentación pendiente cuando el hook lo indica', () => {
    mockUseDocumentacionPendienteAlert.mockReturnValue({
      data: {
        documentos: ['Fórmula médica'],
        diasHabilesRestantes: 2,
        plazoMaximoDiasHabiles: null,
        fechaVencimientoIso: null,
      },
      loading: false,
    })
    renderAt('/portal/mi-tramite')
    expect(screen.getByRole('alert')).toHaveTextContent(/documentación pendiente/i)
    expect(screen.getByText('Fórmula médica')).toBeInTheDocument()
  })
})

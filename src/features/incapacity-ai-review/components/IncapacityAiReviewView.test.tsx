import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { IncapacityAiReviewView } from './IncapacityAiReviewView'
import type { UseIncapacidadAiReviewResult } from '../hooks/useIncapacidadAiReview'
import { emptyReviewForm } from '../utils/reviewFormState'

const mockNavigate = vi.fn()
const mockUseIncapacidadAiReview = vi.fn()

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

vi.mock('../hooks/useIncapacidadAiReview', () => ({
  useIncapacidadAiReview: (id: string | null) => mockUseIncapacidadAiReview(id),
}))

const mockUseAuth = vi.fn()

vi.mock('@/features/auth/context/AuthContext', () => ({
  useAuth: () => mockUseAuth(),
}))

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/incapacidad/revision-ia" element={<IncapacityAiReviewView />} />
      </Routes>
    </MemoryRouter>,
  )
}

function baseHookReturn(
  over: Partial<UseIncapacidadAiReviewResult> = {},
): UseIncapacidadAiReviewResult {
  return {
    detail: null,
    loadingDetail: false,
    errorDetail: null,
    archivoObjectUrl: null,
    loadingArchivo: false,
    archivoError: null,
    form: emptyReviewForm(),
    setFormField: vi.fn(),
    confirmar: vi.fn(async () => true),
    rechazar: vi.fn(async () => true),
    solicitarDocumentacion: vi.fn(async () => true),
    inconsistencias: [],
    overrideJustificacion: '',
    setOverrideJustificacion: vi.fn(),
    overrideRegistrado: false,
    registrarOverride: vi.fn(async () => true),
    submittingOverride: false,
    overrideError: null,
    clearOverrideError: vi.fn(),
    submitting: false,
    submitError: null,
    clearSubmitError: vi.fn(),
    ...over,
  }
}

describe('IncapacityAiReviewView', () => {
  beforeEach(() => {
    mockNavigate.mockReset()
    mockUseIncapacidadAiReview.mockReset()
    mockUseAuth.mockReturnValue({
      user: { id: '1', email: 'rrhh@nomisalud.com', role: 'admin' },
      isAuthenticated: true,
      login: vi.fn(),
      logout: vi.fn(),
    })
  })

  it('sin id en la URL indica cómo acceder y enlaza al dashboard', () => {
    mockUseIncapacidadAiReview.mockReturnValue(baseHookReturn())
    renderAt('/incapacidad/revision-ia')
    expect(screen.getByText(/falta el identificador/i)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /ir al dashboard/i })).toHaveAttribute(
      'href',
      '/dashboard',
    )
  })

  it('muestra carga mientras llega el detalle', () => {
    mockUseIncapacidadAiReview.mockReturnValue(
      baseHookReturn({ loadingDetail: true, detail: null }),
    )
    renderAt('/incapacidad/revision-ia?id=x')
    expect(screen.getByText(/cargando trámite/i)).toBeInTheDocument()
  })

  it('muestra error de detalle y enlace volver', () => {
    mockUseIncapacidadAiReview.mockReturnValue(
      baseHookReturn({ errorDetail: 'No encontrado', detail: null }),
    )
    renderAt('/incapacidad/revision-ia?id=x')
    expect(screen.getByText('No encontrado')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /^volver$/i })).toHaveAttribute('href', '/dashboard')
  })

  it('muestra radicado y abre el modal de rechazo', async () => {
    mockUseIncapacidadAiReview.mockReturnValue(
      baseHookReturn({
        detail: {
          id: 'x',
          radicado: 'IN99',
          estado: 'en_verificacion',
          archivo_tipo: 'pdf',
          extraccion_ia: { datos_extraidos: {} },
        },
      }),
    )
    renderAt('/incapacidad/revision-ia?id=x')
    expect(screen.getByText('IN99')).toBeInTheDocument()
    expect(screen.getByText('Datos extraídos por IA')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /rechazar con motivo/i }))
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText('Rechazar incapacidad')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /^cancelar$/i }))
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
  })

  it('confirmar datos llama a confirmar y navega al volver', async () => {
    const confirmar = vi.fn(async () => true)
    mockUseIncapacidadAiReview.mockReturnValue(
      baseHookReturn({
        detail: {
          id: 'x',
          radicado: 'IN99',
          estado: 'en_verificacion',
          archivo_tipo: 'pdf',
          extraccion_ia: { datos_extraidos: {} },
        },
        confirmar,
      }),
    )
    renderAt('/incapacidad/revision-ia?id=x')
    fireEvent.click(screen.getByRole('button', { name: /confirmar datos/i }))
    await waitFor(() => expect(confirmar).toHaveBeenCalled())
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/dashboard?success=confirmada'))
  })

  it('rechazar navega al dashboard con aviso de éxito', async () => {
    const rechazar = vi.fn(async () => true)
    mockUseIncapacidadAiReview.mockReturnValue(
      baseHookReturn({
        detail: {
          id: 'x',
          radicado: 'IN99',
          estado: 'en_verificacion',
          archivo_tipo: 'pdf',
          extraccion_ia: { datos_extraidos: {} },
        },
        rechazar,
      }),
    )
    renderAt('/incapacidad/revision-ia?id=x')
    fireEvent.click(screen.getByRole('button', { name: /rechazar con motivo/i }))
    fireEvent.click(screen.getByRole('button', { name: /documento ilegible/i }))
    fireEvent.change(screen.getByLabelText(/detalle del motivo/i), {
      target: { value: 'No coincide' },
    })
    fireEvent.click(screen.getByRole('button', { name: /confirmar rechazo/i }))
    await waitFor(() => expect(rechazar).toHaveBeenCalled())
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/dashboard?success=rechazada'))
  })

  it('colaborador ve enlace a mi trámite cuando falta id', () => {
    mockUseAuth.mockReturnValue({
      user: { id: '2', email: 'col@nomisalud.com', role: 'colaborador' },
      isAuthenticated: true,
      login: vi.fn(),
      logout: vi.fn(),
    })
    mockUseIncapacidadAiReview.mockReturnValue(baseHookReturn())
    renderAt('/incapacidad/revision-ia')
    expect(screen.getByRole('link', { name: /ir a mi trámite/i })).toHaveAttribute(
      'href',
      '/portal/mi-tramite',
    )
  })

  it('bloquea confirmar si hay inconsistencias sin override', () => {
    mockUseIncapacidadAiReview.mockReturnValue(
      baseHookReturn({
        detail: {
          id: 'x',
          radicado: 'IN-INC',
          estado: 'inconsistencia_detectada',
          archivo_tipo: 'pdf',
          extraccion_ia: { datos_extraidos: {}, calidad_doc: 0.92 },
        },
        inconsistencias: [{ tipo: 'Fechas', descripcion: 'Fin anterior al inicio' }],
        overrideRegistrado: false,
      }),
    )
    renderAt('/incapacidad/revision-ia?id=x')
    expect(screen.getByRole('button', { name: /confirmar datos/i })).toBeDisabled()
    expect(screen.getByText(/registra la excepción/i)).toBeInTheDocument()
    expect(screen.getByText(/inconsistencias detectadas/i)).toBeInTheDocument()
    expect(screen.getByText(/confianza: 92%/i)).toBeInTheDocument()
  })

  it('registra override desde el banner', async () => {
    const registrarOverride = vi.fn(async () => true)
    const clearOverrideError = vi.fn()
    mockUseIncapacidadAiReview.mockReturnValue(
      baseHookReturn({
        detail: {
          id: 'x',
          radicado: 'IN-INC',
          estado: 'inconsistencia_detectada',
          archivo_tipo: 'pdf',
          extraccion_ia: { datos_extraidos: {} },
        },
        inconsistencias: [{ tipo: 'Fechas', descripcion: 'Conflicto' }],
        overrideJustificacion: 'Justificación válida de prueba',
        registrarOverride,
        clearOverrideError,
      }),
    )
    renderAt('/incapacidad/revision-ia?id=x')
    fireEvent.click(screen.getByRole('button', { name: /registrar excepción/i }))
    await waitFor(() => expect(clearOverrideError).toHaveBeenCalled())
    await waitFor(() => expect(registrarOverride).toHaveBeenCalled())
  })

  it('muestra aviso si no hay extracción IA', () => {
    mockUseIncapacidadAiReview.mockReturnValue(
      baseHookReturn({
        detail: {
          id: 'x',
          radicado: 'IN-SIN',
          estado: 'recibida',
          archivo_tipo: 'pdf',
          extraccion_ia: null,
        },
      }),
    )
    renderAt('/incapacidad/revision-ia?id=x')
    expect(screen.getByText(/aún no hay extracción ia/i)).toBeInTheDocument()
  })

  it('permite editar campos del formulario', () => {
    const setFormField = vi.fn()
    mockUseIncapacidadAiReview.mockReturnValue(
      baseHookReturn({
        detail: {
          id: 'x',
          radicado: 'IN99',
          estado: 'en_verificacion',
          archivo_tipo: 'pdf',
          extraccion_ia: {
            datos_extraidos: {},
            validaciones: [{ nivel: 'warning', tipo: 'fechas', mensaje: 'Revisar' }],
          },
        },
        form: { ...emptyReviewForm(), nombreColaborador: 'Ana' },
        setFormField,
      }),
    )
    renderAt('/incapacidad/revision-ia?id=x')
    fireEvent.change(screen.getByDisplayValue('Ana'), {
      target: { value: 'Ana López' },
    })
    expect(setFormField).toHaveBeenCalledWith('nombreColaborador', 'Ana López')
    expect(screen.getByText(/validación\(es\) marcada/i)).toBeInTheDocument()
  })

  it('muestra error de envío del hook', () => {
    mockUseIncapacidadAiReview.mockReturnValue(
      baseHookReturn({
        detail: {
          id: 'x',
          radicado: 'IN99',
          estado: 'en_verificacion',
          archivo_tipo: 'pdf',
          extraccion_ia: { datos_extraidos: {} },
        },
        submitError: 'Error al guardar',
      }),
    )
    renderAt('/incapacidad/revision-ia?id=x')
    expect(screen.getByRole('alert')).toHaveTextContent('Error al guardar')
  })

  it('solicitar documentación navega al dashboard con aviso de doc incompleta', async () => {
    const solicitarDocumentacion = vi.fn(async () => true)
    mockUseIncapacidadAiReview.mockReturnValue(
      baseHookReturn({
        detail: {
          id: 'x',
          radicado: 'IN99',
          estado: 'en_verificacion',
          archivo_tipo: 'pdf',
          extraccion_ia: { datos_extraidos: {} },
        },
        solicitarDocumentacion,
      }),
    )
    renderAt('/incapacidad/revision-ia?id=x')
    fireEvent.click(screen.getByRole('button', { name: /rechazar con motivo/i }))
    fireEvent.click(screen.getByRole('button', { name: /documentación faltante/i }))
    fireEvent.change(screen.getByLabelText(/documento faltante 1/i), {
      target: { value: 'Historia clínica' },
    })
    fireEvent.click(screen.getByRole('button', { name: /solicitar documentación/i }))
    await waitFor(() =>
      expect(solicitarDocumentacion).toHaveBeenCalledWith(['Historia clínica'], undefined),
    )
    await waitFor(() =>
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard?success=documentacion_solicitada'),
    )
  })
})

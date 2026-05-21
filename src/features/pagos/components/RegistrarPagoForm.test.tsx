import { describe, it, expect, vi, beforeEach } from 'vitest'
import axios from 'axios'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { RegistrarPagoForm } from './RegistrarPagoForm'
import { listRadicadosDisponibles, createPago } from '../services/pagos.service'

import { useAuth } from '@/features/auth/context/AuthContext'

vi.mock('@/features/auth/context/AuthContext', () => ({
  useAuth: vi.fn(),
}))

vi.mock('../services/pagos.service', () => ({
  listRadicadosDisponibles: vi.fn(),
  createPago: vi.fn(),
}))

describe('RegistrarPagoForm', () => {
  beforeEach(() => {
    vi.mocked(useAuth).mockReturnValue({
      user: { id: '1', email: 'admin@test.com', role: 'admin' },
      isAuthenticated: true,
      login: vi.fn(),
      logout: vi.fn(),
    })
    vi.mocked(listRadicadosDisponibles).mockResolvedValue({
      items: [
        {
          incapacidad_id: '1',
          radicado: 'IN01',
          colaborador_email: 'col@test.com',
          entidad_nombre: 'EPS SURA',
        },
      ],
      total: 1,
      pages: 1,
    })
    vi.mocked(createPago).mockResolvedValue({
      id: 'p1',
      entidad_origen: 'EPS',
      referencia: 'R1',
      monto: '100',
      estado: 'completado',
    })
  })

  it('valida campos obligatorios', async () => {
    render(<RegistrarPagoForm />)
    await waitFor(() => expect(screen.getByText('IN01')).toBeInTheDocument())
    fireEvent.click(screen.getByRole('button', { name: /registrar pago/i }))
    expect(await screen.findByText(/indica la entidad/i)).toBeInTheDocument()
  })

  it('carga radicados desde radicados-disponibles', async () => {
    render(<RegistrarPagoForm />)
    await waitFor(() => expect(listRadicadosDisponibles).toHaveBeenCalled())
    expect(screen.getByText('IN01')).toBeInTheDocument()
  })

  it('envía pago cuando el formulario es válido', async () => {
    const onOk = vi.fn()
    render(<RegistrarPagoForm onRegistroExitoso={onOk} />)
    await waitFor(() => expect(screen.getByText('IN01')).toBeInTheDocument())
    fireEvent.change(screen.getByLabelText(/entidad origen/i), { target: { value: 'EPS' } })
    fireEvent.change(screen.getByLabelText(/referencia/i), { target: { value: 'REF-1' } })
    fireEvent.change(screen.getByLabelText(/^monto/i), { target: { value: '1500' } })
    fireEvent.click(screen.getByRole('checkbox'))
    fireEvent.click(screen.getByRole('button', { name: /registrar pago/i }))
    await waitFor(() => expect(createPago).toHaveBeenCalled())
    expect(onOk).toHaveBeenCalled()
    await waitFor(() => expect(listRadicadosDisponibles.mock.calls.length).toBeGreaterThan(1))
  })

  it('muestra error al fallar carga de disponibles', async () => {
    vi.mocked(listRadicadosDisponibles).mockRejectedValue(
      new axios.AxiosError('fail', '500', undefined, undefined, {
        status: 500,
        data: {},
        statusText: 'Error',
        headers: {},
        config: {} as never,
      }),
    )
    render(<RegistrarPagoForm />)
    await waitFor(() => {
      expect(screen.getByText('fail')).toBeInTheDocument()
    })
  })

  it('pagina radicados disponibles cuando hay varias páginas', async () => {
    vi.mocked(listRadicadosDisponibles).mockResolvedValue({
      items: [{ incapacidad_id: '1', radicado: 'IN01' }],
      total: 60,
      pages: 2,
    })
    render(<RegistrarPagoForm />)
    await waitFor(() => expect(screen.getByText(/mostrando/i)).toBeInTheDocument())
    fireEvent.click(screen.getByRole('button', { name: /página siguiente/i }))
    await waitFor(() =>
      expect(listRadicadosDisponibles).toHaveBeenCalledWith(expect.objectContaining({ page: 2 })),
    )
  })

  it('muestra mensaje de disponibles para contabilidad', async () => {
    vi.mocked(useAuth).mockReturnValue({
      user: { id: '2', email: 'conta@test.com', role: 'contabilidad' },
      isAuthenticated: true,
      login: vi.fn(),
      logout: vi.fn(),
    })
    vi.mocked(listRadicadosDisponibles).mockResolvedValue({
      items: [],
      total: 0,
      pages: 0,
    })
    render(<RegistrarPagoForm />)
    await waitFor(() =>
      expect(screen.getByText(/cuando rrhh marque trámites como cobrada/i)).toBeInTheDocument(),
    )
  })
})

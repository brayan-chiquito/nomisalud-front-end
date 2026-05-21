import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { RegistrarPagoForm } from './RegistrarPagoForm'
import { listRadicadosDisponibles, createPago } from '../services/pagos.service'

vi.mock('@/features/auth/context/AuthContext', () => ({
  useAuth: vi.fn(() => ({ user: { id: '1', email: 'admin@test.com', role: 'admin' } })),
}))

vi.mock('../services/pagos.service', () => ({
  listRadicadosDisponibles: vi.fn(),
  createPago: vi.fn(),
}))

describe('RegistrarPagoForm', () => {
  beforeEach(() => {
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
})

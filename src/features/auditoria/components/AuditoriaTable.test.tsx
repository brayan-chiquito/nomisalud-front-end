import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { AuditoriaTable } from './AuditoriaTable'

const sampleItem = {
  id: '1',
  user_id: 'u1',
  usuario_nombre: 'Coordinador',
  usuario_email: 'c@test.com',
  accion: 'GET /api/v1/incapacidades',
  recurso_id: 'res-1',
  ip: '192.168.1.1',
  timestamp: '2026-05-21T14:30:00Z',
}

describe('AuditoriaTable', () => {
  it('muestra estado de carga sin filas', () => {
    render(
      <AuditoriaTable
        items={[]}
        loading
        page={1}
        total={0}
        totalPages={0}
        pageSize={50}
        onPageChange={vi.fn()}
      />,
    )
    expect(screen.getByText(/cargando registros/i)).toBeInTheDocument()
  })

  it('muestra mensaje vacío', () => {
    render(
      <AuditoriaTable
        items={[]}
        loading={false}
        page={1}
        total={0}
        totalPages={0}
        pageSize={50}
        onPageChange={vi.fn()}
      />,
    )
    expect(screen.getByText(/no hay registros con los filtros/i)).toBeInTheDocument()
  })

  it('renderiza filas y paginación', () => {
    const onPageChange = vi.fn()
    render(
      <AuditoriaTable
        items={[sampleItem]}
        loading={false}
        page={1}
        total={120}
        totalPages={3}
        pageSize={50}
        onPageChange={onPageChange}
      />,
    )
    expect(screen.getByText('Coordinador')).toBeInTheDocument()
    expect(screen.getByText('GET /api/v1/incapacidades')).toBeInTheDocument()
    expect(screen.getByText('res-1')).toBeInTheDocument()
    expect(screen.getByText(/mostrando 1 - 50 de 120/i)).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /página siguiente/i }))
    expect(onPageChange).toHaveBeenCalledWith(2)
  })

  it('deshabilita anterior en página 1', () => {
    render(
      <AuditoriaTable
        items={[sampleItem]}
        loading={false}
        page={1}
        total={1}
        totalPages={1}
        pageSize={50}
        onPageChange={vi.fn()}
      />,
    )
    expect(screen.getByRole('button', { name: /página anterior/i })).toBeDisabled()
  })
})

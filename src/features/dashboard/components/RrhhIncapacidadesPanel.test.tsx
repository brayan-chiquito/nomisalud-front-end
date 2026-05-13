import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { RrhhIncapacidadesPanel } from './RrhhIncapacidadesPanel'

vi.mock('@/features/incapacidades/services/listIncapacidades.service', () => ({
  listIncapacidades: vi.fn(),
}))

import { listIncapacidades } from '@/features/incapacidades/services/listIncapacidades.service'

const sampleItem = {
  id: '550e8400-e29b-41d4-a716-446655440000',
  radicado: 'IN0123456789ABCDEF0',
  estado: 'recibida',
  colaborador_id: '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
  archivo_tipo: 'pdf',
  fecha_recepcion: '2025-03-01T12:00:00.000Z',
}

describe('RrhhIncapacidadesPanel', () => {
  beforeEach(() => {
    vi.mocked(listIncapacidades).mockReset()
  })

  it('muestra la tabla y el enlace de nueva incapacidad', async () => {
    vi.mocked(listIncapacidades).mockResolvedValue({
      items: [sampleItem],
      total: 1,
      pages: 1,
    })
    render(
      <MemoryRouter>
        <RrhhIncapacidadesPanel />
      </MemoryRouter>,
    )
    expect(screen.getByRole('heading', { name: /^incapacidades$/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /nueva incapacidad/i })).toHaveAttribute(
      'href',
      '/portal/radicar-incapacidad',
    )
    await waitFor(() => expect(screen.getByText('IN0123456789ABCDEF0')).toBeInTheDocument())
    const revisar = screen.getByRole('link', { name: /^revisar$/i })
    expect(revisar).toHaveAttribute(
      'href',
      `/incapacidad/revision-ia?id=${encodeURIComponent(sampleItem.id)}`,
    )
  })

  it('muestra el nombre del colaborador si viene en datos_extraidos', async () => {
    vi.mocked(listIncapacidades).mockResolvedValue({
      items: [
        {
          ...sampleItem,
          datos_extraidos: { colaborador: { nombre_completo: 'Carlos Pérez' } },
        },
      ],
      total: 1,
      pages: 1,
    })
    render(
      <MemoryRouter>
        <RrhhIncapacidadesPanel />
      </MemoryRouter>,
    )
    await waitFor(() => expect(screen.getByText('Carlos Pérez')).toBeInTheDocument())
  })

  it('muestra tipo de documento (archivo), no el tipo clínico extraído', async () => {
    vi.mocked(listIncapacidades).mockResolvedValue({
      items: [
        {
          ...sampleItem,
          archivo_tipo: 'jpg',
          colaborador_nombre: 'Ana María Gómez',
          colaborador_email: 'ana@nomisalud.com',
          entidad_nombre: 'EPS Sura',
          incapacidad_tipo_extraido: 'enfermedad_general',
        },
      ],
      total: 1,
      pages: 1,
    })
    render(
      <MemoryRouter>
        <RrhhIncapacidadesPanel />
      </MemoryRouter>,
    )
    await waitFor(() => {
      expect(screen.getByText('Ana María Gómez')).toBeInTheDocument()
      expect(screen.getByText('EPS Sura')).toBeInTheDocument()
    })
    expect(screen.getByTitle('Documento: JPG')).toHaveTextContent('JPG')
  })

  it('cambia el filtro de estado y vuelve a la página 1', async () => {
    vi.mocked(listIncapacidades).mockResolvedValue({
      items: [sampleItem],
      total: 30,
      pages: 2,
    })
    render(
      <MemoryRouter>
        <RrhhIncapacidadesPanel />
      </MemoryRouter>,
    )
    await waitFor(() => expect(listIncapacidades).toHaveBeenCalled())

    vi.mocked(listIncapacidades).mockResolvedValue({ items: [], total: 0, pages: 0 })
    fireEvent.change(screen.getByLabelText(/estado, actualmente/i), {
      target: { value: 'transcrita' },
    })
    await waitFor(() => {
      expect(listIncapacidades).toHaveBeenLastCalledWith(
        expect.objectContaining({ page: 1, estado: 'transcrita' }),
      )
    })
  })
})

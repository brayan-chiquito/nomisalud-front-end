import type { ComponentProps } from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { MiTramiteDetallePanel } from './MiTramiteDetallePanel'
import type { IncapacidadDetalle } from '@/features/incapacity-ai-review/types/incapacidadDetalle'

const detalleCompleto: IncapacidadDetalle = {
  id: 't1',
  radicado: 'IN-DET-99',
  estado: 'en_verificacion',
  archivo_tipo: 'pdf',
  fecha_recepcion: '2025-06-01T12:00:00.000Z',
  historial_estados: [
    {
      id: 'h1',
      estado_nuevo: 'recibida',
      timestamp: '2025-06-01T10:00:00.000Z',
      usuario_nombre: 'Sistema',
    },
    {
      id: 'h2',
      estado_nuevo: 'en_verificacion',
      timestamp: '2025-06-01T12:00:00.000Z',
      usuario_nombre: 'RRHH',
    },
  ],
  extraccion_ia: {
    datos_extraidos: {
      incapacidad: { origen: 'Enfermedad general', dias: '3' },
      entidad: { nombre: 'EPS Test' },
    },
  },
}

function renderPanel(props: ComponentProps<typeof MiTramiteDetallePanel>) {
  return render(
    <MemoryRouter>
      <MiTramiteDetallePanel {...props} />
    </MemoryRouter>,
  )
}

describe('MiTramiteDetallePanel', () => {
  it('muestra carga inicial', () => {
    renderPanel({ detail: null, loading: true, error: null })
    expect(screen.getByText(/cargando trámite/i)).toBeInTheDocument()
  })

  it('muestra error y enlace para volver al listado', () => {
    renderPanel({ detail: null, loading: false, error: 'No autorizado' })
    expect(screen.getByRole('alert')).toHaveTextContent('No autorizado')
    expect(screen.getByRole('link', { name: /volver a mis trámites/i })).toHaveAttribute(
      'href',
      '/portal/mi-tramite',
    )
  })

  it('muestra detalle, timeline y enlace a revisión IA', () => {
    renderPanel({ detail: detalleCompleto, loading: false, error: null })
    expect(screen.getByText('IN-DET-99')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /estado del trámite/i })).toBeInTheDocument()
    expect(screen.getByText('Recibida')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /ver documento y datos extraídos/i })).toHaveAttribute(
      'href',
      '/incapacidad/revision-ia?id=t1',
    )
  })
})

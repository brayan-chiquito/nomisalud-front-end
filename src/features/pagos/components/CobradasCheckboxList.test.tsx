import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { CobradasCheckboxList } from './CobradasCheckboxList'
import { EMPTY_DISPONIBLES_RRHH } from '../utils/radicadoDisponibleDisplay'

describe('CobradasCheckboxList', () => {
  it('muestra carga', () => {
    render(
      <CobradasCheckboxList
        loading
        items={[]}
        selectedRadicados={new Set()}
        submitting={false}
        emptyMessage={EMPTY_DISPONIBLES_RRHH}
        onToggle={vi.fn()}
      />,
    )
    expect(screen.getByText(/cargando radicados disponibles/i)).toBeInTheDocument()
  })

  it('muestra mensaje vacío y permite seleccionar', () => {
    const onToggle = vi.fn()
    render(
      <CobradasCheckboxList
        loading={false}
        items={[
          {
            incapacidad_id: '1',
            radicado: 'IN01',
            colaborador_nombre: 'Ana',
            entidad_nombre: 'EPS',
          },
        ]}
        selectedRadicados={new Set()}
        submitting={false}
        emptyMessage={EMPTY_DISPONIBLES_RRHH}
        onToggle={onToggle}
      />,
    )
    fireEvent.click(screen.getByRole('checkbox'))
    expect(onToggle).toHaveBeenCalledWith('IN01')
    expect(screen.getByText('IN01')).toBeInTheDocument()
    expect(screen.getByText(/Ana · EPS/)).toBeInTheDocument()
  })
})

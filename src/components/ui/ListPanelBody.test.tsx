import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ListPanelBody } from './ListPanelBody'

describe('ListPanelBody', () => {
  it('muestra loading', () => {
    render(<ListPanelBody loading items={[]} emptyMessage="Vacío" renderItem={() => null} />)
    expect(screen.getByText(/cargando/i)).toBeInTheDocument()
  })

  it('muestra vacío', () => {
    render(
      <ListPanelBody loading={false} items={[]} emptyMessage="Sin datos" renderItem={() => null} />,
    )
    expect(screen.getByText('Sin datos')).toBeInTheDocument()
  })

  it('renderiza items', () => {
    render(
      <ListPanelBody
        loading={false}
        items={[{ id: '1' }]}
        emptyMessage="Vacío"
        renderItem={(item) => <span key={item.id}>Fila {item.id}</span>}
      />,
    )
    expect(screen.getByText('Fila 1')).toBeInTheDocument()
  })

  it('mantiene filas visibles mientras fetching', () => {
    render(
      <ListPanelBody
        loading={false}
        fetching
        items={[{ id: '1' }]}
        emptyMessage="Vacío"
        renderItem={(item) => <span key={item.id}>Fila {item.id}</span>}
      />,
    )
    expect(screen.getByText('Fila 1')).toBeInTheDocument()
  })
})

import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import { StatusTimeline, type StatusTimelineRecord } from './StatusTimeline'

const ENTRIES_UNSORTED: readonly StatusTimelineRecord[] = [
  {
    id: 'b',
    estadoLabel: 'Segundo',
    phase: 'completed',
    usuarioNombre: 'Ana López',
    occurredAtIso: '2025-06-02T14:00:00.000Z',
  },
  {
    id: 'a',
    estadoLabel: 'Primero',
    phase: 'completed',
    usuarioNombre: 'Sistema',
    occurredAtIso: '2025-06-02T10:00:00.000Z',
  },
  {
    id: 'c',
    estadoLabel: 'En curso',
    phase: 'current',
    usuarioNombre: 'Carlos Ruiz',
    occurredAtIso: '2025-06-02T16:00:00.000Z',
  },
]

describe('StatusTimeline', () => {
  it('ordena los nodos por fecha ascendente aunque la prop venga desordenada', () => {
    render(<StatusTimeline title="Historial" entries={ENTRIES_UNSORTED} />)
    const list = screen.getByRole('list')
    const items = within(list).getAllByRole('listitem')
    expect(items).toHaveLength(3)
    expect(within(items[0]).getByText('Primero')).toBeInTheDocument()
    expect(within(items[1]).getByText('Segundo')).toBeInTheDocument()
    expect(within(items[2]).getByText('En curso')).toBeInTheDocument()
  })

  it('muestra usuario y marca de tiempo en cada nodo', () => {
    render(<StatusTimeline entries={[ENTRIES_UNSORTED[1]]} />)
    expect(screen.getByText('Sistema')).toBeInTheDocument()
    expect(screen.getByRole('time')).toHaveAttribute('dateTime', '2025-06-02T10:00:00.000Z')
  })
})

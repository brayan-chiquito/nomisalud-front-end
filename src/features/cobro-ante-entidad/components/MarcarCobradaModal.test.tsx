import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MarcarCobradaModal } from './MarcarCobradaModal'

describe('MarcarCobradaModal', () => {
  it('no renderiza si está cerrado', () => {
    render(
      <MarcarCobradaModal
        isOpen={false}
        radicado="IN01"
        onClose={() => undefined}
        onConfirm={vi.fn().mockResolvedValue(true)}
      />,
    )
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('muestra radicado y confirma con observación', async () => {
    const onConfirm = vi.fn().mockResolvedValue(true)
    render(
      <MarcarCobradaModal
        isOpen
        radicado="IN0123"
        onClose={() => undefined}
        onConfirm={onConfirm}
      />,
    )
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText(/IN0123/)).toBeInTheDocument()
    fireEvent.change(screen.getByLabelText(/observación/i), {
      target: { value: 'ref 99' },
    })
    fireEvent.click(screen.getByRole('button', { name: /confirmar cobro/i }))
    expect(onConfirm).toHaveBeenCalledWith('ref 99')
  })
})

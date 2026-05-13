import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { RejectIncapacityModal } from './RejectIncapacityModal'

const noopConfirm = vi.fn(async () => false)

describe('RejectIncapacityModal', () => {
  it('no renderiza cuando isOpen es false', () => {
    const { container } = render(
      <RejectIncapacityModal isOpen={false} onClose={() => undefined} onConfirm={noopConfirm} />,
    )
    expect(container.firstChild).toBeNull()
  })

  it('muestra el diálogo y cierra con el botón Cerrar', () => {
    const onClose = vi.fn()
    render(<RejectIncapacityModal isOpen onClose={onClose} onConfirm={noopConfirm} />)
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /cerrar/i }))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('permite pulsar cada motivo de rechazo', () => {
    render(<RejectIncapacityModal isOpen onClose={() => undefined} onConfirm={noopConfirm} />)
    fireEvent.click(screen.getByRole('button', { name: /documento ilegible/i }))
    fireEvent.click(screen.getByRole('button', { name: /datos no coinciden/i }))
    fireEvent.click(screen.getByRole('button', { name: /incapacidad ya vencida/i }))
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('cancelar invoca onClose', () => {
    const onClose = vi.fn()
    render(<RejectIncapacityModal isOpen onClose={onClose} onConfirm={noopConfirm} />)
    fireEvent.click(screen.getByRole('button', { name: /^cancelar$/i }))
    expect(onClose).toHaveBeenCalled()
  })
})

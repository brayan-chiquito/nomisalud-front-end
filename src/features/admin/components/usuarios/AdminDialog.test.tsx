import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AdminDialog, AdminDialogSubmitButton } from './AdminDialog'

describe('AdminDialog', () => {
  it('no renderiza contenido cuando está cerrado', () => {
    const { container } = render(
      <AdminDialog isOpen={false} titleId="dlg-title" title="Título" onClose={vi.fn()}>
        Contenido
      </AdminDialog>,
    )
    expect(container).toBeEmptyDOMElement()
  })

  it('muestra título, contenido y footer', () => {
    render(
      <AdminDialog
        isOpen
        titleId="dlg-title"
        title="Título modal"
        onClose={vi.fn()}
        footer={<button type="button">Acción</button>}
      >
        Cuerpo
      </AdminDialog>,
    )
    expect(screen.getByRole('heading', { name: 'Título modal' })).toBeInTheDocument()
    expect(screen.getByText('Cuerpo')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Acción' })).toBeInTheDocument()
  })

  it('cierra con el botón X', async () => {
    const onClose = vi.fn()
    const user = userEvent.setup()
    render(
      <AdminDialog isOpen titleId="dlg-title" title="Título" onClose={onClose}>
        Cuerpo
      </AdminDialog>,
    )
    await user.click(screen.getByRole('button', { name: 'Cerrar' }))
    expect(onClose).toHaveBeenCalled()
  })

  it('no cierra al cancelar el diálogo si está enviando', () => {
    const onClose = vi.fn()
    render(
      <AdminDialog isOpen titleId="dlg-title" title="Título" onClose={onClose} isSubmitting>
        Cuerpo
      </AdminDialog>,
    )
    const dialog = document.querySelector('dialog')!
    fireEvent(dialog, new Event('cancel', { bubbles: true, cancelable: true }))
    expect(onClose).not.toHaveBeenCalled()
  })

  it('cierra al cancelar el diálogo si no está enviando', () => {
    const onClose = vi.fn()
    render(
      <AdminDialog isOpen titleId="dlg-title" title="Título" onClose={onClose}>
        Cuerpo
      </AdminDialog>,
    )
    const dialog = document.querySelector('dialog')!
    fireEvent(dialog, new Event('cancel', { bubbles: true, cancelable: true }))
    expect(onClose).toHaveBeenCalled()
  })
})

describe('AdminDialogSubmitButton', () => {
  it('muestra estado de guardado y respeta disabled', () => {
    render(<AdminDialogSubmitButton label="Guardar" isSubmitting disabled form="f1" />)
    expect(screen.getByRole('button', { name: /guardando/i })).toBeDisabled()
    expect(screen.getByRole('button')).toHaveAttribute('form', 'f1')
  })

  it('muestra la etiqueta cuando no está enviando', () => {
    render(<AdminDialogSubmitButton label="Guardar" isSubmitting={false} />)
    expect(screen.getByRole('button', { name: 'Guardar' })).toBeEnabled()
  })
})

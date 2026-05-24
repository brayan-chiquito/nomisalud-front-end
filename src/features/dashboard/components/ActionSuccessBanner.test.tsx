import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ActionSuccessBanner } from './ActionSuccessBanner'

describe('ActionSuccessBanner', () => {
  it('muestra mensaje de confirmación y permite cerrar', async () => {
    const onDismiss = vi.fn()
    const user = userEvent.setup()
    render(<ActionSuccessBanner kind="confirmada" onDismiss={onDismiss} />)

    expect(screen.getByRole('status')).toHaveTextContent(/confirmada.*transcrita/i)
    await user.click(screen.getByRole('button', { name: /cerrar aviso/i }))
    expect(onDismiss).toHaveBeenCalled()
  })
})

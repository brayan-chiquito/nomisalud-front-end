import { describe, it, expect } from 'vitest'
import { messageForActionSuccess } from './dashboardNavigation'

describe('messageForActionSuccess', () => {
  it('devuelve mensaje para confirmación', () => {
    expect(messageForActionSuccess('confirmada')).toMatch(/transcrita/i)
  })

  it('devuelve mensaje para rechazo', () => {
    expect(messageForActionSuccess('rechazada')).toMatch(/rechazada correctamente/i)
  })

  it('devuelve mensaje para documentación solicitada', () => {
    expect(messageForActionSuccess('documentacion_solicitada')).toMatch(/doc\. incompleta/i)
  })
})

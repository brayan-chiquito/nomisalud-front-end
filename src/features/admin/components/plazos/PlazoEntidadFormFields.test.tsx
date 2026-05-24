import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PlazoEntidadFormFields } from './PlazoEntidadFormFields'
import { emptyPlazoEntidadFormValues } from '../../utils/plazoEntidadFormPayload'

describe('PlazoEntidadFormFields', () => {
  it('propaga cambios en los campos', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()

    render(<PlazoEntidadFormFields values={emptyPlazoEntidadFormValues()} onChange={onChange} />)

    await user.type(screen.getByLabelText(/^entidad/i), 'EPS')
    await user.selectOptions(screen.getByLabelText(/tipo de incapacidad/i), 'accidente_trabajo')
    await user.type(screen.getByLabelText(/plazo límite/i), '12')
    await user.selectOptions(screen.getByLabelText(/^unidad/i), 'meses')
    await user.type(screen.getByLabelText(/días de alerta/i), '4')
    await user.type(screen.getByLabelText(/días promedio de pago/i), '20')

    expect(onChange).toHaveBeenCalled()
    expect(onChange.mock.calls.some(([patch]) => patch.entidad_nombre !== undefined)).toBe(true)
    expect(
      onChange.mock.calls.some(([patch]) => patch.tipo_incapacidad === 'accidente_trabajo'),
    ).toBe(true)
    expect(onChange.mock.calls.some(([patch]) => patch.unidad_limite === 'meses')).toBe(true)
  })
})

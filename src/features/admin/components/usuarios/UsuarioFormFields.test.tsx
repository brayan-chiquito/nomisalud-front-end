import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { UsuarioFormFields } from './UsuarioFormFields'

describe('UsuarioFormFields', () => {
  it('actualiza campos core y extra', async () => {
    const onCore = vi.fn()
    const onExtra = vi.fn()
    const user = userEvent.setup()

    render(
      <UsuarioFormFields
        core={{ email: '', role: 'colaborador', nombre_completo: '', activo: true }}
        extra={{
          tipo_documento: '',
          numero_documento: '',
          area: '',
          cargo: '',
          eps_afiliacion: '',
          arl_afiliacion: '',
        }}
        onCoreChange={onCore}
        onExtraChange={onExtra}
        showPassword
        password=""
        onPasswordChange={vi.fn()}
      />,
    )

    await user.type(screen.getByLabelText(/correo electrónico/i), 'a@test.com')
    expect(onCore).toHaveBeenCalled()
    await user.click(screen.getByRole('checkbox'))
    expect(onCore).toHaveBeenCalledWith({ activo: false })
    await user.selectOptions(screen.getByLabelText(/^rol$/i), 'admin')
    expect(onCore).toHaveBeenCalledWith({ role: 'admin' })
    await user.type(screen.getByLabelText(/nombre completo/i), 'Ana')
    expect(onCore).toHaveBeenCalled()
    await user.type(screen.getByLabelText(/tipo documento/i), 'CC')
    await user.type(screen.getByLabelText(/número documento/i), '99')
    await user.type(screen.getByLabelText(/^área$/i), 'RRHH')
    await user.type(screen.getByLabelText(/cargo/i), 'Analista')
    await user.type(screen.getByLabelText(/^eps$/i), 'Sura')
    await user.type(screen.getByLabelText(/^arl$/i), 'Positiva')
    expect(onExtra).toHaveBeenCalled()
  })

  it('deshabilita el correo cuando emailDisabled', () => {
    render(
      <UsuarioFormFields
        core={{ email: 'fijo@test.com', role: 'colaborador', nombre_completo: '', activo: true }}
        extra={{
          tipo_documento: '',
          numero_documento: '',
          area: '',
          cargo: '',
          eps_afiliacion: '',
          arl_afiliacion: '',
        }}
        onCoreChange={vi.fn()}
        onExtraChange={vi.fn()}
        emailDisabled
      />,
    )
    expect(screen.getByLabelText(/correo electrónico/i)).toBeDisabled()
  })

  it('no muestra contraseña sin showPassword', () => {
    render(
      <UsuarioFormFields
        core={{ email: '', role: 'colaborador', nombre_completo: '', activo: true }}
        extra={{
          tipo_documento: '',
          numero_documento: '',
          area: '',
          cargo: '',
          eps_afiliacion: '',
          arl_afiliacion: '',
        }}
        onCoreChange={vi.fn()}
        onExtraChange={vi.fn()}
      />,
    )
    expect(screen.queryByLabelText(/^contraseña$/i)).not.toBeInTheDocument()
  })
})

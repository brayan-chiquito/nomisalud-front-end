import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, act, fireEvent } from '@testing-library/react'
import { LoginForm } from './LoginForm'

const mockNavigate = vi.fn()

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>()
  return { ...actual, useNavigate: () => mockNavigate }
})

vi.mock('@/assets/logo.png', () => ({ default: 'logo.png' }))

const VALID_EMAIL = 'admin@nomisalud.com'
const VALID_PASSWORD = 'Admin1234'

function renderForm() {
  render(<LoginForm />)
}

function fillForm(email: string, password: string) {
  fireEvent.change(screen.getByLabelText('Correo electrónico'), { target: { value: email } })
  fireEvent.change(screen.getByLabelText('Contraseña'), { target: { value: password } })
}

async function submitWith(email: string, password: string) {
  fillForm(email, password)
  fireEvent.click(screen.getByRole('button', { name: /iniciar sesión/i }))
  await act(async () => {
    await vi.advanceTimersByTimeAsync(800)
  })
}

describe('LoginForm', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    mockNavigate.mockClear()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('render inicial', () => {
    it('muestra el logo de Nomisalud', () => {
      renderForm()
      expect(screen.getByAltText('Nomisalud')).toBeInTheDocument()
    })

    it('muestra el subtítulo', () => {
      renderForm()
      expect(screen.getByText('Inicia sesión en tu cuenta')).toBeInTheDocument()
    })

    it('muestra el campo de correo electrónico', () => {
      renderForm()
      expect(screen.getByLabelText('Correo electrónico')).toBeInTheDocument()
    })

    it('muestra el campo de contraseña', () => {
      renderForm()
      expect(screen.getByLabelText('Contraseña')).toBeInTheDocument()
    })

    it('el campo de contraseña inicia oculto (type=password)', () => {
      renderForm()
      expect(screen.getByLabelText('Contraseña')).toHaveAttribute('type', 'password')
    })

    it('muestra el botón de iniciar sesión', () => {
      renderForm()
      expect(screen.getByRole('button', { name: /iniciar sesión/i })).toBeInTheDocument()
    })

    it('muestra el link de olvidé mi contraseña', () => {
      renderForm()
      expect(screen.getByText('¿Olvidaste tu contraseña?')).toBeInTheDocument()
    })

    it('muestra el copyright', () => {
      renderForm()
      expect(
        screen.getByText('© 2025 Nomisalud. Todos los derechos reservados.'),
      ).toBeInTheDocument()
    })

    it('no muestra la alerta de error en estado inicial', () => {
      renderForm()
      expect(screen.queryByText(/contraseña incorrectos/i)).not.toBeInTheDocument()
    })

    it('no muestra la alerta de éxito en estado inicial', () => {
      renderForm()
      expect(screen.queryByText(/inicio de sesión exitoso/i)).not.toBeInTheDocument()
    })
  })

  describe('actualización de campos', () => {
    it('actualiza el valor del correo al cambiar el input', () => {
      renderForm()
      fireEvent.change(screen.getByLabelText('Correo electrónico'), {
        target: { value: 'test@test.com' },
      })
      expect(screen.getByLabelText('Correo electrónico')).toHaveValue('test@test.com')
    })

    it('actualiza el valor de la contraseña al cambiar el input', () => {
      renderForm()
      fireEvent.change(screen.getByLabelText('Contraseña'), { target: { value: 'mipass123' } })
      expect(screen.getByLabelText('Contraseña')).toHaveValue('mipass123')
    })
  })

  describe('toggle de contraseña', () => {
    it('muestra la contraseña al hacer clic en el icono de ojo', () => {
      renderForm()
      fireEvent.click(screen.getByRole('button', { name: /mostrar contraseña/i }))
      expect(screen.getByLabelText('Contraseña')).toHaveAttribute('type', 'text')
    })

    it('oculta la contraseña al hacer clic de nuevo en el icono', () => {
      renderForm()
      fireEvent.click(screen.getByRole('button', { name: /mostrar contraseña/i }))
      fireEvent.click(screen.getByRole('button', { name: /ocultar contraseña/i }))
      expect(screen.getByLabelText('Contraseña')).toHaveAttribute('type', 'password')
    })
  })

  describe('estado de carga (loading)', () => {
    it('muestra el texto de carga al enviar el formulario', () => {
      renderForm()
      fillForm(VALID_EMAIL, VALID_PASSWORD)
      fireEvent.click(screen.getByRole('button', { name: /iniciar sesión/i }))
      expect(screen.getByText(/iniciando sesión/i)).toBeInTheDocument()
    })

    it('deshabilita el campo de correo durante la carga', () => {
      renderForm()
      fillForm(VALID_EMAIL, VALID_PASSWORD)
      fireEvent.click(screen.getByRole('button', { name: /iniciar sesión/i }))
      expect(screen.getByLabelText('Correo electrónico')).toBeDisabled()
    })

    it('deshabilita el campo de contraseña durante la carga', () => {
      renderForm()
      fillForm(VALID_EMAIL, VALID_PASSWORD)
      fireEvent.click(screen.getByRole('button', { name: /iniciar sesión/i }))
      expect(screen.getByLabelText('Contraseña')).toBeDisabled()
    })
  })

  describe('credenciales correctas → estado éxito', () => {
    it('muestra la alerta de éxito', async () => {
      renderForm()
      await submitWith(VALID_EMAIL, VALID_PASSWORD)
      expect(screen.getByText(/inicio de sesión exitoso/i)).toBeInTheDocument()
    })

    it('muestra el botón "¡Bienvenido!"', async () => {
      renderForm()
      await submitWith(VALID_EMAIL, VALID_PASSWORD)
      expect(screen.getByRole('button', { name: /bienvenido/i })).toBeInTheDocument()
    })

    it('deshabilita el botón en estado éxito', async () => {
      renderForm()
      await submitWith(VALID_EMAIL, VALID_PASSWORD)
      expect(screen.getByRole('button', { name: /bienvenido/i })).toBeDisabled()
    })

    it('deshabilita el correo en estado éxito', async () => {
      renderForm()
      await submitWith(VALID_EMAIL, VALID_PASSWORD)
      expect(screen.getByLabelText('Correo electrónico')).toBeDisabled()
    })

    it('redirige al dashboard tras el delay de éxito', async () => {
      renderForm()
      await submitWith(VALID_EMAIL, VALID_PASSWORD)
      await act(async () => {
        await vi.advanceTimersByTimeAsync(1500)
      })
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard')
    })
  })

  describe('credenciales incorrectas → estado error', () => {
    it('muestra la alerta de error con credenciales inválidas', async () => {
      renderForm()
      await submitWith('malo@test.com', 'wrongpass')
      expect(screen.getByText(/contraseña incorrectos/i)).toBeInTheDocument()
    })

    it('muestra el botón "Intentar de nuevo" en estado error', async () => {
      renderForm()
      await submitWith('malo@test.com', 'wrongpass')
      expect(screen.getByRole('button', { name: /intentar de nuevo/i })).toBeInTheDocument()
    })

    it('falla si solo el correo es correcto pero la contraseña no', async () => {
      renderForm()
      await submitWith(VALID_EMAIL, 'wrongpass')
      expect(screen.getByText(/contraseña incorrectos/i)).toBeInTheDocument()
    })

    it('falla si solo la contraseña es correcta pero el correo no', async () => {
      renderForm()
      await submitWith('otro@test.com', VALID_PASSWORD)
      expect(screen.getByText(/contraseña incorrectos/i)).toBeInTheDocument()
    })

    it('no llama a navigate cuando las credenciales son incorrectas', async () => {
      renderForm()
      await submitWith('malo@test.com', 'wrongpass')
      await act(async () => {
        await vi.advanceTimersByTimeAsync(1500)
      })
      expect(mockNavigate).not.toHaveBeenCalled()
    })
  })

  describe('botón "Intentar de nuevo"', () => {
    async function goToError() {
      renderForm()
      await submitWith('malo@test.com', 'wrongpass')
    }

    it('vuelve al estado inicial al hacer clic en "Intentar de nuevo"', async () => {
      await goToError()
      fireEvent.click(screen.getByRole('button', { name: /intentar de nuevo/i }))
      expect(screen.getByRole('button', { name: /iniciar sesión/i })).toBeInTheDocument()
      expect(screen.queryByText(/contraseña incorrectos/i)).not.toBeInTheDocument()
    })

    it('limpia el campo de contraseña al reintentar', async () => {
      await goToError()
      fireEvent.click(screen.getByRole('button', { name: /intentar de nuevo/i }))
      expect(screen.getByLabelText('Contraseña')).toHaveValue('')
    })
  })

  describe('accesibilidad', () => {
    it('el campo de correo tiene type="email"', () => {
      renderForm()
      expect(screen.getByLabelText('Correo electrónico')).toHaveAttribute('type', 'email')
    })

    it('el campo de correo tiene autoComplete="email"', () => {
      renderForm()
      expect(screen.getByLabelText('Correo electrónico')).toHaveAttribute('autocomplete', 'email')
    })

    it('el campo de contraseña tiene autoComplete="current-password"', () => {
      renderForm()
      expect(screen.getByLabelText('Contraseña')).toHaveAttribute(
        'autocomplete',
        'current-password',
      )
    })

    it('el botón de toggle tiene aria-label descriptivo al estar oculta', () => {
      renderForm()
      expect(screen.getByRole('button', { name: /mostrar contraseña/i })).toBeInTheDocument()
    })

    it('el botón de toggle cambia su aria-label al mostrarse', () => {
      renderForm()
      fireEvent.click(screen.getByRole('button', { name: /mostrar contraseña/i }))
      expect(screen.getByRole('button', { name: /ocultar contraseña/i })).toBeInTheDocument()
    })
  })
})

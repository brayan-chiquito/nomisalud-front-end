import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Mail, CircleAlert, CircleCheck, Loader2 } from 'lucide-react'
import logo from '@/assets/logo.png'
import type { LoginFormState } from '../types'
import { loginService } from '../services/auth.service'
import { useAuth } from '../context/AuthContext'
import { buttonClassName, inputClassName, labelClassName } from '@/components/ui/buttonStyles'
import { cn } from '@/utils/cn'

export function LoginForm() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [formState, setFormState] = useState<LoginFormState>('idle')

  const isError = formState === 'error'
  const isSuccess = formState === 'success'
  const isLoading = formState === 'loading'

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setFormState('loading')

    try {
      const response = await loginService({ email, password })
      login(response.access_token)
      setFormState('success')
      setTimeout(() => navigate('/dashboard'), 1500)
    } catch {
      setFormState('error')
    }
  }

  const handleRetry = () => {
    setFormState('idle')
    setPassword('')
  }

  const fieldBorder = isError
    ? 'border-danger/50 focus:border-danger focus:ring-danger/20'
    : isSuccess
      ? 'border-success/50 focus:border-success focus:ring-success/20'
      : 'border-gray-200 focus:border-primary/50 focus:ring-primary/20'

  return (
    <div className="flex min-h-screen">
      {/* Panel izquierdo — decorativo */}
      <div className="relative hidden w-2/5 flex-col justify-between overflow-hidden bg-primary-600 p-12 lg:flex">
        <div className="absolute inset-0 opacity-10" aria-hidden>
          <div className="absolute top-20 left-10 h-64 w-64 rounded-full border border-white" />
          <div className="absolute top-40 left-20 h-96 w-96 rounded-full border border-white" />
          <div className="absolute -right-10 -bottom-10 h-72 w-72 rounded-full border border-white" />
        </div>

        <div className="relative z-10">
          <div className="mb-8 flex items-center gap-3">
            <div className="rounded-xl bg-white/95 p-2.5 shadow-sm">
              <img
                src={logo}
                alt=""
                aria-hidden
                className="h-10 w-auto max-w-[120px] object-contain"
              />
            </div>
          </div>
          <h1 className="mb-3 text-3xl leading-tight font-bold text-white">
            Gestión inteligente
            <br />
            de incapacidades
          </h1>
          <p className="text-sm leading-relaxed text-blue-100">
            Centraliza, automatiza y rastrea el ciclo completo de incapacidades médicas de tu
            empresa.
          </p>
        </div>

        <div className="relative z-10 grid grid-cols-2 gap-4">
          <div className="rounded-xl bg-white/10 p-4">
            <p className="text-2xl font-bold text-white">85%+</p>
            <p className="mt-1 text-xs text-blue-100">Precisión de extracción IA</p>
          </div>
          <div className="rounded-xl bg-white/10 p-4">
            <p className="text-2xl font-bold text-white">70%</p>
            <p className="mt-1 text-xs text-blue-100">Reducción tiempo manual</p>
          </div>
        </div>
      </div>

      {/* Panel derecho — formulario */}
      <div className="flex flex-1 items-center justify-center bg-gray-50/50 p-8">
        <div className="w-full max-w-sm animate-fade-in">
          <div className="mb-6 flex justify-center">
            <img src={logo} alt="Nomisalud" className="h-[100px] w-[150px] object-contain" />
          </div>

          <h2 className="mb-1 text-2xl font-semibold tracking-tight text-gray-900">Bienvenido</h2>
          <p className="mb-8 text-sm text-gray-400">Inicia sesión en tu cuenta</p>

          {isError ? (
            <div className="mb-6 flex items-start gap-2 rounded-lg border border-danger/20 bg-danger-light p-3">
              <CircleAlert size={18} className="mt-px shrink-0 text-danger" aria-hidden />
              <p className="text-sm text-danger-text">
                Correo o contraseña incorrectos. Por favor, intenta de nuevo.
              </p>
            </div>
          ) : null}

          {isSuccess ? (
            <div className="mb-6 flex items-start gap-2 rounded-lg border border-success/20 bg-success-light p-3">
              <CircleCheck size={18} className="mt-px shrink-0 text-success" aria-hidden />
              <p className="text-sm text-success-text">
                ¡Inicio de sesión exitoso! Redirigiendo al sistema...
              </p>
            </div>
          ) : null}

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <div>
              <label htmlFor="email" className={labelClassName}>
                Correo electrónico
              </label>
              <div className="relative">
                <Mail
                  size={16}
                  className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"
                  aria-hidden
                />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (isError) setFormState('idle')
                  }}
                  placeholder="correo@ejemplo.com"
                  disabled={isSuccess || isLoading}
                  autoComplete="email"
                  required
                  className={cn(inputClassName, 'pl-9', fieldBorder)}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className={labelClassName}>
                Contraseña
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    if (isError) setFormState('idle')
                  }}
                  placeholder="••••••••"
                  disabled={isSuccess || isLoading}
                  autoComplete="current-password"
                  required
                  className={cn(inputClassName, 'pr-10', fieldBorder)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className={buttonClassName('icon', 'absolute top-1/2 right-1 -translate-y-1/2')}
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="text-center">
              <button
                type="button"
                className="text-xs text-primary hover:underline focus:outline-none"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            {isError ? (
              <button
                type="button"
                onClick={handleRetry}
                className={buttonClassName('danger', 'h-11 w-full')}
              >
                Intentar de nuevo
              </button>
            ) : (
              <button
                type="submit"
                disabled={isLoading || isSuccess}
                className={buttonClassName('primary', 'h-11 w-full')}
              >
                {isLoading ? <Loader2 size={18} className="animate-spin" aria-hidden /> : null}
                {isSuccess ? '¡Bienvenido!' : isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
              </button>
            )}
          </form>

          <p className="mt-6 text-center text-[11px] text-gray-400">
            © 2025 Nomisalud. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </div>
  )
}

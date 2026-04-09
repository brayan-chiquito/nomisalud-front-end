import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Mail, CircleAlert, CircleCheck, Loader2 } from 'lucide-react'
import logo from '@/assets/logo.png'
import type { LoginFormState } from '../types'
import { loginService } from '../services/auth.service'
import { useAuth } from '../context/AuthContext'

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

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div
        className="w-full max-w-[400px] rounded-xl bg-white p-10"
        style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.10)' }}
      >
        {/* Logo */}
        <div className="mb-5 flex justify-center">
          <img src={logo} alt="Nomisalud" className="h-[100px] w-[150px] object-contain" />
        </div>

        {/* Subtítulo */}
        <p className="mb-5 text-center text-[13px] text-gray-500">Inicia sesión en tu cuenta</p>

        {/* Alerta de error */}
        {isError && (
          <div className="mb-5 flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 p-3">
            <CircleAlert size={18} className="mt-px shrink-0 text-red-600" />
            <p className="text-[13px] text-red-600">
              Correo o contraseña incorrectos. Por favor, intenta de nuevo.
            </p>
          </div>
        )}

        {/* Alerta de éxito */}
        {isSuccess && (
          <div className="mb-5 flex items-start gap-2.5 rounded-lg border border-green-200 bg-green-50 p-3">
            <CircleCheck size={18} className="mt-px shrink-0 text-green-600" />
            <p className="text-[13px] text-green-600">
              ¡Inicio de sesión exitoso! Redirigiendo al sistema...
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          {/* Campo de correo */}
          <div className="mb-5 flex flex-col gap-1.5">
            <label htmlFor="email" className="text-[13px] font-medium text-gray-700">
              Correo electrónico
            </label>
            <div
              className={`flex h-[46px] items-center gap-2 rounded-lg border px-3 transition-colors ${
                isError
                  ? 'border-red-600 bg-[#FFF5F5]'
                  : 'border-gray-300 bg-gray-50 focus-within:border-blue-500 focus-within:bg-white'
              }`}
            >
              <Mail size={16} className="shrink-0 text-gray-400" />
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
                className="w-full bg-transparent text-[14px] text-gray-800 outline-none placeholder:text-gray-400 disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>
          </div>

          {/* Campo de contraseña */}
          <div className="mb-3 flex flex-col gap-1.5">
            <label htmlFor="password" className="text-[13px] font-medium text-gray-700">
              Contraseña
            </label>
            <div
              className={`flex h-[46px] items-center gap-2 rounded-lg border px-3 transition-colors ${
                isError
                  ? 'border-red-600 bg-[#FFF5F5]'
                  : isSuccess
                    ? 'border-green-600 bg-green-50'
                    : 'border-gray-300 bg-gray-50 focus-within:border-blue-500 focus-within:bg-white'
              }`}
            >
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
                className="w-full bg-transparent text-[14px] text-gray-800 outline-none placeholder:text-gray-400 disabled:cursor-not-allowed disabled:opacity-60"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="shrink-0 text-gray-400 hover:text-gray-600 focus:outline-none"
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Link olvidé mi contraseña */}
          <div className="mb-5 text-right">
            <button
              type="button"
              className="text-[12px] text-blue-600 hover:underline focus:outline-none"
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>

          {/* Botón de acción */}
          {isError ? (
            <button
              type="button"
              onClick={handleRetry}
              className="flex h-12 w-full items-center justify-center rounded-lg bg-red-600 text-[15px] font-semibold text-white transition-opacity hover:opacity-90 active:opacity-80"
            >
              Intentar de nuevo
            </button>
          ) : (
            <button
              type="submit"
              disabled={isLoading || isSuccess}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-blue-600 text-[15px] font-semibold text-white transition-opacity hover:opacity-90 active:opacity-80 disabled:cursor-not-allowed disabled:opacity-70"
              style={{ boxShadow: '0 2px 8px rgba(37,99,235,0.25)' }}
            >
              {isLoading && <Loader2 size={18} className="animate-spin" />}
              {isSuccess ? '¡Bienvenido!' : isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </button>
          )}
        </form>

        {/* Copyright */}
        <p className="mt-5 text-center text-[11px] text-gray-400">
          © 2025 Nomisalud. Todos los derechos reservados.
        </p>
      </div>
    </div>
  )
}

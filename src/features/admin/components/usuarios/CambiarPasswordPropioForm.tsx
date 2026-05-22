import { useState } from 'react'
import { Loader2, Lock } from 'lucide-react'
import { buttonClassName, inputClassName, labelClassName } from '@/components/ui/buttonStyles'
import { messageFromLoadError } from '@/utils/messageFromLoadError'
import { changeOwnPassword } from '../../services/usuariosAdmin.service'
import { Card } from '@/components/ui/Card'

/** Formulario de cambio de contraseña propia (`PUT /auth/password`). */
export function CambiarPasswordPropioForm() {
  const [passwordActual, setPasswordActual] = useState('')
  const [passwordNueva, setPasswordNueva] = useState('')
  const [confirm, setConfirm] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSuccess(false)
    if (passwordNueva.length < 8) {
      setError('La nueva contraseña debe tener al menos 8 caracteres.')
      return
    }
    if (passwordNueva !== confirm) {
      setError('La confirmación no coincide con la nueva contraseña.')
      return
    }
    setSubmitting(true)
    setError(null)
    try {
      await changeOwnPassword({
        password_actual: passwordActual,
        password_nueva: passwordNueva,
      })
      setPasswordActual('')
      setPasswordNueva('')
      setConfirm('')
      setSuccess(true)
    } catch (err) {
      setError(messageFromLoadError(err, 'No se pudo cambiar la contraseña.'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Card>
      <div className="border-b border-gray-100 px-5 py-5 sm:px-6">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
          <Lock className="h-5 w-5 text-primary" aria-hidden />
          Cambiar contraseña
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Actualiza la contraseña de tu cuenta. Necesitarás la contraseña actual.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="max-w-md px-5 py-6 sm:px-6">
        <div className="flex flex-col gap-4">
          <div>
            <label htmlFor="pwd-actual" className={labelClassName}>
              Contraseña actual
            </label>
            <input
              id="pwd-actual"
              type="password"
              required
              autoComplete="current-password"
              value={passwordActual}
              onChange={(e) => setPasswordActual(e.target.value)}
              className={inputClassName}
            />
          </div>
          <div>
            <label htmlFor="pwd-nueva" className={labelClassName}>
              Nueva contraseña
            </label>
            <input
              id="pwd-nueva"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              value={passwordNueva}
              onChange={(e) => setPasswordNueva(e.target.value)}
              className={inputClassName}
            />
          </div>
          <div>
            <label htmlFor="pwd-confirm" className={labelClassName}>
              Confirmar nueva contraseña
            </label>
            <input
              id="pwd-confirm"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className={inputClassName}
            />
          </div>
        </div>
        {error ? (
          <p className="mt-4 text-sm text-danger" role="alert">
            {error}
          </p>
        ) : null}
        {success ? (
          <output className="mt-4 block text-sm text-success-text">
            Contraseña actualizada correctamente.
          </output>
        ) : null}
        <button
          type="submit"
          disabled={submitting}
          className={`${buttonClassName('primary', 'mt-6')} gap-2`}
        >
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              Guardando…
            </>
          ) : (
            'Guardar contraseña'
          )}
        </button>
      </form>
    </Card>
  )
}

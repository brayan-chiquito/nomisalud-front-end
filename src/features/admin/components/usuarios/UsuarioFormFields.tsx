import { inputClassName, labelClassName } from '@/components/ui/buttonStyles'
import { USUARIO_ADMIN_ROLES } from '../../utils/usuarioAdminDisplay'
import type { UsuarioAdminRole } from '../../types/usuarioAdmin'
import type { UsuarioFormExtraValues } from '../../utils/usuarioFormPayload'

export type UsuarioFormCoreValues = Readonly<{
  email: string
  role: UsuarioAdminRole
  nombre_completo: string
  activo: boolean
}>

export type UsuarioFormFieldsProps = Readonly<{
  core: UsuarioFormCoreValues
  extra: UsuarioFormExtraValues
  onCoreChange: (patch: Partial<UsuarioFormCoreValues>) => void
  onExtraChange: (patch: Partial<UsuarioFormExtraValues>) => void
  showPassword?: boolean
  password?: string
  onPasswordChange?: (v: string) => void
  emailDisabled?: boolean
}>

export function UsuarioFormFields({
  core,
  extra,
  onCoreChange,
  onExtraChange,
  showPassword = false,
  password = '',
  onPasswordChange,
  emailDisabled = false,
}: UsuarioFormFieldsProps) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <label htmlFor="usuario-email" className={labelClassName}>
          Correo electrónico
        </label>
        <input
          id="usuario-email"
          type="email"
          required
          autoComplete="off"
          disabled={emailDisabled}
          value={core.email}
          onChange={(e) => onCoreChange({ email: e.target.value })}
          className={inputClassName}
        />
      </div>

      {showPassword && onPasswordChange ? (
        <div>
          <label htmlFor="usuario-password" className={labelClassName}>
            Contraseña
          </label>
          <input
            id="usuario-password"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
            className={inputClassName}
          />
          <p className="mt-1 text-xs text-gray-400">Mínimo 8 caracteres.</p>
        </div>
      ) : null}

      <div>
        <label htmlFor="usuario-role" className={labelClassName}>
          Rol
        </label>
        <select
          id="usuario-role"
          required
          value={core.role}
          onChange={(e) => onCoreChange({ role: e.target.value as UsuarioAdminRole })}
          className={inputClassName}
        >
          {USUARIO_ADMIN_ROLES.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="usuario-nombre" className={labelClassName}>
          Nombre completo
        </label>
        <input
          id="usuario-nombre"
          type="text"
          value={core.nombre_completo}
          onChange={(e) => onCoreChange({ nombre_completo: e.target.value })}
          className={inputClassName}
        />
      </div>

      <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-700">
        <input
          type="checkbox"
          checked={core.activo}
          onChange={(e) => onCoreChange({ activo: e.target.checked })}
          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary/30"
        />
        <span>Usuario activo</span>
      </label>

      <fieldset className="rounded-lg border border-gray-100 px-4 py-3">
        <legend className="px-1 text-xs font-medium tracking-wide text-gray-500 uppercase">
          Datos adicionales (opcional)
        </legend>
        <div className="mt-2 grid gap-3 sm:grid-cols-2">
          <div>
            <label htmlFor="usuario-tipo-doc" className={labelClassName}>
              Tipo documento
            </label>
            <input
              id="usuario-tipo-doc"
              type="text"
              value={extra.tipo_documento}
              onChange={(e) => onExtraChange({ tipo_documento: e.target.value })}
              className={inputClassName}
            />
          </div>
          <div>
            <label htmlFor="usuario-num-doc" className={labelClassName}>
              Número documento
            </label>
            <input
              id="usuario-num-doc"
              type="text"
              value={extra.numero_documento}
              onChange={(e) => onExtraChange({ numero_documento: e.target.value })}
              className={inputClassName}
            />
          </div>
          <div>
            <label htmlFor="usuario-area" className={labelClassName}>
              Área
            </label>
            <input
              id="usuario-area"
              type="text"
              value={extra.area}
              onChange={(e) => onExtraChange({ area: e.target.value })}
              className={inputClassName}
            />
          </div>
          <div>
            <label htmlFor="usuario-cargo" className={labelClassName}>
              Cargo
            </label>
            <input
              id="usuario-cargo"
              type="text"
              value={extra.cargo}
              onChange={(e) => onExtraChange({ cargo: e.target.value })}
              className={inputClassName}
            />
          </div>
          <div>
            <label htmlFor="usuario-eps" className={labelClassName}>
              EPS
            </label>
            <input
              id="usuario-eps"
              type="text"
              value={extra.eps_afiliacion}
              onChange={(e) => onExtraChange({ eps_afiliacion: e.target.value })}
              className={inputClassName}
            />
          </div>
          <div>
            <label htmlFor="usuario-arl" className={labelClassName}>
              ARL
            </label>
            <input
              id="usuario-arl"
              type="text"
              value={extra.arl_afiliacion}
              onChange={(e) => onExtraChange({ arl_afiliacion: e.target.value })}
              className={inputClassName}
            />
          </div>
        </div>
      </fieldset>
    </div>
  )
}

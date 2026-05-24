import { inputClassName, labelClassName } from '@/components/ui/buttonStyles'
import { TIPO_INCAPACIDAD_OPTIONS, UNIDAD_LIMITE_OPTIONS } from '../../utils/plazoEntidadDisplay'
import type { PlazoEntidadFormValues } from '../../utils/plazoEntidadFormPayload'

export type PlazoEntidadFormFieldsProps = Readonly<{
  values: PlazoEntidadFormValues
  onChange: (patch: Partial<PlazoEntidadFormValues>) => void
  idPrefix?: string
}>

export function PlazoEntidadFormFields({
  values,
  onChange,
  idPrefix = 'plazo',
}: PlazoEntidadFormFieldsProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label className={labelClassName} htmlFor={`${idPrefix}-entidad`}>
          Entidad <span className="text-danger">*</span>
        </label>
        <input
          id={`${idPrefix}-entidad`}
          type="text"
          className={inputClassName}
          value={values.entidad_nombre}
          onChange={(e) => onChange({ entidad_nombre: e.target.value })}
          placeholder="Ej. Salud Total EPS"
          autoComplete="organization"
          required
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className={labelClassName} htmlFor={`${idPrefix}-tipo`}>
          Tipo de incapacidad <span className="text-danger">*</span>
        </label>
        <select
          id={`${idPrefix}-tipo`}
          className={inputClassName}
          value={values.tipo_incapacidad}
          onChange={(e) => onChange({ tipo_incapacidad: e.target.value })}
          required
        >
          {TIPO_INCAPACIDAD_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label className={labelClassName} htmlFor={`${idPrefix}-valor`}>
            Plazo límite <span className="text-danger">*</span>
          </label>
          <input
            id={`${idPrefix}-valor`}
            type="number"
            min={1}
            step={1}
            className={inputClassName}
            value={values.valor_limite}
            onChange={(e) => onChange({ valor_limite: e.target.value })}
            required
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className={labelClassName} htmlFor={`${idPrefix}-unidad`}>
            Unidad <span className="text-danger">*</span>
          </label>
          <select
            id={`${idPrefix}-unidad`}
            className={inputClassName}
            value={values.unidad_limite}
            onChange={(e) => onChange({ unidad_limite: e.target.value })}
            required
          >
            {UNIDAD_LIMITE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label className={labelClassName} htmlFor={`${idPrefix}-alerta`}>
            Días de alerta <span className="text-danger">*</span>
          </label>
          <input
            id={`${idPrefix}-alerta`}
            type="number"
            min={1}
            step={1}
            className={inputClassName}
            value={values.dias_alerta}
            onChange={(e) => onChange({ dias_alerta: e.target.value })}
            required
          />
          <p className="text-xs text-gray-500">Anticipación antes del vencimiento del plazo.</p>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className={labelClassName} htmlFor={`${idPrefix}-pago`}>
            Días promedio de pago
          </label>
          <input
            id={`${idPrefix}-pago`}
            type="number"
            min={1}
            step={1}
            className={inputClassName}
            value={values.dias_promedio_pago}
            onChange={(e) => onChange({ dias_promedio_pago: e.target.value })}
            placeholder="Opcional"
          />
          <p className="text-xs text-gray-500">
            Tras estado cobrada; vacío usa el valor por defecto del sistema.
          </p>
        </div>
      </div>
    </div>
  )
}

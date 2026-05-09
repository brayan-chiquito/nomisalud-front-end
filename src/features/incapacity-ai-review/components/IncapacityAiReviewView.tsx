import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowLeft,
  Timer,
  Minus,
  Plus,
  ChevronDown,
  CircleCheck,
  CircleAlert,
  Cpu,
  Calculator,
} from 'lucide-react'
import { RejectIncapacityModal } from './RejectIncapacityModal'

/**
 * Revisión de datos extraídos por IA (visor documento + formulario editable).
 * Integración futura: GET por radicado, PUT/PATCH de confirmación, visor PDF y zoom.
 */
export function IncapacityAiReviewView() {
  const [rejectModalOpen, setRejectModalOpen] = useState(false)

  return (
    <div className="flex min-h-screen flex-col bg-slate-100">
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-6">
        <div className="flex items-center gap-4">
          <Link
            to="/portal/mi-tramite"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
            aria-label="Volver"
          >
            <ArrowLeft className="h-[18px] w-[18px]" />
          </Link>
          {/* Título de radicado dinámico según flujo (historial vs. cola) */}
          <div className="flex flex-col gap-0.5">
            <span className="text-base font-bold text-slate-800">INC-2024-001</span>
            <span className="text-xs text-slate-400">Revisión de documento de incapacidad</span>
          </div>
          <span className="ml-2 inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3.5 py-1.5 text-[13px] font-medium text-amber-700">
            <Timer className="h-3.5 w-3.5" aria-hidden />
            En verificación
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-500">Ana García</span>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-[13px] font-semibold text-white">
            AG
          </div>
        </div>
      </header>

      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        {/* Panel izquierdo: documento */}
        <aside className="flex min-h-[320px] flex-1 flex-col gap-3 bg-slate-50 p-5 lg:max-w-[50%]">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-800">Documento adjunto</span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                className="flex h-[30px] w-[30px] items-center justify-center rounded-md border border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
                aria-label="Alejar"
              >
                <Minus className="h-3.5 w-3.5" />
              </button>
              <span className="rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-700">
                100%
              </span>
              <button
                type="button"
                className="flex h-[30px] w-[30px] items-center justify-center rounded-md border border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
                aria-label="Acercar"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
              {/* Zoom: aplicar transform scale al contenedor del documento */}
            </div>
          </div>
          <div className="flex flex-1 items-center justify-center overflow-hidden rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
            <article
              className="flex w-[290px] flex-col gap-2 rounded border border-slate-100 bg-white p-7 shadow-md"
              style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.09)' }}
            >
              <p className="text-center text-[9px] font-bold uppercase tracking-wide text-slate-800">
                Certificado de incapacidad
              </p>
              <p className="text-center text-[8px] text-slate-500">IPS San Juan de Dios - Bogotá</p>
              <div className="my-1 h-px w-full bg-slate-200" />
              <p className="text-[8px] text-slate-700">Paciente: Carlos Pérez Rodríguez</p>
              <p className="text-[8px] text-slate-700">Cédula: 1.234.567.890</p>
              <p className="text-[8px] text-slate-700">Diagnóstico: J069 - Infección resp. aguda</p>
              <p className="text-[8px] text-slate-700">Días incapacidad: 7 días</p>
              <p className="text-[8px] text-slate-700">Inicio: 15/03/2025 • Fin: 22/03/2025</p>
              <p className="text-[8px] text-slate-700">Entidad: EPS Sura</p>
              <div className="my-1 h-px w-full bg-slate-200" />
              <p className="text-center text-[8px] text-slate-400">Dr. ________________________</p>
              <p className="text-center text-[7px] text-slate-400">
                Firma y sello del médico tratante
              </p>
            </article>
            {/* Sustituir mock por visor del archivo desde URL o blob */}
          </div>
        </aside>

        {/* Panel derecho: campos IA */}
        <section className="flex min-h-0 flex-1 flex-col gap-4 border-l border-slate-200 bg-white p-6 lg:max-w-[50%]">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-[15px] font-bold text-slate-800">Datos extraídos por IA</h2>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
              <Cpu className="h-3.5 w-3.5" aria-hidden />
              Confianza: 85%
            </span>
            {/* Confianza por campo o global desde respuesta de API */}
          </div>

          <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto pr-1">
            <ReadonlyFieldRow
              label="Nombre colaborador"
              value="Carlos Pérez Rodríguez"
              status="ok"
            />
            <ReadonlyFieldRow label="Número de identificación" value="1.234.567.890" status="ok" />
            <WarningSelectRow
              label="Tipo de incapacidad"
              value="Enfermedad general"
              hint="Requiere verificación manual del tipo"
            />
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <ReadonlyFieldRow label="Fecha de inicio" value="15/03/2025" status="ok" />
              <ReadonlyFieldRow label="Fecha de fin" value="22/03/2025" status="ok" />
            </div>
            <ComputedDaysRow />
            <WarningTextRow
              label="Diagnóstico (CIE-10)"
              value="J069 - Infección resp. aguda"
              hint="Verificar código diagnóstico CIE-10"
            />
            <ReadonlyFieldRow label="Entidad EPS/ARL" value="EPS Sura" status="ok" isSelect />
          </div>
        </section>
      </div>

      <footer className="flex h-[68px] shrink-0 items-center justify-between border-t border-slate-200 bg-white px-6">
        <p className="text-[13px] text-slate-500">
          Revisa todos los campos antes de confirmar. 2 campos requieren atención.
        </p>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setRejectModalOpen(true)}
            className="rounded-lg border border-red-600 bg-white px-[22px] py-[11px] text-sm font-medium text-red-600 hover:bg-red-50"
          >
            Rechazar con motivo
          </button>
          <button
            type="button"
            className="rounded-lg bg-blue-600 px-[22px] py-[11px] text-sm font-medium text-white hover:bg-blue-700"
          >
            Confirmar datos
          </button>
          {/* Confirmar: PUT/PATCH según API; deshabilitar si hay errores de validación */}
        </div>
      </footer>

      <RejectIncapacityModal isOpen={rejectModalOpen} onClose={() => setRejectModalOpen(false)} />
    </div>
  )
}

type ReadonlyFieldRowProps = Readonly<{
  label: string
  value: string
  status: 'ok'
  isSelect?: boolean
}>

function ReadonlyFieldRow({ label, value, status: _status, isSelect }: ReadonlyFieldRowProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs font-medium text-slate-700">{label}</span>
      <div className="flex h-[42px] items-center justify-between gap-2 rounded-lg border border-slate-300 bg-gray-50 px-3">
        <span className="truncate text-[13px] text-slate-800">{value}</span>
        <div className="flex shrink-0 items-center gap-1">
          {isSelect && <ChevronDown className="h-3.5 w-3.5 text-slate-400" aria-hidden />}
          <CircleCheck className="h-4 w-4 text-emerald-500" aria-hidden />
        </div>
      </div>
      {/* Campos editables cuando el flujo lo permita */}
    </div>
  )
}

type WarningSelectRowProps = Readonly<{ label: string; value: string; hint: string }>

function WarningSelectRow({ label, value, hint }: WarningSelectRowProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs font-medium text-slate-700">{label}</span>
      <div className="flex h-[42px] items-center justify-between gap-2 rounded-lg border border-amber-500 bg-amber-50 px-3">
        <span className="truncate text-[13px] text-slate-800">{value}</span>
        <div className="flex shrink-0 items-center gap-1">
          <ChevronDown className="h-3.5 w-3.5 text-slate-400" aria-hidden />
          <CircleAlert className="h-4 w-4 text-amber-500" aria-hidden />
        </div>
      </div>
      <p className="text-[11px] text-amber-700">{hint}</p>
    </div>
  )
}

type WarningTextRowProps = Readonly<{ label: string; value: string; hint: string }>

function WarningTextRow({ label, value, hint }: WarningTextRowProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs font-medium text-slate-700">{label}</span>
      <div className="flex h-[42px] items-center justify-between gap-2 rounded-lg border border-amber-500 bg-amber-50 px-3">
        <span className="truncate text-[13px] text-slate-800">{value}</span>
        <CircleAlert className="h-4 w-4 shrink-0 text-amber-500" aria-hidden />
      </div>
      <p className="text-[11px] text-amber-700">{hint}</p>
    </div>
  )
}

function ComputedDaysRow() {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs font-medium text-slate-700">
        Días de incapacidad (calculado automático)
      </span>
      <div className="flex h-[42px] items-center justify-between gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3">
        <span className="text-[13px] font-semibold text-blue-600">7 días</span>
        <Calculator className="h-4 w-4 text-blue-600" aria-hidden />
      </div>
      {/* Días: valor calculado en cliente o devuelto por backend */}
    </div>
  )
}

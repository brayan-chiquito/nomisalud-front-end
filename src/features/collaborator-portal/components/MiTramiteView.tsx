import { Link } from 'react-router-dom'
import {
  AlertCircle,
  Timer,
  CheckCircle2,
  Circle,
  RefreshCw,
  FileText,
  CirclePlus,
} from 'lucide-react'
import { CollaboratorHeader } from './CollaboratorHeader'

/**
 * Vista "Mi trámite" — incapacidad activa, alerta de documentación, línea de tiempo.
 * TODO: cargar trámite activo desde API (GET /tramites/activo o similar).
 * TODO: acción "Cargar documentos" → flujo de carga / modal / ruta.
 * TODO: "Ver documento adjunto" → abrir PDF o URL firmada.
 */
export function MiTramiteView() {
  return (
    <div className="flex min-h-screen flex-col bg-blue-50">
      <CollaboratorHeader
        userName="Carlos Pérez"
        companyName="Almacenes Éxito S.A."
        avatarInitials="CP"
      />

      {/* TODO: ocultar banner si `tramite.documentacionCompleta` (API) */}
      <div className="flex items-start gap-3 border-b border-amber-300 bg-amber-50 px-6 py-3.5">
        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" aria-hidden />
        <div className="min-w-0 flex-1 space-y-1">
          <p className="text-[13px] font-semibold text-amber-900">
            Documentación pendiente — Requiere atención antes de continuar
          </p>
          <p className="text-xs text-slate-500">
            • Fórmula médica del tratante • Historia clínica del paciente
          </p>
          <p className="text-xs font-medium text-amber-700">
            Plazo máximo: 3 días hábiles — Vence el 18/04/2025
          </p>
        </div>
        <button
          type="button"
          className="shrink-0 rounded-lg border border-amber-600 bg-white px-4 py-2 text-[13px] font-semibold text-amber-700 hover:bg-amber-50"
        >
          Cargar documentos
        </button>
        {/* TODO: onClick → ruta o modal de carga (multipart) */}
      </div>

      <main className="flex flex-1 flex-col items-center gap-5 p-6">
        <h1 className="w-full max-w-[680px] text-xl font-bold text-slate-800">
          Mi incapacidad activa
        </h1>

        <section
          className="w-full max-w-[680px] overflow-hidden rounded-2xl bg-white shadow-md"
          style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}
        >
          <div className="flex items-start justify-between gap-4 p-6">
            <div>
              <p className="text-[17px] font-bold text-slate-800">INC-2024-001</p>
              <p className="text-xs text-slate-400">Incapacidad activa</p>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3.5 py-1.5 text-[13px] font-semibold text-amber-700">
              <Timer className="h-3.5 w-3.5" aria-hidden />
              En verificación
            </span>
          </div>
          <div className="h-px w-full bg-slate-100" />
          <div className="grid grid-cols-1 gap-6 px-6 py-5 sm:grid-cols-2">
            <div className="space-y-1">
              <p className="text-[11px] text-slate-400">Tipo de incapacidad</p>
              <p className="text-sm font-bold text-slate-800">Enfermedad General</p>
            </div>
            <div className="space-y-1">
              <p className="text-[11px] text-slate-400">Entidad</p>
              <p className="text-sm font-bold text-slate-800">EPS Sanitas</p>
            </div>
            <div className="space-y-1">
              <p className="text-[11px] text-slate-400">Días de incapacidad</p>
              <p className="text-sm font-bold text-blue-600">15 días</p>
            </div>
            <div className="space-y-1">
              <p className="text-[11px] text-slate-400">Fecha de carga</p>
              <p className="text-sm font-bold text-slate-800">10/04/2025</p>
            </div>
          </div>
          <div className="flex justify-end px-5 pb-5">
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-4 py-2 text-[13px] font-medium text-blue-600 hover:bg-blue-100"
            >
              <FileText className="h-3.5 w-3.5" aria-hidden />
              Ver documento adjunto
            </button>
          </div>
        </section>

        <section
          className="w-full max-w-[680px] space-y-4 rounded-2xl bg-white p-6 shadow-md"
          style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}
        >
          <h2 className="text-[15px] font-bold text-slate-800">Estado del trámite</h2>

          <div className="flex gap-3.5 border-b border-slate-100 pb-4">
            <CheckCircle2 className="h-7 w-7 shrink-0 text-emerald-500" aria-hidden />
            <div className="space-y-0.5">
              <p className="text-sm font-semibold text-emerald-600">Recibida</p>
              <p className="text-xs text-slate-400">10/04/2025 · 09:30 hrs</p>
            </div>
          </div>

          <div className="flex gap-3.5 border-b border-slate-100 pb-4">
            <CheckCircle2 className="h-7 w-7 shrink-0 text-emerald-500" aria-hidden />
            <div className="space-y-0.5">
              <p className="text-sm font-semibold text-emerald-600">Procesando IA</p>
              <p className="text-xs text-slate-400">10/04/2025 · 09:35 hrs</p>
            </div>
          </div>

          <div className="flex gap-3.5 rounded-lg bg-sky-50 px-1 py-1 pb-4">
            <RefreshCw className="h-7 w-7 shrink-0 text-blue-600" aria-hidden />
            <div className="space-y-0.5">
              <p className="text-sm font-bold text-blue-600">En Verificación</p>
              <p className="text-xs text-blue-600">● En proceso · 10/04/2025 · 10:15 hrs</p>
            </div>
          </div>

          <div className="flex gap-3.5 border-b border-slate-100 pb-4">
            <Circle className="h-7 w-7 shrink-0 text-slate-300" aria-hidden />
            <div className="space-y-0.5">
              <p className="text-sm text-slate-400">Transcrita</p>
              <p className="text-xs text-slate-300">Pendiente</p>
            </div>
          </div>

          <div className="flex gap-3.5">
            <Circle className="h-7 w-7 shrink-0 text-slate-300" aria-hidden />
            <div className="space-y-0.5">
              <p className="text-sm text-slate-400">Pagada</p>
              <p className="text-xs text-slate-300">Pendiente</p>
            </div>
          </div>
        </section>

        <Link
          to="/portal/radicar-incapacidad"
          className="flex h-12 w-full max-w-[680px] items-center justify-center gap-2.5 rounded-xl bg-blue-600 text-[15px] font-bold text-white hover:opacity-95"
          style={{ boxShadow: '0 2px 8px rgba(37,99,235,0.25)' }}
        >
          <CirclePlus className="h-[18px] w-[18px]" aria-hidden />
          Radicar nueva incapacidad
        </Link>
      </main>
    </div>
  )
}

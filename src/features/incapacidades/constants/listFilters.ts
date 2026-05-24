export const ARCHIVO_TIPO_FILTER_OPTIONS = [
  { value: '', label: 'Todos' },
  { value: 'pdf', label: 'PDF' },
  { value: 'jpg', label: 'JPG' },
  { value: 'png', label: 'PNG' },
] as const

export const incapacidadSelectFrameClassName =
  'flex cursor-pointer items-center gap-1.5 rounded-lg border border-gray-200 bg-white py-2 pl-3 pr-2 text-sm text-gray-700 shadow-sm transition-colors duration-150 hover:border-gray-300'

export const incapacidadSelectNativeClassName =
  'max-w-[160px] cursor-pointer border-0 bg-transparent text-[13px] text-gray-700 outline-none focus:ring-0'

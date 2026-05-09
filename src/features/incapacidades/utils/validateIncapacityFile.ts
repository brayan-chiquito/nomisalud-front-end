/** Límite alineado con la UI (10 MB). Ajustar si el backend define otro máximo. */
export const INCAPACITY_MAX_BYTES = 10 * 1024 * 1024

const ALLOWED_MIME = new Set(['application/pdf', 'image/jpeg', 'image/png'])

export type IncapacityValidationCode = 'SIZE' | 'TYPE'

export interface IncapacityValidationError {
  code: IncapacityValidationCode
  message: string
}

function extensionIsAllowed(fileName: string): boolean {
  const ext = fileName.split('.').pop()?.toLowerCase()
  return ext === 'pdf' || ext === 'jpg' || ext === 'jpeg' || ext === 'png'
}

/**
 * Valida tipo y tamaño antes de iniciar la subida.
 * Si el navegador no informa `type`, se usa la extensión como respaldo.
 */
export function validateIncapacityFile(file: File): IncapacityValidationError | null {
  if (file.size > INCAPACITY_MAX_BYTES) {
    return {
      code: 'SIZE',
      message: `El archivo supera el máximo de ${INCAPACITY_MAX_BYTES / (1024 * 1024)} MB.`,
    }
  }

  const extOk = extensionIsAllowed(file.name)
  const mimeOk = file.type ? ALLOWED_MIME.has(file.type) : false

  if (mimeOk) return null
  if (!file.type && extOk) return null

  return {
    code: 'TYPE',
    message: 'Formato no permitido. Usa PDF, JPG o PNG.',
  }
}

/** Valor del atributo `accept` del input file. */
export const INCAPACITY_FILE_ACCEPT = 'application/pdf,image/png,image/jpeg,.pdf,.png,.jpg,.jpeg'

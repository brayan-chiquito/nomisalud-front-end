/** Extrae nombre de archivo de `Content-Disposition` (attachment; filename="…"). */
export function filenameFromContentDisposition(header: string | null | undefined): string | null {
  if (!header) return null
  const quoted = /filename\*?=(?:UTF-8''|")?([^";\n]+)/i.exec(header)
  if (quoted?.[1]) return quoted[1].trim().replaceAll('"', '')
  return null
}

export function triggerBrowserDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.rel = 'noopener'
  document.body.append(anchor)
  anchor.click()
  anchor.remove()
  URL.revokeObjectURL(url)
}

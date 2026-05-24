export function pageSizeFromResponse(total: number, pages: number, rowCount: number): number {
  if (pages > 0 && total > 0) return Math.ceil(total / pages)
  return rowCount
}

export function paginationRange(
  total: number,
  page: number,
  pageSize: number,
): Readonly<{ start: number; end: number }> {
  if (total === 0) return { start: 0, end: 0 }
  const start = (page - 1) * pageSize + 1
  const end = Math.min(page * pageSize, total)
  return { start, end }
}

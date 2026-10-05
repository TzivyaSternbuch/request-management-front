const DATE_FORMAT: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' }

export function formatDateOnly(date: string): string {
  return new Date(`${date}T00:00`).toLocaleDateString(undefined, DATE_FORMAT)
}

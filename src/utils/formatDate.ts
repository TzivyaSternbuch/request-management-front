const DATE_FORMAT: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' }

// For a yyyy-MM-dd value. Without a time it would be read as UTC midnight, which can show the day before.
export function formatDateOnly(date: string): string {
  return new Date(`${date}T00:00`).toLocaleDateString(undefined, DATE_FORMAT)
}

// For a full timestamp from the server, shown as its local date.
export function formatDate(timestamp: string): string {
  return new Date(timestamp).toLocaleDateString(undefined, DATE_FORMAT)
}

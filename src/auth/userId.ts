// The server reads X-User-Id into an int, so larger values would be rejected.
const MAX_USER_ID = 2_147_483_647

export function isValidUserId(value: unknown): value is number {
  return typeof value === 'number' && Number.isInteger(value) && value > 0
}

// Returns null for an empty, fractional, non-positive or too large id.
export function parseUserId(text: string): number | null {
  const userId = Number(text)
  return isValidUserId(userId) && userId <= MAX_USER_ID ? userId : null
}

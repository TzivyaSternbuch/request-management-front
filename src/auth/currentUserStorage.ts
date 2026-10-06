import type { CurrentUser } from './currentUser'
import { isValidUserId } from './userId'

const STORAGE_KEY = 'currentUser'

export function loadCurrentUser(): CurrentUser | null {
  try {
    const stored = window.sessionStorage.getItem(STORAGE_KEY)
    return stored === null ? null : toCurrentUser(JSON.parse(stored))
  } catch {
    return null
  }
}

export function saveCurrentUser(user: CurrentUser | null) {
  try {
    if (user === null) {
      window.sessionStorage.removeItem(STORAGE_KEY)
    } else {
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(user))
    }
  } catch {
  }
}

function toCurrentUser(value: unknown): CurrentUser | null {
  if (typeof value !== 'object' || value === null) {
    return null
  }
  const { userId, isAdministrator } = value as Partial<Record<keyof CurrentUser, unknown>>
  if (!isValidUserId(userId) || typeof isAdministrator !== 'boolean') {
    return null
  }
  return { userId, isAdministrator }
}

import type { CurrentUser } from '../../../auth/currentUser'
import { getJson } from '../../../api/httpClient'

const CURRENT_USER_URL = '/api/users/me'

// Fails with 401 when no user has this id.
export function getCurrentUser(userId: number): Promise<CurrentUser> {
  return getJson(CURRENT_USER_URL, userId)
}

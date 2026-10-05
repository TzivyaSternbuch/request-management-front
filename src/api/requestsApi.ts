import type { CurrentUser } from '../auth/currentUser'
import type { PagedResult } from './commonModels'
import { getJson } from './httpClient'
import type { RequestDto, SearchRequestsQuery } from './requestModels'

const REQUESTS_URL = '/api/requests'

export function searchRequests(
  query: SearchRequestsQuery,
  currentUser: CurrentUser,
  signal?: AbortSignal,
): Promise<PagedResult<RequestDto>> {
  return getJson(`${REQUESTS_URL}?${buildSearchParams(query)}`, currentUser.userId, signal)
}

function buildSearchParams(query: SearchRequestsQuery): URLSearchParams {
  const params = new URLSearchParams()

  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === '') {
      continue
    }

    const values: unknown[] = Array.isArray(value) ? value : [value]
    for (const item of values) {
      params.append(key, String(item))
    }
  }

  return params
}

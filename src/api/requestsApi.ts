import type { CurrentUser } from '../auth/currentUser'
import type { PagedResult, ProblemDetails } from './commonModels'
import type { RequestDto, SearchRequestsQuery } from './requestModels'

const REQUESTS_URL = '/api/requests'
const USER_ID_HEADER = 'X-User-Id'
const IS_ADMIN_HEADER = 'X-Is-Admin'

export class ApiError extends Error {
  status: number
  problem?: ProblemDetails

  constructor(status: number, problem?: ProblemDetails) {
    super(`Request failed with status ${status}`)
    this.name = 'ApiError'
    this.status = status
    this.problem = problem
  }
}

export async function searchRequests(
  query: SearchRequestsQuery,
  currentUser: CurrentUser,
  signal?: AbortSignal,
): Promise<PagedResult<RequestDto>> {
  const response = await fetch(`${REQUESTS_URL}?${buildSearchParams(query)}`, {
    headers: {
      [USER_ID_HEADER]: String(currentUser.userId),
      [IS_ADMIN_HEADER]: String(currentUser.isAdministrator),
    },
    signal,
  })

  if (!response.ok) {
    throw new ApiError(response.status, await readProblem(response))
  }

  return response.json()
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

// Error responses are not always JSON (e.g. a proxy error page), so a parse failure is not an error itself.
async function readProblem(response: Response): Promise<ProblemDetails | undefined> {
  try {
    return await response.json()
  } catch {
    return undefined
  }
}

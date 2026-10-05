import { ApiError } from './apiError'
import type { ProblemDetails } from './commonModels'

const USER_ID_HEADER = 'X-User-Id'

export async function getJson<T>(url: string, userId: number, signal?: AbortSignal): Promise<T> {
  const response = await fetch(url, {
    headers: { [USER_ID_HEADER]: String(userId) },
    signal,
  })

  if (!response.ok) {
    throw new ApiError(response.status, await readProblem(response))
  }

  return response.json()
}

// Error responses are not always JSON (e.g. a proxy error page), so a parse failure is not an error itself.
async function readProblem(response: Response): Promise<ProblemDetails | undefined> {
  try {
    return await response.json()
  } catch {
    return undefined
  }
}

import { renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { PagedResult } from '../../../api/commonModels'
import type { RequestDto, SearchRequestsQuery } from '../api/requestModels'
import { ApiError } from '../../../api/apiError'
import { searchRequests } from '../api/requestsApi'
import type { CurrentUser } from '../../../auth/currentUser'
import { createQueryClientWrapper } from '../../../test/createQueryClientWrapper'
import { createRequest } from '../../../test/createRequest'
import { useRequestSearch } from './useRequestSearch'

vi.mock(import('../api/requestsApi'), () => ({
  searchRequests: vi.fn(),
}))

const CURRENT_USER: CurrentUser = { userId: 1, isAdministrator: false }

const RESULT: PagedResult<RequestDto> = { items: [createRequest(1)], totalCount: 1, page: 1, pageSize: 20 }

function renderSearch(query: SearchRequestsQuery) {
  return renderHook(() => useRequestSearch(query, CURRENT_USER), { wrapper: createQueryClientWrapper() })
}

describe('useRequestSearch', () => {
  beforeEach(() => {
    vi.mocked(searchRequests).mockReset()
  })

  it('is loading first, then returns the data', async () => {
    vi.mocked(searchRequests).mockResolvedValue(RESULT)

    const { result } = renderSearch({ page: 1 })

    expect(result.current).toEqual({ data: null, error: null, isLoading: true, isRefreshing: false })
    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current).toEqual({ data: RESULT, error: null, isLoading: false, isRefreshing: false })
    expect(searchRequests).toHaveBeenCalledWith({ page: 1 }, CURRENT_USER, expect.any(AbortSignal))
  })

  it('returns the server message when the search fails', async () => {
    vi.mocked(searchRequests).mockRejectedValue(new ApiError(400, { title: 'Bad request', detail: 'Invalid page.' }))

    const { result } = renderSearch({ page: 1 })

    await waitFor(() => expect(result.current.error).toBe('Invalid page.'))
    expect(result.current.data).toBeNull()
  })

  it('returns a general message for an unexpected error', async () => {
    vi.mocked(searchRequests).mockRejectedValue(new TypeError('Failed to fetch'))

    const { result } = renderSearch({ page: 1 })

    await waitFor(() => expect(result.current.error).toBe('Something went wrong'))
  })
})

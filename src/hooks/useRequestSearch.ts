import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { ApiError } from '../api/apiError'
import { searchRequests } from '../api/requestsApi'
import type { PagedResult } from '../api/commonModels'
import type { RequestDto, SearchRequestsQuery } from '../api/requestModels'
import type { CurrentUser } from '../auth/currentUser'

const FALLBACK_ERROR_MESSAGE = 'Something went wrong'

interface RequestSearchState {
  data: PagedResult<RequestDto> | null
  error: string | null
  isLoading: boolean
  isRefreshing: boolean
}

export function useRequestSearch(query: SearchRequestsQuery, currentUser: CurrentUser): RequestSearchState {
  const { data, error, isPending, isFetching } = useQuery({
    // Results are cached per query and user, so the user is part of the key.
    queryKey: ['requests', query, currentUser],
    queryFn: ({ signal }) => searchRequests(query, currentUser, signal),
    // While the next page loads, keep showing the current one instead of the loading state.
    placeholderData: keepPreviousData,
  })

  return {
    data: data ?? null,
    error: error === null ? null : toErrorMessage(error),
    isLoading: isPending,
    // Fetching while results are already shown: a new search or page, not the first load.
    isRefreshing: isFetching && !isPending,
  }
}

function toErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    return error.problem?.detail ?? error.problem?.title ?? FALLBACK_ERROR_MESSAGE
  }
  return FALLBACK_ERROR_MESSAGE
}

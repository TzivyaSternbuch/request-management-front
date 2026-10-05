import { useState } from 'react'
import { nextSorts } from '../../../sorting/nextSorts'
import type { RequestSortField, SearchRequestsQuery } from '../api/requestModels'
import type { RequestSearchFilters, RequestSort } from '../models/requestSearchModels'

const FIRST_PAGE = 1

const DEFAULT_SORTS: RequestSort[] = [{ field: 'CreatedAt', direction: 'Desc' }]

interface RequestQueryState {
  query: SearchRequestsQuery
  // The chosen sorts, or the default ones while none is chosen.
  sorts: RequestSort[]
  search: (filters: RequestSearchFilters) => void
  changeSort: (field: RequestSortField) => void
  goToPage: (page: number) => void
}

export function useRequestQuery(): RequestQueryState {
  const [filters, setFilters] = useState<RequestSearchFilters>({})
  const [chosenSorts, setChosenSorts] = useState<RequestSort[]>([])
  const [page, setPage] = useState(FIRST_PAGE)
  const sorts = chosenSorts.length > 0 ? chosenSorts : DEFAULT_SORTS

  // New filters or a new order give a new result set, so start again from its first page.
  function search(newFilters: RequestSearchFilters) {
    setFilters(newFilters)
    setPage(FIRST_PAGE)
  }

  function changeSort(field: RequestSortField) {
    setChosenSorts(nextSorts(chosenSorts, field))
    setPage(FIRST_PAGE)
  }

  const query: SearchRequestsQuery = {
    ...filters,
    sortBy: sorts.map((sort) => sort.field),
    sortDir: sorts.map((sort) => sort.direction),
    page,
  }

  return { query, sorts, search, changeSort, goToPage: setPage }
}

import { useState } from 'react'
import Paper from '@mui/material/Paper'
import type { RequestSortField } from '../api/requestModels'
import type { RequestSearchFilters, RequestSort } from '../models/requestSearchModels'
import type { CurrentUser } from '../../../auth/currentUser'
import { nextSorts } from '../../../sorting/nextSorts'
import { useRequestSearch } from '../hooks/useRequestSearch'
import RequestFilterBar from './RequestFilterBar'
import RequestsResults from './RequestsResults'

const FIRST_PAGE = 1

const DEFAULT_SORTS: RequestSort[] = [{ field: 'CreatedAt', direction: 'Desc' }]

interface RequestsPageProps {
  currentUser: CurrentUser
}

function RequestsPage({ currentUser }: RequestsPageProps) {
  const [filters, setFilters] = useState<RequestSearchFilters>({})
  const [chosenSorts, setChosenSorts] = useState<RequestSort[]>([])
  const [page, setPage] = useState(FIRST_PAGE)
  const sorts = chosenSorts.length > 0 ? chosenSorts : DEFAULT_SORTS
  const { data, error, isLoading, isRefreshing } = useRequestSearch(
    {
      ...filters,
      sortBy: sorts.map((sort) => sort.field),
      sortDir: sorts.map((sort) => sort.direction),
      page,
    },
    currentUser,
  )

  // New filters give a new result set, so start again from its first page.
  function handleSearch(newFilters: RequestSearchFilters) {
    setFilters(newFilters)
    setPage(FIRST_PAGE)
  }

  function handleSortChange(field: RequestSortField) {
    setChosenSorts(nextSorts(chosenSorts, field))
    setPage(FIRST_PAGE)
  }

  return (
    <Paper variant="outlined" sx={{ overflow: 'hidden' }}>
      <RequestFilterBar onSearch={handleSearch} totalCount={data?.totalCount ?? null} />
      <RequestsResults
        data={data}
        error={error}
        isLoading={isLoading}
        isRefreshing={isRefreshing}
        sorts={sorts}
        onSortChange={handleSortChange}
        onPageChange={setPage}
      />
    </Paper>
  )
}

export default RequestsPage

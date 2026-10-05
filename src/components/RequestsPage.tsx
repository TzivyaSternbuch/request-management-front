import { useState } from 'react'
import Paper from '@mui/material/Paper'
import type { RequestSearchFilters } from '../api/requestModels'
import type { CurrentUser } from '../auth/currentUser'
import { useRequestSearch } from '../hooks/useRequestSearch'
import RequestFilterBar from './RequestFilterBar'
import RequestsResults from './RequestsResults'

const FIRST_PAGE = 1

interface RequestsPageProps {
  currentUser: CurrentUser
}

function RequestsPage({ currentUser }: RequestsPageProps) {
  const [filters, setFilters] = useState<RequestSearchFilters>({})
  const [page, setPage] = useState(FIRST_PAGE)
  const { data, error, isLoading, isRefreshing } = useRequestSearch({ ...filters, page }, currentUser)

  // New filters give a new result set, so start again from its first page.
  function handleSearch(newFilters: RequestSearchFilters) {
    setFilters(newFilters)
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
        onPageChange={setPage}
      />
    </Paper>
  )
}

export default RequestsPage

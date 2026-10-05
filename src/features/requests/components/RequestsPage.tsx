import Paper from '@mui/material/Paper'
import type { CurrentUser } from '../../../auth/currentUser'
import { useRequestQuery } from '../hooks/useRequestQuery'
import { useRequestSearch } from '../hooks/useRequestSearch'
import RequestFilterBar from './RequestFilterBar'
import RequestsResults from './RequestsResults'

interface RequestsPageProps {
  currentUser: CurrentUser
}

function RequestsPage({ currentUser }: RequestsPageProps) {
  const { query, sorts, search, changeSort, goToPage } = useRequestQuery()
  const { data, error, isLoading, isRefreshing } = useRequestSearch(query, currentUser)

  return (
    <Paper variant="outlined" sx={{ overflow: 'hidden' }}>
      <RequestFilterBar onSearch={search} totalCount={data?.totalCount ?? null} />
      <RequestsResults
        data={data}
        error={error}
        isLoading={isLoading}
        isRefreshing={isRefreshing}
        sorts={sorts}
        onSortChange={changeSort}
        onPageChange={goToPage}
      />
    </Paper>
  )
}

export default RequestsPage

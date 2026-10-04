import { useState } from 'react'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutlineOutlined'
import InboxOutlinedIcon from '@mui/icons-material/InboxOutlined'
import CircularProgress from '@mui/material/CircularProgress'
import Paper from '@mui/material/Paper'
import TablePagination from '@mui/material/TablePagination'
import Typography from '@mui/material/Typography'
import type { CurrentUser } from '../auth/currentUser'
import { useRequestSearch } from '../hooks/useRequestSearch'
import RequestsTable from './RequestsTable'
import StateMessage from './StateMessage'

const FIRST_PAGE = 1
const STATE_ICON_SIZE = 48

interface RequestsPageProps {
  currentUser: CurrentUser
}

function RequestsPage({ currentUser }: RequestsPageProps) {
  const [page, setPage] = useState(FIRST_PAGE)
  const { data, error, isLoading } = useRequestSearch({ page }, currentUser)

  if (isLoading) {
    return (
      <StateMessage
        role="status"
        icon={<CircularProgress size={STATE_ICON_SIZE} />}
        title="Loading requests…"
        description="This will only take a moment."
      />
    )
  }

  if (error !== null) {
    return (
      <StateMessage
        role="alert"
        icon={<ErrorOutlineIcon color="error" sx={{ fontSize: STATE_ICON_SIZE }} />}
        title="Could not load requests"
        description={error}
      />
    )
  }

  if (data === null || data.items.length === 0) {
    return (
      <StateMessage
        icon={<InboxOutlinedIcon color="disabled" sx={{ fontSize: STATE_ICON_SIZE }} />}
        title="No requests found"
        description="There are no requests to show for this user."
      />
    )
  }

  return (
    <Paper variant="outlined">
      <Typography color="text.secondary" sx={{ px: 2, py: 1.5, borderBottom: 1, borderColor: 'divider' }}>
        {data.totalCount} requests
      </Typography>
      <RequestsTable requests={data.items} />
      <TablePagination
        component="div"
        count={data.totalCount}
        page={data.page - 1}
        rowsPerPage={data.pageSize}
        rowsPerPageOptions={[]}
        onPageChange={(_event, newPage) => setPage(newPage + 1)}
      />
    </Paper>
  )
}

export default RequestsPage

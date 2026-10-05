import ErrorOutlineIcon from '@mui/icons-material/ErrorOutlineOutlined'
import InboxOutlinedIcon from '@mui/icons-material/InboxOutlined'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import LinearProgress from '@mui/material/LinearProgress'
import TablePagination from '@mui/material/TablePagination'
import type { PagedResult } from '../api/commonModels'
import type { RequestDto } from '../api/requestModels'
import RequestsTable from './RequestsTable'
import StateMessage from './StateMessage'

const STATE_ICON_SIZE = 48

interface RequestsResultsProps {
  data: PagedResult<RequestDto> | null
  error: string | null
  isLoading: boolean
  isRefreshing: boolean
  onPageChange: (page: number) => void
}

function RequestsResults({ data, error, isLoading, isRefreshing, onPageChange }: RequestsResultsProps) {
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
        description="No requests match your search."
      />
    )
  }

  return (
    <Box aria-busy={isRefreshing} sx={{ position: 'relative' }}>
      {/* Laid over the top edge, so showing it does not move the table. */}
      {isRefreshing && (
        <LinearProgress aria-label="Updating results" sx={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 1 }} />
      )}
      <RequestsTable requests={data.items} />
      {/* The server counts pages from 1, MUI from 0. */}
      <TablePagination
        component="div"
        count={data.totalCount}
        page={data.page - 1}
        rowsPerPage={data.pageSize}
        rowsPerPageOptions={[]}
        onPageChange={(_event, newPage) => onPageChange(newPage + 1)}
      />
    </Box>
  )
}

export default RequestsResults

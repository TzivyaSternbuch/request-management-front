import Chip from '@mui/material/Chip'
import type { ChipProps } from '@mui/material/Chip'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import type { RequestDto, RequestStatus } from '../api/requestModels'

const STATUS_LABELS: Record<RequestStatus, string> = {
  New: 'New',
  InProgress: 'In progress',
  Completed: 'Completed',
  Cancelled: 'Cancelled',
}

const STATUS_COLORS: Record<RequestStatus, ChipProps['color']> = {
  New: 'info',
  InProgress: 'warning',
  Completed: 'success',
  Cancelled: 'default',
}

const CREATED_AT_FORMAT: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' }

interface RequestsTableProps {
  requests: RequestDto[]
}

function RequestsTable({ requests }: RequestsTableProps) {
  return (
    <TableContainer>
      {/* Cells stay on one line; on narrow screens the table scrolls sideways instead. */}
      <Table sx={{ '& th, & td': { whiteSpace: 'nowrap' } }}>
        <TableHead sx={{ '& th': { fontWeight: 600, color: 'text.secondary', bgcolor: 'grey.50' } }}>
          <TableRow>
            <TableCell>Number</TableCell>
            <TableCell>Customer</TableCell>
            <TableCell>Owner</TableCell>
            <TableCell>Assignee</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Created</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {requests.map((request) => (
            <TableRow key={request.id} hover>
              <TableCell sx={{ fontWeight: 600, color: 'primary.main' }}>{request.requestNumber}</TableCell>
              <TableCell>{request.customerId}</TableCell>
              <TableCell>{request.ownerId}</TableCell>
              <TableCell>
                {request.assignedToUserId ?? (
                  <Typography component="span" variant="body2" color="text.secondary">
                    Unassigned
                  </Typography>
                )}
              </TableCell>
              <TableCell>
                <Chip
                  size="small"
                  variant="outlined"
                  label={STATUS_LABELS[request.status]}
                  color={STATUS_COLORS[request.status]}
                />
              </TableCell>
              <TableCell>{request.requestType}</TableCell>
              <TableCell>{new Date(request.createdAt).toLocaleDateString(undefined, CREATED_AT_FORMAT)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default RequestsTable

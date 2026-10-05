import TableCell from '@mui/material/TableCell'
import TableSortLabel from '@mui/material/TableSortLabel'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import type { RequestSort, RequestSortField, SortDirection } from '../features/requests/api/requestModels'

// MUI writes directions in lower case; the server uses Asc / Desc.
const MUI_DIRECTIONS: Record<SortDirection, 'asc' | 'desc'> = {
  Asc: 'asc',
  Desc: 'desc',
}

const SORT_HINT = 'Click to sort ascending, again for descending, a third time to stop sorting by this column'

interface SortableHeaderCellProps {
  label: string
  field: RequestSortField
  sorts: RequestSort[]
  onSortChange: (field: RequestSortField) => void
}

function SortableHeaderCell({ label, field, sorts, onSortChange }: SortableHeaderCellProps) {
  const index = sorts.findIndex((sort) => sort.field === field)
  const sort = sorts[index]
  const direction = sort === undefined ? 'asc' : MUI_DIRECTIONS[sort.direction]
  const isPrimary = index === 0
  const showPriority = sort !== undefined && sorts.length > 1

  return (
    <TableCell sortDirection={isPrimary ? direction : false}>
      <Tooltip title={SORT_HINT} describeChild>
        <TableSortLabel active={sort !== undefined} direction={direction} onClick={() => onSortChange(field)}>
          {label}
        </TableSortLabel>
      </Tooltip>
      {showPriority && (
        <Typography component="span" variant="caption" color="text.secondary">
          {index + 1}
        </Typography>
      )}
    </TableCell>
  )
}

export default SortableHeaderCell

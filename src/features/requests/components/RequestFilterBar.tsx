import SearchIcon from '@mui/icons-material/Search'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import InputAdornment from '@mui/material/InputAdornment'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import type { RequestSearchFilters } from '../api/requestModels'
import { useRequestSearchForm } from '../hooks/useRequestSearchForm'
import ActiveFilterChips from './ActiveFilterChips'
import DateRangeButton from './DateRangeButton'
import FilterMenuButton from '../../../components/FilterMenuButton'
import { STATUS_LABELS, STATUS_OPTIONS, TYPE_LABELS, TYPE_OPTIONS } from '../logic/requestLabels'

const SEARCH_FIELD_WIDTH = 240

interface RequestFilterBarProps {
  onSearch: (filters: RequestSearchFilters) => void
  totalCount: number | null
}

function RequestFilterBar({ onSearch, totalCount }: RequestFilterBarProps) {
  const { values, appliedValues, errors, hasFilters, setField, commitDate, reset } = useRequestSearchForm(onSearch)

  return (
    <Box role="search" aria-label="Search requests" sx={{ px: 2, py: 1.5, borderBottom: 1, borderColor: 'divider' }}>
      <Stack direction="row" useFlexGap sx={{ flexWrap: 'wrap', gap: 1, alignItems: 'center' }}>
        <TextField
          size="small"
          placeholder="Search by number"
          value={values.requestNumber}
          onChange={(event) => setField('requestNumber', event.target.value)}
          error={errors.requestNumber !== undefined}
          helperText={errors.requestNumber}
          sx={{ width: SEARCH_FIELD_WIDTH }}
          slotProps={{
            htmlInput: { 'aria-label': 'Request number' },
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            },
          }}
        />
        <FilterMenuButton
          label="Status"
          options={STATUS_OPTIONS}
          labels={STATUS_LABELS}
          value={values.status}
          onChange={(status) => setField('status', status)}
        />
        <FilterMenuButton
          label="Type"
          options={TYPE_OPTIONS}
          labels={TYPE_LABELS}
          value={values.type}
          onChange={(type) => setField('type', type)}
        />
        <DateRangeButton
          values={values}
          appliedValues={appliedValues}
          errors={errors}
          onChange={setField}
          onCommit={commitDate}
        />
        {hasFilters && <Button onClick={reset}>Clear filters</Button>}
        {totalCount !== null && (
          <Typography variant="body2" color="text.secondary" sx={{ ml: 'auto' }}>
            {totalCount} requests
          </Typography>
        )}
      </Stack>
      <ActiveFilterChips values={appliedValues} onChange={setField} />
    </Box>
  )
}

export default RequestFilterBar

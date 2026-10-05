import { useState } from 'react'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Button from '@mui/material/Button'
import Popover from '@mui/material/Popover'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import type { DateField, SearchFormValues } from '../hooks/useRequestSearchForm'
import { formatDateOnly } from './formatDateOnly'

const BUTTON_LABEL = 'Created'
const POPOVER_WIDTH = 260

type DateValues = Pick<SearchFormValues, DateField>

interface DateRangeButtonProps {
  values: DateValues
  appliedValues: DateValues
  errors: Partial<Record<DateField, string>>
  onChange: (field: DateField, date: string) => void
  onCommit: (field: DateField) => void
}

function DateRangeButton({ values, appliedValues, errors, onChange, onCommit }: DateRangeButtonProps) {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null)
  const isActive = appliedValues.createdFrom !== '' || appliedValues.createdTo !== ''

  function close() {
    onCommit('createdFrom')
    onCommit('createdTo')
    setAnchor(null)
  }

  return (
    <>
      <Button
        variant="outlined"
        color={isActive ? 'primary' : 'inherit'}
        endIcon={<ExpandMoreIcon />}
        aria-haspopup="dialog"
        aria-expanded={anchor !== null}
        onClick={(event) => setAnchor(event.currentTarget)}
        sx={isActive ? undefined : { borderColor: 'divider' }}
      >
        {toButtonLabel(appliedValues)}
      </Button>
      <Popover
        anchorEl={anchor}
        open={anchor !== null}
        onClose={close}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        slotProps={{ paper: { role: 'dialog', 'aria-label': 'Created date range' } }}
      >
        <Stack spacing={2} sx={{ p: 2, width: POPOVER_WIDTH }}>
          <TextField
            label="From"
            type="date"
            size="small"
            value={values.createdFrom}
            onChange={(event) => onChange('createdFrom', event.target.value)}
            onBlur={() => onCommit('createdFrom')}
            error={errors.createdFrom !== undefined}
            helperText={errors.createdFrom}
            // The date picker disables the days after "To".
            slotProps={{ inputLabel: { shrink: true }, htmlInput: { max: toDateLimit(values.createdTo) } }}
          />
          <TextField
            label="To"
            type="date"
            size="small"
            value={values.createdTo}
            onChange={(event) => onChange('createdTo', event.target.value)}
            onBlur={() => onCommit('createdTo')}
            error={errors.createdTo !== undefined}
            helperText={errors.createdTo}
            // The date picker disables the days before "From".
            slotProps={{ inputLabel: { shrink: true }, htmlInput: { min: toDateLimit(values.createdFrom) } }}
          />
        </Stack>
      </Popover>
    </>
  )
}

function toButtonLabel({ createdFrom, createdTo }: DateValues): string {
  if (createdFrom !== '' && createdTo !== '') {
    return `${BUTTON_LABEL} · ${formatDateOnly(createdFrom)} – ${formatDateOnly(createdTo)}`
  }
  if (createdFrom !== '') {
    return `${BUTTON_LABEL} · from ${formatDateOnly(createdFrom)}`
  }
  if (createdTo !== '') {
    return `${BUTTON_LABEL} · until ${formatDateOnly(createdTo)}`
  }
  return BUTTON_LABEL
}

// An empty date means "no limit", so leave the attribute out.
function toDateLimit(date: string): string | undefined {
  return date === '' ? undefined : date
}

export default DateRangeButton

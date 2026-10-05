import Chip from '@mui/material/Chip'
import Stack from '@mui/material/Stack'
import type { SearchFormValues, SetSearchField } from '../hooks/useRequestSearchForm'
import { formatDateOnly } from '../../../utils/formatDateOnly'
import { STATUS_LABELS, TYPE_LABELS } from '../logic/requestLabels'

interface FilterChip {
  key: string
  label: string
  onDelete: () => void
}

interface ActiveFilterChipsProps {
  values: SearchFormValues
  onChange: SetSearchField
}

function ActiveFilterChips({ values, onChange }: ActiveFilterChipsProps) {
  const chips = buildChips(values, onChange)

  if (chips.length === 0) {
    return null
  }

  return (
    <Stack direction="row" useFlexGap sx={{ flexWrap: 'wrap', gap: 1, mt: 1.5 }}>
      {chips.map((chip) => (
        <Chip key={chip.key} size="small" label={chip.label} onDelete={chip.onDelete} />
      ))}
    </Stack>
  )
}

// One chip per active value, so each status or type can be removed on its own.
function buildChips(values: SearchFormValues, onChange: SetSearchField): FilterChip[] {
  const chips: FilterChip[] = []
  const requestNumber = values.requestNumber.trim()

  if (requestNumber !== '') {
    chips.push({ key: 'requestNumber', label: `Number: ${requestNumber}`, onDelete: () => onChange('requestNumber', '') })
  }

  for (const status of values.status) {
    chips.push({
      key: `status-${status}`,
      label: `Status: ${STATUS_LABELS[status]}`,
      onDelete: () => onChange('status', values.status.filter((x) => x !== status)),
    })
  }

  for (const type of values.type) {
    chips.push({
      key: `type-${type}`,
      label: `Type: ${TYPE_LABELS[type]}`,
      onDelete: () => onChange('type', values.type.filter((x) => x !== type)),
    })
  }

  if (values.createdFrom !== '') {
    chips.push({
      key: 'createdFrom',
      label: `From: ${formatDateOnly(values.createdFrom)}`,
      onDelete: () => onChange('createdFrom', ''),
    })
  }

  if (values.createdTo !== '') {
    chips.push({
      key: 'createdTo',
      label: `To: ${formatDateOnly(values.createdTo)}`,
      onDelete: () => onChange('createdTo', ''),
    })
  }

  return chips
}

export default ActiveFilterChips

import Chip from '@mui/material/Chip'
import Stack from '@mui/material/Stack'
import { buildFilterChips } from '../logic/buildFilterChips'
import type { SearchFormValues, SetSearchField } from '../models/requestSearchModels'

interface ActiveFilterChipsProps {
  values: SearchFormValues
  onChange: SetSearchField
}

function ActiveFilterChips({ values, onChange }: ActiveFilterChipsProps) {
  const chips = buildFilterChips(values, onChange)

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

export default ActiveFilterChips

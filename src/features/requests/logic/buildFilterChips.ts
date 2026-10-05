import { formatDateOnly } from '../../../utils/formatDateOnly'
import type { SearchFormValues, SetSearchField } from '../models/requestSearchModels'
import { STATUS_LABELS, TYPE_LABELS } from './requestLabels'

export interface FilterChip {
  key: string
  label: string
  onDelete: () => void
}

// One chip per active value, so each status or type can be removed on its own.
export function buildFilterChips(values: SearchFormValues, onChange: SetSearchField): FilterChip[] {
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

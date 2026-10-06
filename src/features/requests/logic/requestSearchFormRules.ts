import type { RequestSearchFilters, SearchFormValues } from '../models/requestSearchModels'

// Mirrors SearchRequestsQuery.RequestNumberMaxLength on the server.
export const REQUEST_NUMBER_MAX_LENGTH = 50

// While a year is being typed the browser already reports it (0002, 0020, 0202),
// so a date before this one is treated as not finished yet.
const FIRST_COMPLETE_DATE = '1000-01-01'

export function canApply(values: SearchFormValues): boolean {
  return isCompleteDate(values.createdFrom) && isCompleteDate(values.createdTo) && !isRangeReversed(values)
}

// yyyy-MM-dd strings sort the same as the dates they stand for, so comparing them as text is enough.
export function isRangeReversed(values: SearchFormValues): boolean {
  return values.createdFrom !== '' && values.createdTo !== '' && values.createdFrom > values.createdTo
}

export function hasAnyFilter(values: SearchFormValues): boolean {
  return (
    values.requestNumber.trim() !== '' ||
    values.status.length > 0 ||
    values.type.length > 0 ||
    values.createdFrom !== '' ||
    values.createdTo !== ''
  )
}

export function toFilters(values: SearchFormValues): RequestSearchFilters {
  return { ...values, requestNumber: values.requestNumber.trim() }
}

function isCompleteDate(date: string): boolean {
  return date === '' || date >= FIRST_COMPLETE_DATE
}

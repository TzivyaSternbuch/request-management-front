import { useEffect, useRef, useState } from 'react'
import type { DateField, RequestSearchFilters, SearchFormValues, SetSearchField } from '../models/requestSearchModels'

// Mirrors SearchRequestsQuery.RequestNumberMaxLength on the server.
const REQUEST_NUMBER_MAX_LENGTH = 50

// Wait until the user pauses, so typing a request number does not send a search per key press.
export const SEARCH_DELAY_MS = 400

// While a year is being typed the browser already reports it (0002, 0020, 0202),
// so a date before this one is treated as not finished yet.
const FIRST_COMPLETE_DATE = '1000-01-01'

const REQUEST_NUMBER_TOO_LONG = `Use at most ${REQUEST_NUMBER_MAX_LENGTH} characters.`
const FROM_AFTER_TO = 'Must be on or before "To".'
const TO_BEFORE_FROM = 'Must be on or after "From".'

type SearchFormErrors = Partial<Record<keyof SearchFormValues, string>>

const EMPTY_FORM_VALUES: SearchFormValues = {
  requestNumber: '',
  status: [],
  type: [],
  createdFrom: '',
  createdTo: '',
}

interface RequestSearchFormState {
  // What the fields show, including a date that is still being typed.
  values: SearchFormValues
  // The last valid values: the search, the chips and the button labels use these.
  appliedValues: SearchFormValues
  errors: SearchFormErrors
  hasFilters: boolean
  setField: SetSearchField
  commitDate: (field: DateField) => void
  reset: () => void
}

export function useRequestSearchForm(onSearch: (filters: RequestSearchFilters) => void): RequestSearchFormState {
  const [values, setValues] = useState(EMPTY_FORM_VALUES)
  const [appliedValues, setAppliedValues] = useState(EMPTY_FORM_VALUES)
  const [errors, setErrors] = useState<SearchFormErrors>({})
  const pendingSearchRef = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(pendingSearchRef.current), [])

  function setField<K extends keyof SearchFormValues>(field: K, value: SearchFormValues[K]) {
    const newValues = { ...values, [field]: value }
    let error: string | undefined

    if (newValues.requestNumber.length > REQUEST_NUMBER_MAX_LENGTH) {
      // Cut instead of refusing, so a pasted longer text keeps its first characters.
      newValues.requestNumber = newValues.requestNumber.slice(0, REQUEST_NUMBER_MAX_LENGTH)
      error = REQUEST_NUMBER_TOO_LONG
    }

    setValues(newValues)
    setErrors((current) => ({ ...current, [field]: error }))
    if (canApply(newValues)) {
      apply(newValues)
    }
  }

  // Called when the user leaves a date field: a date that cannot be applied goes back to the applied one.
  function commitDate(field: DateField) {
    if (values[field] === appliedValues[field]) {
      return
    }
    setValues((current) => ({ ...current, [field]: appliedValues[field] }))
    if (isRangeReversed(values)) {
      setErrors((current) => ({ ...current, [field]: field === 'createdFrom' ? FROM_AFTER_TO : TO_BEFORE_FROM }))
    }
  }

  function apply(newValues: SearchFormValues) {
    setAppliedValues(newValues)
    window.clearTimeout(pendingSearchRef.current)
    pendingSearchRef.current = window.setTimeout(() => onSearch(toFilters(newValues)), SEARCH_DELAY_MS)
  }

  function reset() {
    window.clearTimeout(pendingSearchRef.current)
    setValues(EMPTY_FORM_VALUES)
    setAppliedValues(EMPTY_FORM_VALUES)
    setErrors({})
    onSearch({})
  }

  return { values, appliedValues, errors, hasFilters: hasAnyFilter(values), setField, commitDate, reset }
}

function canApply(values: SearchFormValues): boolean {
  return isCompleteDate(values.createdFrom) && isCompleteDate(values.createdTo) && !isRangeReversed(values)
}

function isCompleteDate(date: string): boolean {
  return date === '' || date >= FIRST_COMPLETE_DATE
}

// yyyy-MM-dd strings sort the same as the dates they stand for, so comparing them as text is enough.
function isRangeReversed(values: SearchFormValues): boolean {
  return values.createdFrom !== '' && values.createdTo !== '' && values.createdFrom > values.createdTo
}

function hasAnyFilter(values: SearchFormValues): boolean {
  return (
    values.requestNumber.trim() !== '' ||
    values.status.length > 0 ||
    values.type.length > 0 ||
    values.createdFrom !== '' ||
    values.createdTo !== ''
  )
}

function toFilters(values: SearchFormValues): RequestSearchFilters {
  return { ...values, requestNumber: values.requestNumber.trim() }
}

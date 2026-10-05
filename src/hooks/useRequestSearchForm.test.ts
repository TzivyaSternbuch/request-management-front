import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { SEARCH_DELAY_MS, useRequestSearchForm } from './useRequestSearchForm'

const EMPTY_VALUES = { requestNumber: '', status: [], type: [], createdFrom: '', createdTo: '' }

function renderSearchForm() {
  const onSearch = vi.fn()
  const { result, unmount } = renderHook(() => useRequestSearchForm(onSearch))
  return { result, unmount, onSearch }
}

function waitForSearchDelay() {
  act(() => vi.advanceTimersByTime(SEARCH_DELAY_MS))
}

describe('useRequestSearchForm', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('starts empty and without errors', () => {
    const { result } = renderSearchForm()

    expect(result.current.values).toEqual(EMPTY_VALUES)
    expect(result.current.errors).toEqual({})
    expect(result.current.hasFilters).toBe(false)
  })

  it('has filters once any field has a value', () => {
    const { result } = renderSearchForm()

    act(() => result.current.setField('createdTo', '2026-01-01'))

    expect(result.current.hasFilters).toBe(true)
  })

  it('does not count a request number of only spaces as a filter', () => {
    const { result } = renderSearchForm()

    act(() => result.current.setField('requestNumber', '   '))

    expect(result.current.hasFilters).toBe(false)
  })

  it('accepts a request number of exactly 50 characters', () => {
    const { result } = renderSearchForm()

    act(() => result.current.setField('requestNumber', 'x'.repeat(50)))

    expect(result.current.values.requestNumber).toBe('x'.repeat(50))
    expect(result.current.errors).toEqual({})
  })

  it('refuses a 51st character of the request number and explains why', () => {
    const { result } = renderSearchForm()

    act(() => result.current.setField('requestNumber', 'x'.repeat(50)))
    act(() => result.current.setField('requestNumber', `${'x'.repeat(50)}y`))

    expect(result.current.values.requestNumber).toBe('x'.repeat(50))
    expect(result.current.errors).toEqual({ requestNumber: 'Use at most 50 characters.' })
  })

  it('keeps the first 50 characters of a longer pasted request number', () => {
    const { result } = renderSearchForm()

    act(() => result.current.setField('requestNumber', `${'a'.repeat(50)}${'b'.repeat(10)}`))

    expect(result.current.values.requestNumber).toBe('a'.repeat(50))
    expect(result.current.errors).toEqual({ requestNumber: 'Use at most 50 characters.' })
  })

  it('clears the request number message once a shorter value is entered', () => {
    const { result } = renderSearchForm()

    act(() => result.current.setField('requestNumber', 'x'.repeat(51)))
    act(() => result.current.setField('requestNumber', 'x'.repeat(49)))

    expect(result.current.errors).toEqual({})
  })

  it('shows a reversed date while it is typed but does not apply it', () => {
    const { result } = renderSearchForm()

    act(() => result.current.setField('createdFrom', '2026-01-02'))
    act(() => result.current.setField('createdTo', '2026-01-01'))

    expect(result.current.values.createdTo).toBe('2026-01-01')
    expect(result.current.appliedValues.createdTo).toBe('')
    expect(result.current.errors).toEqual({})
  })

  it('puts back a created to before created from when the field is left, and explains why', () => {
    const { result } = renderSearchForm()

    act(() => result.current.setField('createdFrom', '2026-01-10'))
    act(() => result.current.setField('createdTo', '2026-01-20'))
    act(() => result.current.setField('createdTo', '2026-01-05'))
    act(() => result.current.commitDate('createdTo'))

    expect(result.current.values.createdTo).toBe('2026-01-20')
    expect(result.current.errors).toEqual({ createdTo: 'Must be on or after "From".' })
  })

  it('puts back a created from after created to when the field is left, and explains why', () => {
    const { result } = renderSearchForm()

    act(() => result.current.setField('createdTo', '2026-01-01'))
    act(() => result.current.setField('createdFrom', '2026-01-02'))
    act(() => result.current.commitDate('createdFrom'))

    expect(result.current.values.createdFrom).toBe('')
    expect(result.current.errors).toEqual({ createdFrom: 'Must be on or before "To".' })
  })

  it('does not apply a date whose year is still being typed', () => {
    const { result } = renderSearchForm()

    act(() => result.current.setField('createdFrom', '2026-02-01'))
    act(() => result.current.setField('createdTo', '0002-03-15'))

    expect(result.current.values.createdTo).toBe('0002-03-15')
    expect(result.current.appliedValues.createdTo).toBe('')
    expect(result.current.errors).toEqual({})
  })

  it('applies the date once its year is complete', () => {
    const { result } = renderSearchForm()

    act(() => result.current.setField('createdFrom', '2026-02-01'))
    act(() => result.current.setField('createdTo', '0002-03-15'))
    act(() => result.current.setField('createdTo', '2026-03-15'))

    expect(result.current.appliedValues.createdTo).toBe('2026-03-15')
  })

  it('leaves an applied date as it is when the field is left', () => {
    const { result } = renderSearchForm()

    act(() => result.current.setField('createdTo', '2026-01-20'))
    act(() => result.current.commitDate('createdTo'))

    expect(result.current.values.createdTo).toBe('2026-01-20')
    expect(result.current.errors).toEqual({})
  })

  it('clears the date message once the date is changed again', () => {
    const { result } = renderSearchForm()

    act(() => result.current.setField('createdFrom', '2026-01-02'))
    act(() => result.current.setField('createdTo', '2026-01-01'))
    act(() => result.current.commitDate('createdTo'))
    act(() => result.current.setField('createdTo', '2026-01-03'))

    expect(result.current.appliedValues.createdTo).toBe('2026-01-03')
    expect(result.current.errors).toEqual({})
  })

  it('accepts the same day for created from and created to', () => {
    const { result } = renderSearchForm()

    act(() => result.current.setField('createdFrom', '2026-01-01'))
    act(() => result.current.setField('createdTo', '2026-01-01'))

    expect(result.current.appliedValues.createdTo).toBe('2026-01-01')
    expect(result.current.errors).toEqual({})
  })

  it('searches only after the user pauses', () => {
    const { result, onSearch } = renderSearchForm()

    act(() => result.current.setField('requestNumber', 'REQ-1'))
    act(() => vi.advanceTimersByTime(SEARCH_DELAY_MS - 1))
    expect(onSearch).not.toHaveBeenCalled()

    act(() => vi.advanceTimersByTime(1))
    expect(onSearch).toHaveBeenCalledWith({ ...EMPTY_VALUES, requestNumber: 'REQ-1' })
  })

  it('searches once with the last values after several quick changes', () => {
    const { result, onSearch } = renderSearchForm()

    act(() => result.current.setField('requestNumber', '  REQ-1  '))
    act(() => result.current.setField('status', ['New', 'InProgress']))
    act(() => result.current.setField('type', ['Legal']))
    act(() => result.current.setField('createdFrom', '2026-01-01'))
    act(() => result.current.setField('createdTo', '2026-01-31'))
    waitForSearchDelay()

    expect(onSearch).toHaveBeenCalledTimes(1)
    expect(onSearch).toHaveBeenCalledWith({
      requestNumber: 'REQ-1',
      status: ['New', 'InProgress'],
      type: ['Legal'],
      createdFrom: '2026-01-01',
      createdTo: '2026-01-31',
    })
  })

  it('does not search with a reversed date range', () => {
    const { result, onSearch } = renderSearchForm()

    act(() => result.current.setField('createdFrom', '2026-01-10'))
    act(() => result.current.setField('createdTo', '2026-01-05'))
    waitForSearchDelay()

    expect(onSearch).toHaveBeenCalledTimes(1)
    expect(onSearch).toHaveBeenCalledWith({ ...EMPTY_VALUES, createdFrom: '2026-01-10' })
  })

  it('searches with the first 50 characters of a longer request number', () => {
    const { result, onSearch } = renderSearchForm()

    act(() => result.current.setField('requestNumber', 'x'.repeat(60)))
    waitForSearchDelay()

    expect(onSearch).toHaveBeenCalledWith({ ...EMPTY_VALUES, requestNumber: 'x'.repeat(50) })
  })

  it('clears the values and messages and searches with no filters right away on reset', () => {
    const { result, onSearch } = renderSearchForm()

    act(() => result.current.setField('requestNumber', 'x'.repeat(51)))
    act(() => result.current.reset())
    waitForSearchDelay()

    expect(result.current.values).toEqual(EMPTY_VALUES)
    expect(result.current.errors).toEqual({})
    expect(onSearch).toHaveBeenCalledTimes(1)
    expect(onSearch).toHaveBeenCalledWith({})
  })

  it('does not search after the form is gone', () => {
    const { result, unmount, onSearch } = renderSearchForm()

    act(() => result.current.setField('requestNumber', 'REQ-1'))
    unmount()
    vi.advanceTimersByTime(SEARCH_DELAY_MS)

    expect(onSearch).not.toHaveBeenCalled()
  })
})

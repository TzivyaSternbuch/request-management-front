import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { SEARCH_DELAY_MS, useRequestSearchForm } from './useRequestSearchForm'

const EMPTY_VALUES = { requestNumber: '', status: [], type: [], createdFrom: '', createdTo: '' }

function renderSearchForm() {
  const onSearch = vi.fn()
  const { result } = renderHook(() => useRequestSearchForm(onSearch))
  return { result, onSearch }
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
})

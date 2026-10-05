import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import type { PagedResult } from '../api/commonModels'
import type { RequestDto } from '../api/requestModels'
import { createRequest } from '../test/createRequest'
import RequestsResults from './RequestsResults'

const PAGE_SIZE = 20

function createResult(totalCount: number): PagedResult<RequestDto> {
  return { items: [createRequest(1), createRequest(2)], totalCount, page: 1, pageSize: PAGE_SIZE }
}

function renderResults(props: Partial<Parameters<typeof RequestsResults>[0]> = {}) {
  const onPageChange = vi.fn()
  render(
    <RequestsResults
      data={null}
      error={null}
      isLoading={false}
      isRefreshing={false}
      onPageChange={onPageChange}
      {...props}
    />,
  )
  return { onPageChange }
}

describe('RequestsResults', () => {
  it('shows a loading message while the first results load', () => {
    renderResults({ isLoading: true })

    expect(screen.getByRole('status')).toHaveTextContent('Loading requests…')
  })

  it('shows the error message when the search fails', () => {
    renderResults({ error: 'Invalid page.' })

    expect(screen.getByRole('alert')).toHaveTextContent('Invalid page.')
  })

  it('shows an empty message when there are no requests', () => {
    renderResults({ data: { items: [], totalCount: 0, page: 1, pageSize: PAGE_SIZE } })

    expect(screen.getByText('No requests match your search.')).toBeInTheDocument()
    expect(screen.queryByRole('table')).not.toBeInTheDocument()
  })

  it('shows the requests', () => {
    renderResults({ data: createResult(2) })

    expect(screen.getByRole('cell', { name: 'REQ-1' })).toBeInTheDocument()
    expect(screen.getByRole('cell', { name: 'REQ-2' })).toBeInTheDocument()
  })

  it('keeps the requests visible with a progress bar while refreshing', () => {
    renderResults({ data: createResult(2), isRefreshing: true })

    expect(screen.getByRole('progressbar', { name: 'Updating results' })).toBeInTheDocument()
    expect(screen.getByRole('cell', { name: 'REQ-1' })).toBeInTheDocument()
    expect(screen.getByRole('table').closest('[aria-busy]')).toHaveAttribute('aria-busy', 'true')
  })

  it('shows no progress bar when not refreshing', () => {
    renderResults({ data: createResult(2) })

    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()
  })

  it('asks for the next page by its server page number', async () => {
    const { onPageChange } = renderResults({ data: createResult(PAGE_SIZE + 1) })

    await userEvent.click(screen.getByRole('button', { name: 'Go to next page' }))

    expect(onPageChange).toHaveBeenCalledWith(2)
  })
})

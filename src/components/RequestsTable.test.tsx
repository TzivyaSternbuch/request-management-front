import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import type { RequestSort } from '../api/requestModels'
import { createRequest } from '../test/createRequest'
import RequestsTable from './RequestsTable'

const NEWEST_FIRST: RequestSort[] = [{ field: 'CreatedAt', direction: 'Desc' }]

function renderTable(sorts: RequestSort[]) {
  const onSortChange = vi.fn()
  render(<RequestsTable requests={[createRequest(1)]} sorts={sorts} onSortChange={onSortChange} />)
  return { onSortChange }
}

describe('RequestsTable', () => {
  it('marks the sorted column with its direction', () => {
    renderTable(NEWEST_FIRST)

    expect(screen.getByRole('columnheader', { name: 'Created' })).toHaveAttribute('aria-sort', 'descending')
    expect(screen.getByRole('columnheader', { name: 'Number' })).not.toHaveAttribute('aria-sort')
  })

  it('marks an ascending sort', () => {
    renderTable([{ field: 'Status', direction: 'Asc' }])

    expect(screen.getByRole('columnheader', { name: 'Status' })).toHaveAttribute('aria-sort', 'ascending')
  })

  it('marks only the main column for screen readers when sorting by several', () => {
    renderTable([
      { field: 'Status', direction: 'Asc' },
      { field: 'CreatedAt', direction: 'Desc' },
    ])

    expect(screen.getByRole('columnheader', { name: /Status/ })).toHaveAttribute('aria-sort', 'ascending')
    expect(screen.getByRole('columnheader', { name: /Created/ })).not.toHaveAttribute('aria-sort')
  })

  it('numbers the sorted columns by priority when sorting by several', () => {
    renderTable([
      { field: 'Status', direction: 'Asc' },
      { field: 'CreatedAt', direction: 'Desc' },
    ])

    expect(screen.getByRole('columnheader', { name: /Status/ })).toHaveTextContent('Status1')
    expect(screen.getByRole('columnheader', { name: /Created/ })).toHaveTextContent('Created2')
  })

  it('shows no priority number when sorting by one column', () => {
    renderTable(NEWEST_FIRST)

    expect(screen.getByRole('columnheader', { name: 'Created' })).toHaveTextContent(/^Created$/)
  })

  it.each([
    ['Number', 'RequestNumber'],
    ['Status', 'Status'],
    ['Type', 'Type'],
    ['Created', 'CreatedAt'],
  ])('asks to sort by %s when its header is clicked', async (label, field) => {
    const { onSortChange } = renderTable(NEWEST_FIRST)

    await userEvent.click(screen.getByRole('button', { name: label }))

    expect(onSortChange).toHaveBeenCalledWith(field)
  })

  it.each(['Customer', 'Owner', 'Assignee'])('does not offer sorting by %s', (label) => {
    renderTable(NEWEST_FIRST)

    expect(screen.getByRole('columnheader', { name: label })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: label })).not.toBeInTheDocument()
  })
})

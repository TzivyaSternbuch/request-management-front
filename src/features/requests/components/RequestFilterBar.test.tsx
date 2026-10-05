import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import RequestFilterBar from './RequestFilterBar'

function renderFilterBar(totalCount: number | null = null) {
  const onSearch = vi.fn()
  render(<RequestFilterBar onSearch={onSearch} totalCount={totalCount} />)
  // No pause between key presses: the many characters typed here would otherwise make the tests slow.
  return { onSearch, user: userEvent.setup({ delay: null }) }
}

type User = ReturnType<typeof userEvent.setup>

async function checkOptions(user: User, buttonName: string, optionNames: string[]) {
  await user.click(screen.getByRole('button', { name: buttonName }))
  for (const optionName of optionNames) {
    await user.click(screen.getByRole('menuitemcheckbox', { name: optionName }))
  }
  await user.keyboard('{Escape}')
}

async function enterDates(user: User, dates: { from?: string; to?: string }) {
  await user.click(screen.getByRole('button', { name: /^Created/ }))
  if (dates.from !== undefined) {
    await user.type(screen.getByLabelText('From'), dates.from)
  }
  if (dates.to !== undefined) {
    await user.type(screen.getByLabelText('To'), dates.to)
  }
}

function removeChip(user: User, chipName: string) {
  const chip = screen.getByRole('button', { name: chipName })
  return user.click(within(chip).getByTestId('CancelIcon'))
}

describe('RequestFilterBar', () => {
  it('searches by itself with every filter the user entered', async () => {
    const { onSearch, user } = renderFilterBar()

    await user.type(screen.getByRole('textbox', { name: 'Request number' }), 'REQ-1')
    await checkOptions(user, 'Status', ['New', 'In progress'])
    await checkOptions(user, 'Type', ['Legal'])
    await enterDates(user, { from: '2026-01-01', to: '2026-01-31' })

    await waitFor(() =>
      expect(onSearch).toHaveBeenLastCalledWith({
        requestNumber: 'REQ-1',
        status: ['New', 'InProgress'],
        type: ['Legal'],
        createdFrom: '2026-01-01',
        createdTo: '2026-01-31',
      }),
    )
  })

  it('removes only that filter when its chip is removed', async () => {
    const { onSearch, user } = renderFilterBar()

    await checkOptions(user, 'Status', ['New', 'In progress'])
    await removeChip(user, 'Status: New')

    expect(screen.queryByRole('button', { name: 'Status: New' })).not.toBeInTheDocument()
    await waitFor(() => expect(onSearch).toHaveBeenLastCalledWith(expect.objectContaining({ status: ['InProgress'] })))
  })

  it('stops the request number at 50 characters and explains why', async () => {
    const { user } = renderFilterBar()
    const requestNumber = screen.getByRole('textbox', { name: 'Request number' })

    await user.type(requestNumber, 'x'.repeat(51))

    expect(requestNumber).toHaveValue('x'.repeat(50))
    expect(screen.getByText('Use at most 50 characters.')).toBeInTheDocument()
  })

  it('puts back a typed To before From when the field is left, and explains why', async () => {
    const { user } = renderFilterBar()

    await enterDates(user, { from: '2026-02-01', to: '2026-01-31' })
    await user.tab()

    expect(screen.getByLabelText('To')).toHaveValue('')
    expect(screen.getByText('Must be on or after "From".')).toBeInTheDocument()
  })

  it('clears every filter and searches with none on Clear filters', async () => {
    const { onSearch, user } = renderFilterBar()
    const requestNumber = screen.getByRole('textbox', { name: 'Request number' })

    await user.type(requestNumber, 'REQ-1')
    await checkOptions(user, 'Status', ['New'])
    await user.click(screen.getByRole('button', { name: 'Clear filters' }))

    expect(requestNumber).toHaveValue('')
    expect(screen.queryByRole('button', { name: 'Status: New' })).not.toBeInTheDocument()
    expect(onSearch).toHaveBeenLastCalledWith({})
  })

  it('shows the number of matching requests', () => {
    renderFilterBar(38)

    expect(screen.getByText('38 requests')).toBeInTheDocument()
  })
})

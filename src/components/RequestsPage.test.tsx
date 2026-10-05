import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { PagedResult } from '../api/commonModels'
import type { RequestDto } from '../api/requestModels'
import { searchRequests } from '../api/requestsApi'
import type { CurrentUser } from '../auth/currentUser'
import { createQueryClientWrapper } from '../test/createQueryClientWrapper'
import { createRequest } from '../test/createRequest'
import RequestsPage from './RequestsPage'

vi.mock(import('../api/requestsApi'), () => ({
  searchRequests: vi.fn(),
}))

const CURRENT_USER: CurrentUser = { userId: 1, isAdministrator: false }
const PAGE_SIZE = 20
const DEFAULT_SORT = { sortBy: ['CreatedAt'], sortDir: ['Desc'] }

// Enough requests for two pages, so the user can move to page 2.
const TWO_PAGES: PagedResult<RequestDto> = {
  items: [createRequest(1)],
  totalCount: PAGE_SIZE + 1,
  page: 1,
  pageSize: PAGE_SIZE,
}

function lastQuery() {
  return vi.mocked(searchRequests).mock.lastCall?.[0]
}

async function renderPageOnSecondPage() {
  const user = userEvent.setup()
  render(<RequestsPage currentUser={CURRENT_USER} />, { wrapper: createQueryClientWrapper() })
  await user.click(await screen.findByRole('button', { name: 'Go to next page' }))
  await waitFor(() => expect(lastQuery()).toEqual({ ...DEFAULT_SORT, page: 2 }))
  return user
}

// The filter bar has buttons with the same names (Status, Created), so look only inside the table.
function headerButton(name: string) {
  return within(screen.getByRole('table')).getByRole('button', { name })
}

describe('RequestsPage', () => {
  beforeEach(() => {
    vi.mocked(searchRequests).mockReset()
    vi.mocked(searchRequests).mockResolvedValue(TWO_PAGES)
  })

  it('loads the first page without filters', async () => {
    render(<RequestsPage currentUser={CURRENT_USER} />, { wrapper: createQueryClientWrapper() })

    expect(await screen.findByRole('cell', { name: 'REQ-1' })).toBeInTheDocument()
    expect(searchRequests).toHaveBeenCalledWith({ ...DEFAULT_SORT, page: 1 }, CURRENT_USER, expect.any(AbortSignal))
  })

  it('searches by itself with the form filters from the first page', async () => {
    const user = await renderPageOnSecondPage()

    await user.type(screen.getByRole('textbox', { name: 'Request number' }), 'REQ-1')

    await waitFor(() =>
      expect(lastQuery()).toEqual({
        requestNumber: 'REQ-1',
        status: [],
        type: [],
        createdFrom: '',
        createdTo: '',
        ...DEFAULT_SORT,
        page: 1,
      }),
    )
  })

  it('goes back to the first page without filters on Clear filters', async () => {
    const user = await renderPageOnSecondPage()
    await user.type(screen.getByRole('textbox', { name: 'Request number' }), 'REQ-1')
    await waitFor(() => expect(lastQuery()).toEqual(expect.objectContaining({ requestNumber: 'REQ-1', page: 1 })))
    await user.click(screen.getByRole('button', { name: 'Go to next page' }))
    await waitFor(() => expect(lastQuery()).toEqual(expect.objectContaining({ page: 2 })))

    await user.click(screen.getByRole('button', { name: 'Clear filters' }))

    await waitFor(() => expect(lastQuery()).toEqual({ ...DEFAULT_SORT, page: 1 }))
  })

  it('sorts ascending by the clicked column from the first page', async () => {
    const user = await renderPageOnSecondPage()

    await user.click(headerButton('Status'))

    await waitFor(() => expect(lastQuery()).toEqual({ sortBy: ['Status'], sortDir: ['Asc'], page: 1 }))
  })

  it('sorts by the default column ascending when it is clicked first', async () => {
    const user = await renderPageOnSecondPage()

    await user.click(headerButton('Created'))

    await waitFor(() => expect(lastQuery()).toEqual({ sortBy: ['CreatedAt'], sortDir: ['Asc'], page: 1 }))
  })

  it('sorts by a second clicked column after the first one', async () => {
    const user = await renderPageOnSecondPage()

    await user.click(headerButton('Status'))
    await user.click(headerButton('Created'))

    await waitFor(() =>
      expect(lastQuery()).toEqual({ sortBy: ['Status', 'CreatedAt'], sortDir: ['Asc', 'Asc'], page: 1 }),
    )
  })

  it('sorts a column descending on its second click and keeps the order of the columns', async () => {
    const user = await renderPageOnSecondPage()

    await user.click(headerButton('Status'))
    await user.click(headerButton('Created'))
    await user.click(headerButton('Status'))

    await waitFor(() =>
      expect(lastQuery()).toEqual({ sortBy: ['Status', 'CreatedAt'], sortDir: ['Desc', 'Asc'], page: 1 }),
    )
  })

  it('stops sorting by a column on its third click', async () => {
    const user = await renderPageOnSecondPage()

    await user.click(headerButton('Status'))
    await user.click(headerButton('Created'))
    await user.click(headerButton('Status'))
    await user.click(headerButton('Status'))

    await waitFor(() => expect(lastQuery()).toEqual({ sortBy: ['CreatedAt'], sortDir: ['Asc'], page: 1 }))
  })

  it('goes back to the default sort when no column is sorted any more', async () => {
    const user = await renderPageOnSecondPage()

    await user.click(headerButton('Status'))
    await user.click(headerButton('Status'))
    await user.click(headerButton('Status'))

    await waitFor(() => expect(lastQuery()).toEqual({ ...DEFAULT_SORT, page: 1 }))
  })
})

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { MemoryRouter } from 'react-router'
import { searchRequests } from './api/requestsApi'
import { saveCurrentUser } from './auth/currentUserStorage'
import App from './App'
import { createQueryClientWrapper } from './test/createQueryClientWrapper'

vi.mock(import('./api/requestsApi'), async (importOriginal) => ({
  ...(await importOriginal()),
  searchRequests: vi.fn(),
}))

const REQUESTS_PATH = '/requests'

// A reload starts the app again from scratch, which a fresh render at the same path stands for.
function renderAppAt(path: string) {
  const QueryClientWrapper = createQueryClientWrapper()
  render(
    <QueryClientWrapper>
      <MemoryRouter initialEntries={[path]}>
        <App />
      </MemoryRouter>
    </QueryClientWrapper>,
  )
}

describe('App', () => {
  beforeEach(() => {
    vi.mocked(searchRequests).mockResolvedValue({ items: [], totalCount: 0, page: 1, pageSize: 20 })
  })

  afterEach(() => window.sessionStorage.clear())

  it('stays on the requests page after a reload when logged in', async () => {
    saveCurrentUser({ userId: 1, isAdministrator: false })

    renderAppAt(REQUESTS_PATH)

    expect(await screen.findByRole('heading', { name: 'Requests' })).toBeInTheDocument()
  })

  it('sends to the login page when nobody is logged in', () => {
    renderAppAt(REQUESTS_PATH)

    expect(screen.getByRole('button', { name: 'Log in' })).toBeInTheDocument()
  })

  it('remembers the user who logs in until they log out', async () => {
    const user = userEvent.setup()
    renderAppAt(REQUESTS_PATH)
    await user.type(screen.getByRole('spinbutton', { name: 'User id' }), '1')
    await user.click(screen.getByRole('button', { name: 'Log in' }))
    expect(window.sessionStorage.length).toBe(1)

    await user.click(await screen.findByRole('button', { name: 'Log out' }))

    expect(window.sessionStorage.length).toBe(0)
    expect(screen.getByRole('button', { name: 'Log in' })).toBeInTheDocument()
  })
})

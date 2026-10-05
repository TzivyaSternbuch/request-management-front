import { afterEach, describe, expect, it } from 'vitest'
import type { CurrentUser } from './currentUser'
import { loadCurrentUser, saveCurrentUser } from './currentUserStorage'

const STORAGE_KEY = 'currentUser'
const USER: CurrentUser = { userId: 5, isAdministrator: true }

describe('currentUserStorage', () => {
  afterEach(() => window.sessionStorage.clear())

  it('loads the saved user', () => {
    saveCurrentUser(USER)

    expect(loadCurrentUser()).toEqual(USER)
  })

  it('loads no user when none was saved', () => {
    expect(loadCurrentUser()).toBeNull()
  })

  it('forgets the user when null is saved', () => {
    saveCurrentUser(USER)

    saveCurrentUser(null)

    expect(loadCurrentUser()).toBeNull()
  })

  it.each([
    ['broken JSON', '{'],
    ['not an object', '5'],
    ['a missing role', '{"userId":5}'],
    ['a text user id', '{"userId":"5","isAdministrator":false}'],
    ['a non-positive user id', '{"userId":0,"isAdministrator":false}'],
  ])('loads no user from %s', (_case, stored) => {
    window.sessionStorage.setItem(STORAGE_KEY, stored)

    expect(loadCurrentUser()).toBeNull()
  })
})

import { useState } from 'react'
import type { CurrentUser } from './currentUser'
import { loadCurrentUser, saveCurrentUser } from './currentUserStorage'

interface CurrentUserState {
  currentUser: CurrentUser | null
  logIn: (user: CurrentUser) => void
  logOut: () => void
}

export function useCurrentUser(): CurrentUserState {
  // Read the stored user on the first render, so a reload stays on the page it was on.
  const [currentUser, setCurrentUser] = useState(loadCurrentUser)

  function changeCurrentUser(user: CurrentUser | null) {
    saveCurrentUser(user)
    setCurrentUser(user)
  }

  return { currentUser, logIn: changeCurrentUser, logOut: () => changeCurrentUser(null) }
}

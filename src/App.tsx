import { useState } from 'react'
import { Navigate, Route, Routes } from 'react-router'
import type { CurrentUser } from './auth/currentUser'
import { loadCurrentUser, saveCurrentUser } from './auth/currentUserStorage'
import AppLayout from './components/layout/AppLayout'
import LoginForm from './features/login/components/LoginForm'
import RequestsPage from './features/requests/components/RequestsPage'

const LOGIN_PATH = '/login'
const REQUESTS_PATH = '/requests'

// Each route redirects based on the current user, so logging in or out moves to the right screen by itself.
function App() {
  // Read the stored user on the first render, so a reload stays on the page it was on.
  const [currentUser, setCurrentUser] = useState(loadCurrentUser)

  function changeCurrentUser(user: CurrentUser | null) {
    saveCurrentUser(user)
    setCurrentUser(user)
  }

  return (
    <Routes>
      <Route
        path={LOGIN_PATH}
        element={currentUser === null ? <LoginForm onLogin={changeCurrentUser} /> : <Navigate to={REQUESTS_PATH} replace />}
      />
      <Route
        path={REQUESTS_PATH}
        element={
          currentUser === null ? (
            <Navigate to={LOGIN_PATH} replace />
          ) : (
            <AppLayout title="Requests" onLogout={() => changeCurrentUser(null)}>
              <RequestsPage currentUser={currentUser} />
            </AppLayout>
          )
        }
      />
      <Route path="*" element={<Navigate to={REQUESTS_PATH} replace />} />
    </Routes>
  )
}

export default App

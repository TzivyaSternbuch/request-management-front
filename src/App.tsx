import { useState } from 'react'
import { Navigate, Route, Routes } from 'react-router'
import type { CurrentUser } from './auth/currentUser'
import AppLayout from './components/AppLayout'
import LoginForm from './components/LoginForm'
import RequestsPage from './components/RequestsPage'

const LOGIN_PATH = '/login'
const REQUESTS_PATH = '/requests'

// Each route redirects based on the current user, so logging in or out moves to the right screen by itself.
function App() {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null)

  return (
    <Routes>
      <Route
        path={LOGIN_PATH}
        element={currentUser === null ? <LoginForm onLogin={setCurrentUser} /> : <Navigate to={REQUESTS_PATH} replace />}
      />
      <Route
        path={REQUESTS_PATH}
        element={
          currentUser === null ? (
            <Navigate to={LOGIN_PATH} replace />
          ) : (
            <AppLayout title="Requests" onLogout={() => setCurrentUser(null)}>
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

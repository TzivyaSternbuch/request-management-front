import { Navigate, Route, Routes } from 'react-router'
import { useCurrentUser } from './auth/useCurrentUser'
import AppLayout from './components/layout/AppLayout'
import LoginForm from './features/login/components/LoginForm'
import RequestsPage from './features/requests/components/RequestsPage'

const LOGIN_PATH = '/login'
const REQUESTS_PATH = '/requests'

// Each route redirects based on the current user, so logging in or out moves to the right screen by itself.
function App() {
  const { currentUser, logIn, logOut } = useCurrentUser()

  return (
    <Routes>
      <Route
        path={LOGIN_PATH}
        element={currentUser === null ? <LoginForm onLogin={logIn} /> : <Navigate to={REQUESTS_PATH} replace />}
      />
      <Route
        path={REQUESTS_PATH}
        element={
          currentUser === null ? (
            <Navigate to={LOGIN_PATH} replace />
          ) : (
            <AppLayout title="Requests" onLogout={logOut}>
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

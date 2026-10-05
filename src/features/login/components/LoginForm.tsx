import { useState } from 'react'
import type { SubmitEvent } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import type { CurrentUser } from '../../../auth/currentUser'
import { useLogin } from '../hooks/useLogin'
import AppLogo from '../../../components/layout/AppLogo'

// The server reads X-User-Id into an int, so larger values would be rejected.
const MAX_USER_ID = 2_147_483_647

interface LoginFormProps {
  onLogin: (user: CurrentUser) => void
}

function LoginForm({ onLogin }: LoginFormProps) {
  const [userIdText, setUserIdText] = useState('')
  const { login, error, isLoading } = useLogin(onLogin)

  const userId = parseUserId(userIdText)

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    if (userId === null) {
      return
    }
    login(userId)
  }

  return (
    <Box component="main" sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center', p: 2 }}>
      <Card variant="outlined" sx={{ width: '100%', maxWidth: 400, p: 4 }}>
        <Stack component="form" spacing={3} onSubmit={handleSubmit}>
          <Stack spacing={1} sx={{ alignItems: 'center', textAlign: 'center' }}>
            <AppLogo size={48} />
            <Typography variant="h5" component="h1" sx={{ fontWeight: 600 }}>
              Request Management
            </Typography>
            <Typography color="text.secondary">Log in to see your requests</Typography>
          </Stack>
          <TextField
            label="User id"
            type="number"
            required
            value={userIdText}
            onChange={(event) => setUserIdText(event.target.value)}
            error={error !== null}
            helperText={error}
          />
          <Button type="submit" variant="contained" size="large" disabled={userId === null} loading={isLoading}>
            Log in
          </Button>
        </Stack>
      </Card>
    </Box>
  )
}

// Returns null for an empty, fractional, non-positive or too large id, which keeps "Log in" disabled.
function parseUserId(text: string): number | null {
  const userId = Number(text)
  return Number.isInteger(userId) && userId > 0 && userId <= MAX_USER_ID ? userId : null
}

export default LoginForm

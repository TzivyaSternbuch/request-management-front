import type { ReactNode } from 'react'
import AppBar from '@mui/material/AppBar'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import AppLogo from './AppLogo'

interface AppLayoutProps {
  title: string
  onLogout: () => void
  children: ReactNode
}

function AppLayout({ title, onLogout, children }: AppLayoutProps) {
  return (
    <>
      <AppBar position="sticky" color="inherit" elevation={0} sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Toolbar sx={{ gap: 2 }}>
          <AppLogo size={32} />
          <Typography variant="h6" component="span" noWrap sx={{ flexGrow: 1, fontWeight: 600 }}>
            Request Management
          </Typography>
          <Button variant="outlined" sx={{ flexShrink: 0 }} onClick={onLogout}>
            Log out
          </Button>
        </Toolbar>
      </AppBar>
      <Container component="main" maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600, mb: 3 }}>
          {title}
        </Typography>
        {children}
      </Container>
    </>
  )
}

export default AppLayout

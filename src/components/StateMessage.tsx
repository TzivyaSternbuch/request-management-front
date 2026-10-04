import type { ReactNode } from 'react'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

interface StateMessageProps {
  icon: ReactNode
  title: string
  description: string
  role?: 'status' | 'alert'
}

function StateMessage({ icon, title, description, role }: StateMessageProps) {
  return (
    <Paper variant="outlined" role={role} sx={{ py: 8, px: 3 }}>
      <Stack spacing={1.5} sx={{ alignItems: 'center', textAlign: 'center' }}>
        {icon}
        <Typography variant="h6" component="p" sx={{ fontWeight: 600 }}>
          {title}
        </Typography>
        <Typography color="text.secondary">{description}</Typography>
      </Stack>
    </Paper>
  )
}

export default StateMessage

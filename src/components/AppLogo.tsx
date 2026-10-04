import Box from '@mui/material/Box'

// Same image as the browser-tab icon (public/favicon.svg).
const LOGO_URL = '/favicon.svg'

interface AppLogoProps {
  size: number
}

function AppLogo({ size }: AppLogoProps) {
  return <Box component="img" src={LOGO_URL} alt="" sx={{ width: size, height: size, display: 'block' }} />
}

export default AppLogo

import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Button from '@mui/material/Button'

interface DropdownButtonProps {
  label: string
  isActive: boolean
  isOpen: boolean
  popupRole: 'menu' | 'dialog'
  onOpen: (anchor: HTMLElement) => void
}

// An active button is drawn in the primary color, so the filters in use stand out.
function DropdownButton({ label, isActive, isOpen, popupRole, onOpen }: DropdownButtonProps) {
  return (
    <Button
      variant="outlined"
      color={isActive ? 'primary' : 'inherit'}
      endIcon={<ExpandMoreIcon />}
      aria-haspopup={popupRole}
      aria-expanded={isOpen}
      onClick={(event) => onOpen(event.currentTarget)}
      sx={isActive ? undefined : { borderColor: 'divider' }}
    >
      {label}
    </Button>
  )
}

export default DropdownButton

import { useState } from 'react'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'

interface FilterMenuButtonProps<T extends string> {
  label: string
  options: T[]
  labels: Record<T, string>
  value: T[]
  onChange: (value: T[]) => void
}

function FilterMenuButton<T extends string>({ label, options, labels, value, onChange }: FilterMenuButtonProps<T>) {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null)
  const isActive = value.length > 0

  function toggle(option: T) {
    onChange(value.includes(option) ? value.filter((x) => x !== option) : [...value, option])
  }

  return (
    <>
      <Button
        variant="outlined"
        color={isActive ? 'primary' : 'inherit'}
        endIcon={<ExpandMoreIcon />}
        aria-haspopup="menu"
        aria-expanded={anchor !== null}
        onClick={(event) => setAnchor(event.currentTarget)}
        sx={isActive ? undefined : { borderColor: 'divider' }}
      >
        {isActive ? `${label} · ${value.length}` : label}
      </Button>
      {/* Stays open after a click, so several options can be picked in a row. */}
      <Menu anchorEl={anchor} open={anchor !== null} onClose={() => setAnchor(null)}>
        {options.map((option) => (
          <MenuItem
            key={option}
            dense
            role="menuitemcheckbox"
            aria-checked={value.includes(option)}
            onClick={() => toggle(option)}
          >
            <Checkbox size="small" checked={value.includes(option)} tabIndex={-1} disableRipple sx={{ p: 0, mr: 1 }} />
            {labels[option]}
          </MenuItem>
        ))}
      </Menu>
    </>
  )
}

export default FilterMenuButton

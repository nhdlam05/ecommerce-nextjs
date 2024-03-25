import Title from 'atoms/Title/Title'
import './Tab.scss'
import { Box } from '@mui/material'

export type TabTheme = 'danger' | 'dark' | 'warning'

interface Props {
  size?: 'm' | 'l'
  variant?: 'contained' | 'outlined'
  active: boolean
  theme?: TabTheme
  onClick?: (event: any) => void
  label: React.ReactNode | string
  startSlot?: React.ReactNode | string
}

const Tab: React.FC<Props> = ({
  onClick,
  size = 'm',
  variant = 'contained',
  theme = 'default',
  active,
  label,
  startSlot
}) => {
  return (
    <div
      className={`Tab size-${size} theme-${theme} variant-${variant} ${active ? 'is-active' : ''}`}
      onClick={onClick}
    >
      {startSlot && <Box sx={{ mr: 1 }}>{startSlot}</Box>}
      <Title size='s' noMargin>
        {label}
      </Title>
    </div>
  )
}

export default Tab

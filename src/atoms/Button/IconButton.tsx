import CircularProgress from '@mui/material/CircularProgress'
import './IconButton.scss'
import './_Button.scss'

interface Props {
  icon: React.ReactNode
  onClick: any
  className?: string
  theme?: 'primary' | 'dark' | 'white'
  id?: string
  size?: 'xs' | 's' | 'm' | 'l'
  noBackground?: boolean
  disabled?: boolean
  isLoading?: boolean
  active?: boolean
}

const IconButton: React.FC<Props> = ({
  icon,
  onClick,
  className,
  theme = 'primary',
  id = '',
  size = 's',
  noBackground = false,
  disabled,
  isLoading,
  active
}) => {
  return (
    <button
      className={`IconButton ${className} theme-${theme} size-${size} ${
        noBackground ? 'has-no-background' : ''
      } ${isLoading ? 'is-loading' : ''} ${active ? 'is-active' : ''}`}
      onClick={onClick}
      id={id}
      disabled={disabled}
    >
      {!isLoading && icon}
      {isLoading && <CircularProgress className='Button--loader' size='14' />}
    </button>
  )
}

export default IconButton

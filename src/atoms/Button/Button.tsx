import CircularProgress from '@mui/material/CircularProgress'
import './_Button.scss'

export type ButtonTheme =
  | 'dark'
  | 'highlighted'
  | 'white'
  | 'danger'
  | 'ghosted'
  | 'light' // remove
  | 'warning'
  | 'info' // should be success
  | 'text'
  | 'primary'
  | 'pink-gradient'
  | 'success'
  | 'delete' // should be error contained

export type ButtonVariant = 'primary' | 'inline' | 'naked' | 'outlined' | 'light' | 'link'

export type ButtonAlign = 'left' | 'center' | 'right'

export type ButtonSize = 'xxs' | 'xs' | 's' | 'm' | 'l'

export type ButtonShape = 'round' | 'normal'

export type ButtonType = 'submit' | 'button' | 'reset' | undefined

type ButtonRadius = 'xxs' | 'xs' | 's' | 'm'

interface Props {
  theme?: ButtonTheme
  variant?: ButtonVariant
  align?: ButtonAlign
  size?: ButtonSize
  onClick?: (e: any) => void
  label?: string | JSX.Element
  icon?: React.ReactNode
  id?: string
  isLoading?: boolean
  isFullsize?: boolean
  isMobileFullsize?: boolean
  isHalfsize?: boolean
  iconArrow?: boolean
  classes?: string
  shape?: ButtonShape
  startIcon?: React.ReactNode
  startSlot?: React.ReactNode
  hasNoti?: boolean
  type?: ButtonType
  disabled?: boolean
  radius?: ButtonRadius
}

const Button: React.FC<Props> = ({
  iconArrow,
  icon,
  label,
  hasNoti,
  startIcon,
  startSlot,
  onClick,
  id,
  type = 'button',
  disabled,
  theme = 'dark',
  variant = 'primary',
  align,
  size = 'm',
  isLoading,
  isMobileFullsize,
  isFullsize,
  isHalfsize,
  shape,
  classes = '',
  radius = 'm'
}) => {
  const mod_class = [
    'Button',
    `theme-${theme}`,
    `variant-${variant}`,
    `size-${size}`,
    `radius-${radius}`,
    isLoading ? 'is-loading' : '',
    isMobileFullsize ? 'is-mobileFullsize' : '',
    isFullsize ? 'is-fullsize' : '',
    isHalfsize ? 'is-halfsize' : '',
    shape ? `shape-${shape}` : '',
    align ? `align-${align}` : 'align',
    classes
  ]
    .join(' ')
    .replace(/\s{2,}/g, ' ')

  const handleClick = (e: any) => onClick && onClick(e)

  function renderDOM() {
    return (
      <button id={id} className={mod_class} type={type} disabled={disabled || isLoading} onClick={handleClick}>
        {startSlot && startSlot}
        {startIcon ? (
          <div className='Button--IconContainer'>
            {hasNoti && <div className='Button--indicator' />}
            <i className={`Button--icon ${label ? 'Button--icon-left' : 'Button--icon-only'}`}>{startIcon}</i>
          </div>
        ) : (
          ''
        )}
        {label && <span className='Button--label'>{label}</span>}
        {isLoading && <CircularProgress className='Button--loader' size='20' />}

        {icon ? <i className='Button--icon'>{icon}</i> : ''}

        {iconArrow && <i className='Button--icon'>icon arrow</i>}
      </button>
    )
  }

  return renderDOM()
}

export default Button

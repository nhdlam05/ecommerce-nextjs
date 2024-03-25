import { ButtonProps } from '@mui/material'
import { Theme } from '@mui/material/styles'
import Loader from 'atoms/Loader/Loader'
import { BaseButtonStyle } from './styles'

export interface Props extends ButtonProps {
  children: React.ReactNode
  border?: number | string // border-radius
  shadows?: number // box-shadow
  loading?: boolean
  theme?: Theme
}

const AtomButton: React.FC<Props> = ({ shadows, variant, border, loading, endIcon, ...others }) => {
  const getShadows = () => {
    if (shadows || shadows === 0) return shadows
    if (variant === 'contained') return 3

    return 0
  }
  const getBorder = () => {
    if (border) return border
    if (variant === 'contained') return 3

    return border
  }

  return (
    <BaseButtonStyle
      shadows={getShadows()}
      border={getBorder()}
      variant={variant}
      endIcon={loading ? <Loader size={20} /> : endIcon}
      {...others}
    />
  )
}

export default AtomButton

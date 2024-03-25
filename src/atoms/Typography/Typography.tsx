import { TypographyProps } from '@mui/material'
import { BaseTypographyStyle } from './styles'

export interface Props extends TypographyProps {
  children: React.ReactNode
  text?: 'primary' | 'secondary'
}

const Typography: React.FC<Props> = ({ children, text = 'primary', color, ...others }) => {
  return (
    <BaseTypographyStyle color={color || `text.${text}`} text={text} {...others}>
      {children}
    </BaseTypographyStyle>
  )
}

export default Typography

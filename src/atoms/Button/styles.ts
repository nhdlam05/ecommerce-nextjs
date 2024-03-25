import { Button } from '@mui/material'
import { experimentalStyled as styled } from '@mui/material/styles'
import { Props } from './AtomButton'

export const BaseButtonStyle = styled(Button)(({ theme, border, shadows }: Props) => ({
  boxShadow: theme?.shadows[shadows || 0],
  borderRadius: `${typeof border === 'string' ? border : theme?.spacing(Number(border) || 1)}`,
  padding: '5px 15px',
  '&:hover': {
    boxShadow: 'inherit'
  },
  '&:active': {
    boxShadow: 'inherit'
  }
}))

export const PinkGradientButtonStyle = styled(BaseButtonStyle)(() => ({
  color: '#fff',
  background: 'linear-gradient(267.34deg,#edccae,#e77972)',
  border: 'none',
  '&:hover': {
    opacity: '0.5'
  }
}))

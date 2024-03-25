import { Typography as MTypography } from '@mui/material'
import { experimentalStyled as styled } from '@mui/material/styles'
import { Props } from './Typography'

export const BaseTypographyStyle = styled(MTypography)(({ text, fontWeight }: Props) => ({
  fontWeight: `${fontWeight ? fontWeight : text === 'primary' ? '500' : '400'}`
}))

export const StrikethroughStyled = styled(BaseTypographyStyle)(() => ({
  textDecoration: 'line-through'
}))

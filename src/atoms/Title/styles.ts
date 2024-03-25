import { Theme, Typography } from '@mui/material'
import { experimentalStyled as styled } from '@mui/material/styles'

export const RootStyle = styled(Typography)(({ theme }: { theme: Theme }) => ({
  color: theme.palette.primary.main
}))

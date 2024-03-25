import { experimentalStyled as styled } from '@mui/material/styles'

export const StatusWrapper = styled('div')(() => ({
  display: 'flex',
  alignItems: 'center',
  '& .MuiTypography-body1.theme-success': {
    color: '#27AE60'
  },
  '& .MuiTypography-body1.theme-warning': {
    color: '#F2994A'
  },
  '& .MuiTypography-body1.theme-danger': {
    color: '#F46957'
  },
  '& .MuiTypography-body1.theme-purple': {
    color: '#8467d7'
  }
}))

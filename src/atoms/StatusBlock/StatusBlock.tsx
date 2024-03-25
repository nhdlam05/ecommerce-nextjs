import { Box } from '@mui/material'
import ColoredBullet, { ColoredBulletTheme } from 'atoms/ColoredBullet'
import Typography from 'atoms/Typography'
import { StatusWrapper } from './styles'

interface Props {
  theme: ColoredBulletTheme
  title: string | React.ReactNode
  subtitle: string | React.ReactNode
}

const StatusBlock: React.FC<Props> = ({ theme, title, subtitle }) => {
  return (
    <StatusWrapper>
      <ColoredBullet theme={theme} />
      <Box sx={{ ml: 1 }}>
        <Typography variant='body1' className={`theme-${theme}`}>
          {title}
        </Typography>
        <Typography variant='body2' text='secondary'>
          {subtitle}
        </Typography>
      </Box>
    </StatusWrapper>
  )
}

export default StatusBlock

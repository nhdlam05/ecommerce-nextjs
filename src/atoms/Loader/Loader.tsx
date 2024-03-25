import CircularProgress from '@mui/material/CircularProgress'
import './Loader.scss'

interface Props {
  fullscreen?: boolean
  full?: boolean
  opaque?: boolean
  theme?: string
  size?: number
}

const Loader: React.FC<Props> = ({ fullscreen, full, opaque, theme, size = 40 }) => {
  const mod_class = [
    'Loader',
    fullscreen ? 'is-fullscreen' : '',
    full ? 'is-full' : '',
    opaque ? 'is-opaque' : '',
    theme ? 'theme-' + theme : ''
  ].join(' ')

  return (
    <div className={mod_class}>
      <CircularProgress size={size} />
    </div>
  )
}

export default Loader

import './ColoredBullet.scss'

export type ColoredBulletTheme = 'success' | 'warning' | 'danger' | 'purple'

interface Props {
  theme: ColoredBulletTheme
}

const ColoredBullet: React.FC<Props> = ({ theme }) => {
  return (
    <div className={`ColoredBullet theme-${theme}`}>
      <span className='ColoredBullet--firstCircle'></span>
      <span className='ColoredBullet--secondCircle'></span>
    </div>
  )
}

export default ColoredBullet

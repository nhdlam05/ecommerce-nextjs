import Module from 'atoms/Module/Module'
import './ExpandedCard.scss'

interface Props {
  padding?: 's' | 'm'
  radius?: 'l' | 'xl'
  iconSize?: 'xxs' | 'xs'
  children: React.ReactNode
  onClick?: VoidFunction
}

const ExpandedCard: React.FC<Props> = ({ children, iconSize = 'xxs', onClick, ...others }) => {
  return (
    <div className='ExpandedCard' onClick={onClick}>
      <Module {...others}>
        <div className='ExpandedCard--icon'>'Icon expand'</div>

        {children}
      </Module>
    </div>
  )
}

export default ExpandedCard

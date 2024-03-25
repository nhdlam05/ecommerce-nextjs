import Title from 'atoms/Title/Title'
import './MutedBox.scss'

interface Props {
  children: React.ReactNode
  muted: boolean
  border?: 'none' | 's' | 'm' | 'l'
  title?: string
}

const MutedBox: React.FC<Props> = ({ muted, children, border = 'none', title }) => {
  if (!muted) return <>{children}</>

  return (
    <>
      {title && <Title size='s'>{title}</Title>}
      <div className='MutedBox'>
        <div className={`MutedBox--greyout border-${border}`}></div>
        <div className={`MutedBox--content`}>{children}</div>
      </div>
    </>
  )
}

export default MutedBox

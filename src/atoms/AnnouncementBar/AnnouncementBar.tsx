import { useState } from 'react'
import { CgClose } from 'react-icons/cg'
import Button from '../Button/Button'
import Title from '../Title/Title'
import './AnnouncementBar.scss'

interface Props {
  text: string | React.ReactNode
  theme?: 'warning' | 'alert'
  onClose?: VoidFunction
}

const AnnouncementBar: React.FC<Props> = ({ text, onClose, theme = 'warning' }) => {
  const [shown, setShown] = useState(true)

  const handleClose = () => {
    onClose && onClose()
    setShown(false)
  }

  if (!shown) return <></>

  return (
    <div className={`AnnouncementBar theme-${theme}`}>
      <div className='AnnouncementBar--content'>
        <Title size='xs' noMargin>
          {text}
        </Title>
      </div>
      <div className='AnnountmentBar--button'>
        {onClose && <Button size='l' variant='inline' label={<CgClose size='16' />} onClick={handleClose} />}
      </div>
    </div>
  )
}

export default AnnouncementBar

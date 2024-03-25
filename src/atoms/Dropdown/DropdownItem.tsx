import { Box } from '@mui/material'
import Text from 'atoms/Text/Text'
import Title from 'atoms/Title/Title'
import { DropdownItemType } from './Dropdown'
import './Dropdown.scss'

interface Props {
  onClick: (e: any, item: DropdownItemType) => void
  item: DropdownItemType
}

const DropdownItem: React.FC<Props> = ({ onClick, item }) => {
  const handleClick = (e: any) => {
    e.preventDefault()
    onClick(e, item)
  }

  return (
    <button className='Dropdown--Item' onClick={handleClick} type='button'>
      <Box display='flex' alignItems='center'>
        {item.icon && item.icon}
        <div className='Dropdown--ItemContent'>
          {item.title && (
            <>
              {typeof item.title === 'string' ? (
                <Title size='xs' tag='p' noMargin>
                  {item.title}
                </Title>
              ) : (
                item.title
              )}
            </>
          )}
          {item.subtitle && (
            <>{typeof item.subtitle === 'string' ? <Text size='xxs'>{item.subtitle}</Text> : item.subtitle}</>
          )}
        </div>
      </Box>
    </button>
  )
}

export default DropdownItem

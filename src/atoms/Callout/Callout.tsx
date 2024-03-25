import React from 'react'
import Text from '../Text/Text'
import Title from '../Title/Title'
import './Callout.scss'

interface Props {
  icon?: React.ReactNode
  iconSize?: 'm' | 'l'
  title?: string | React.ReactNode
  text?: string | React.ReactNode
  theme?: 'purple' | ''
  endSlot?: React.ReactNode
}

const Callout: React.FC<Props> = ({ icon, iconSize = 'm', title, text, theme = '', endSlot }) => {
  const className = ['Callout', `theme-${theme}`].join(' ').replace(/\s{2,}/g, ' ')

  const iconClassName = ['Callout--icon', iconSize !== undefined ? 'iconSize-' + iconSize : '']
    .join(' ')
    .replace(/\s{2,}/g, ' ')

  function renderIcon() {
    return <span className={iconClassName}>{icon}</span>
  }

  function renderTitle() {
    if (typeof title !== 'string') return title

    return (
      <Title size='m' align='left' noMargin>
        {title}
      </Title>
    )
  }

  function renderText() {
    if (typeof text !== 'string') return text

    return (
      <Text size='s' align='left' noMargin>
        {text}
      </Text>
    )
  }

  return (
    <div className={className}>
      <div className='Callout--startSlotWrapper'>
        {icon && <div>{renderIcon()}</div>}
        <div>
          {title && renderTitle()}
          {text && renderText()}
        </div>
      </div>
      {endSlot && endSlot}
    </div>
  )
}

export default Callout

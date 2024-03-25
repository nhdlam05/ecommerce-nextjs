import React from 'react'

// ICONS

import Text from '../Text/Text'
import Title from '../Title/Title'
import './InfoCard.scss'

interface Props {
  title: string
  text?: string
  link?: React.ReactNode
  visual?: any
  variant?: 'heroTitle' | 'infoTile' | 'mobileInline'
  format?: 'vertical' | 'horizontal'
}

const InfoCard: React.FC<Props> = ({ title, text, link, visual, variant = 'heroTitle', format = 'vertical' }) => {
  const moduleClass = [
    'InfoCard',
    variant !== undefined ? 'variant-' + variant : '',
    format !== undefined ? 'format-' + format : ''
  ]
    .join(' ')
    .replace(/\s{2,}/g, ' ')

  return (
    <div className={moduleClass}>
      {visual && <div className='InfoCard--visual'>{visual}</div>}
      <div className='InfoCard--content'>
        <Title tag='h4' size='ml'>
          {title}
        </Title>
        <Text size='s'>{text}</Text>
        {link && link}
      </div>
    </div>
  )
}

export default InfoCard

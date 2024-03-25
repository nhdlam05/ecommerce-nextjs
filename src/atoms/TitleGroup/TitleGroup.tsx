import React from 'react'
import Title from '../Title/Title'
import './TitleGroup.scss'

interface Props {
  title: string
  subtitle: string
  align?: string
}

const TitleGroup: React.FC<Props> = ({ title, subtitle, align }) => {
  return (
    <div className={`TitleGroup ${align ? 'align-' + align : ''}`}>
      <Title tag='h3'>
        <Title tag='span' size='xl' font='alt' className='TitleGroup--title'>
          {title}{' '}
        </Title>
        <Title tag='span' size='xl' theme='grey' className='TitleGroup--subtitle'>
          {subtitle}
        </Title>
      </Title>
    </div>
  )
}

export default TitleGroup

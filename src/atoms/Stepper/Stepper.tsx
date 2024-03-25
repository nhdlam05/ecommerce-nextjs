import React from 'react'
import './Stepper.scss'

// ICONS

interface Props {
  size?: 's' | 'm'
  theme?: 'dark' | 'white'
  activeIndex: number
  numberOfSteps: number
}

const Stepper: React.FC<Props> = ({ size = 's', activeIndex, numberOfSteps, theme = 'dark' }) => {
  const items = []

  const className = ['Stepper', size ? 'size-' + size : '', theme ? 'theme-' + theme : '']
    .join(' ')
    .replace(/\s{2,}/g, ' ')

  for (let i = 0; i < numberOfSteps; i++) {
    const mClass = [
      'Stepper--item',
      i === activeIndex ? 'is-current' : '',
      i > activeIndex ? 'is-inactive' : '',
      size ? 'size-' + size : ''
    ]
      .join(' ')
      .replace(/\s{2,}/g, ' ')
    items.push(<span className={mClass} key={i}></span>)
  }

  return (
    <div className={className}>
      <div className='Stepper--inner'>{items}</div>
    </div>
  )
}

export default Stepper

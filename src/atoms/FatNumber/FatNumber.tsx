import React from 'react'

// ICONS

import './FatNumber.scss'

interface Props {
  theme?: 'light' | 'highlight' | 'dark'
  taglineTop?: boolean
  icon?: any
  emoji?: any
  tagline?: string
  hero?: string
}

const FatNumber: React.FC<Props> = ({ theme = 'highlight', icon, emoji, hero, tagline, taglineTop = true }) => {
  const moduleClass = ['FatNumber', theme !== undefined ? 'theme-' + theme : ''].join(' ').replace(/\s{2,}/g, ' ')

  function renderElement() {
    if (icon !== undefined) {
      return <strong className='FatNumber--hero'>{icon}</strong>
    } else if (emoji !== undefined) {
      return <img className='FatNumber--hero FatNumber--emoji' src={emoji} />
    } else {
      if (taglineTop) {
        return (
          <>
            <span className='FatNumber--tagline'>{tagline}</span>
            <strong className='FatNumber--hero'>{hero}</strong>
          </>
        )
      } else {
        return (
          <>
            <strong className='FatNumber--hero'>{hero}</strong>
            <span className='FatNumber--tagline'>{tagline}</span>
          </>
        )
      }
    }
  }

  return <div className={moduleClass}>{renderElement()}</div>
}

export default FatNumber

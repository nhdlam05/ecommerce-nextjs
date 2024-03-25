import React from 'react'
import './InfoCardGroup.scss'

interface Props {
  children: React.ReactNode
  size: '2' | '3' | '4'
  layout?: 'shifted' | 'shifted-negative' | 'cascade'
  variant?: 'mobileInline' | 'mobileTwoColumn'
}

const InfoCardGroup: React.FC<Props> = ({ size = '3', layout, variant, children }) => {
  const moduleClass = [
    'InfoCardGroup',
    size !== undefined ? 'size-' + size : '',
    layout !== undefined ? 'layout-' + layout : '',
    variant !== undefined ? 'variant-' + variant : ''
  ]
    .join(' ')
    .replace(/\s{2,}/g, ' ')

  return <div className={moduleClass}>{children}</div>
}

export default InfoCardGroup

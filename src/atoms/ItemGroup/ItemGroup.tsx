import React from 'react'
import './ItemGroup.scss'

interface Props {
  children: React.ReactNode
  noMargin?: boolean
  className?: string
  border?: 'l' | 'xl'
  elevation?: 'none' | 's' | 'm'
}

const ItemGroup: React.FC<Props> = ({
  children,
  noMargin = false,
  className = '',
  border = 'l',
  elevation = 'none'
}) => {
  return (
    <div
      className={['ItemGroup', noMargin ? 'no-margin' : '', className, `border-${border}`, `elevation-${elevation}`]
        .join(' ')
        .replace(/\s{2,}/g, ' ')}
    >
      {children}
    </div>
  )
}

export default ItemGroup

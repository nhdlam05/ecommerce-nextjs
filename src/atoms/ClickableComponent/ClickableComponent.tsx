import React from 'react'
import './ClickableComponent.scss'

interface Props {
  children: React.ReactNode
  onClick: () => void
}

const ClickableComponent: React.FC<Props> = ({ children, onClick }) => {
  const className = ['ClickableComponent'].join(' ').replace(/\s{2,}/g, ' ')

  return (
    <button className={className} onClick={onClick}>
      {children}
    </button>
  )
}

export default ClickableComponent

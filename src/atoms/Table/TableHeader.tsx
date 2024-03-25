import React from 'react'
import './Table.scss'

interface Props {
  children: React.ReactNode
  className?: string
  onClick?: VoidFunction
}

const TableHeader: React.FC<Props> = ({ children, className, ...otherProps }) => (
  <div className={`TableHeader ${className && className}`} {...otherProps}>
    {children}
  </div>
)

export default TableHeader

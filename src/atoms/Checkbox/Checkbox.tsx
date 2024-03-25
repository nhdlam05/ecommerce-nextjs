import React from 'react'
import './Checkbox.scss'

interface Props {
  variant?: 'tile' | 'bubble' | 'badge' | 'inline'
  size?: 's' | 'm' | 'l' | 'xl'
  align?: 'left' | 'center'
  theme?: 'primary' | 'purple' | 'warning' | 'success'
  id: any
  type: 'checkbox' | 'radio'
  name?: string
  value: any
  onChange?: (e: any) => void
  onClick?: (e: any) => void
  defaultChecked?: boolean
  disabled?: boolean
  children: React.ReactNode
  classes?: string
  fullsize?: boolean
  checked?: boolean
  style?: any
  selectable?: boolean
}

const Checkbox: React.FC<Props> = ({
  fullsize,
  variant = 'bubble',
  theme = 'primary',
  size = 'm',
  align = 'center',
  disabled,
  id,
  type = 'checkbox',
  name,
  value,
  onChange,
  onClick,
  defaultChecked,
  children,
  classes,
  checked,
  selectable = true
}) => {
  const className = [
    'Checkbox',
    variant !== undefined ? 'variant-' + variant : '',
    size !== undefined ? 'size-' + size : '',
    align !== undefined ? 'align-' + align : '',
    type !== undefined ? 'type-' + type : '',
    fullsize !== undefined ? 'is-fullsize' : '',
    disabled ? 'is-disabled' : '',
    classes,
    theme ? 'theme-' + theme : '',
    selectable ? '' : 'input-hidden'
  ]
    .join(' ')
    .replace(/\s{2,}/g, ' ')

  return (
    <div className={className}>
      {selectable && (
        <input
          id={id as string}
          type={type}
          name={name as string}
          value={value}
          onChange={onChange}
          onClick={onClick}
          defaultChecked={defaultChecked}
          disabled={disabled}
          checked={checked}
        />
      )}

      <label htmlFor={id}>{children}</label>
    </div>
  )
}

export default Checkbox

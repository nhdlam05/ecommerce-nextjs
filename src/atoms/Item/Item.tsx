import React from 'react'
import Text from '../Text/Text'
import Title from '../Title/Title'
import './Item.scss'

export type ItemTheme = 'warning' | 'danger' | 'success' | 'purple'

interface Props {
  title: string | React.ReactNode
  subtitle?: string | React.ReactNode
  href?: string
  to?: string
  button?: boolean
  option?: boolean
  onClick?: (e: any) => void
  onMouseOver?: (e: any) => void
  startSlot?: any
  endSlot?: any
  size?: 's' | 'm' | 'l'
  variant?: 'danger' | 'outline' | 'reverse'
  theme?: ItemTheme
  className?: string
  children?: React.ReactNode
  active?: boolean
  disabled?: boolean
  additionalContent?: React.ReactNode
}

const Item: React.FC<Props> = ({
  title,
  subtitle,
  href,
  to,
  button,
  option,
  onClick,
  onMouseOver,
  startSlot,
  endSlot,
  variant,
  size = 'm',
  children,
  className,
  theme,
  active = false,
  disabled = false,
  additionalContent
}) => {
  const modifylClass = [
    'Item',
    className ? className : '',
    size !== undefined ? 'size-' + size : '',
    variant !== undefined ? 'variant-' + variant : '',
    active ? 'is-active' : '',
    disabled ? 'is-disabled' : '',
    theme ? 'theme-' + theme : ''
  ]
    .join(' ')
    .replace(/\s{2,}/g, ' ')

  function renderInSlot(content: any) {
    return <span className='Item--slot'>{content}</span>
  }

  function renderEndSlot() {
    if (endSlot) {
      return renderInSlot(endSlot)
    } else if (button || to) {
      return renderInSlot(<span className='Item--arrowIcon'>icon</span>)
    } else if (href) {
      return renderInSlot(<span className='Item--exitIcon'>icon</span>)
    } else {
      return
    }
  }

  function renderInnerContent() {
    return (
      <>
        <div className='Item--inter'>
          {startSlot && <span className='Item--slot Item--slot-start'>{startSlot}</span>}
          <span className='Item--slot Item--content'>
            <Title tag='span' size='s' noMargin>
              {title}
            </Title>
            {subtitle && (
              <>
                {typeof subtitle === 'string' ? (
                  <Text size='xxs' tag='span'>
                    {subtitle}
                  </Text>
                ) : (
                  subtitle
                )}
              </>
            )}
          </span>
          {children}
          {renderEndSlot()}
        </div>
        {additionalContent && additionalContent}
      </>
    )
  }

  function renderFullComponent() {
    if (button || option) {
      return (
        <button className={modifylClass} onClick={onClick} onMouseOver={onMouseOver}>
          {renderInnerContent()}
        </button>
      )
    } else if (href) {
      return (
        <a onClick={onClick} href={href} className={modifylClass} target='_blank' rel='noreferrer'>
          {renderInnerContent()}
        </a>
      )
    } else if (to) {
      return 'link to router'
    } else {
      return (
        <div className={modifylClass} onClick={onClick}>
          {renderInnerContent()}
        </div>
      )
    }
  }

  return <>{renderFullComponent()}</>
}

export default Item

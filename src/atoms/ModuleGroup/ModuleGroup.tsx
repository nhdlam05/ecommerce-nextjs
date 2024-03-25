import React, { useEffect, useState } from 'react'
import Text from '../Text/Text'
import Title, { TitleSize, TitleTag } from '../Title/Title'
import './ModuleGroup.scss'

interface Props {
  title?: string
  titleSize?: TitleSize
  titleTag?: TitleTag
  subtitle?: string
  subtitleSize?: string
  buttonLabel?: any
  buttonOnClick?: () => void
  theme?: 'dark' | 'white' | 'smart'
  align?: 'left' | 'center'
  startSlot?: React.ReactNode
  endSlot?: React.ReactNode
  children: React.ReactNode
  id?: string
}

const ModuleGroup: React.FC<Props> = ({
  theme = 'dark',
  align = 'left',
  title,
  titleSize = 'ml',
  titleTag = 'p',
  subtitle,
  subtitleSize = 's',
  buttonLabel,
  buttonOnClick,
  startSlot,
  endSlot,
  children,
  id = ''
}) => {
  const [customTheme, setCustomTheme] = useState(theme)

  useEffect(() => {
    if (theme === 'smart' && id) {
      const allModuleGroupElements = Array.from(document.getElementsByClassName('ModuleGroup'))
      const foundNode = allModuleGroupElements.find((item: any) => item.id === id)

      if (foundNode && allModuleGroupElements.indexOf(foundNode) === 0) {
        setCustomTheme('white')
      }
    }
  }, [theme, id])

  return (
    <div className={`ModuleGroup theme-${customTheme} align-${align}`} id={id}>
      <div className='ModuleGroup--header'>
        {startSlot && startSlot}
        {title && (
          <>
            <div className='ModuleGroup--title'>
              {title && (
                <Title tag={titleTag} size={titleSize} theme={theme} noMargin>
                  {title}
                </Title>
              )}
              {subtitle && (
                <Text size={subtitleSize} theme={theme} noMargin>
                  {subtitle}
                </Text>
              )}
            </div>
            {buttonLabel && (
              <div>
                <button className='ModuleGroup--button' onClick={buttonOnClick}>
                  {buttonLabel}
                </button>
              </div>
            )}
          </>
        )}
        {endSlot && endSlot}
      </div>
      <div className='ModuleGroup--content'>{children}</div>
    </div>
  )
}

export default ModuleGroup

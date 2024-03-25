import { useTranslationWithContext } from 'hooks'
import PropTypes from 'prop-types'
import { useState } from 'react'
import { BsLockFill } from 'react-icons/bs'
import Text from '../Text/Text'
import './Textarea.scss'

Textarea.propsType = {
  variant: PropTypes.oneOf(['primary', 'outlined', 'inline', 'naked']),
  onChange: PropTypes.func,
  showSafeMessage: PropTypes.bool
}

Textarea.defaultProps = {
  rows: 3,
  cols: 80,
  disabled: false,
  variant: 'primary',
  showSafeMessage: false,
  hasErrors: false
}

function Textarea(props) {
  const { translate } = useTranslationWithContext()
  const {
    value,
    variant,
    hasErrors,
    error,
    maxlength,
    onChange,
    showSafeMessage,
    helperText,
    contentInside,
    ...others
  } = props

  const markAsError = hasErrors || error

  const mod_class = [
    'Textarea--content',
    variant ? 'variant-' + variant : '',
    markAsError ? 'has-errors' : '',
    maxlength || contentInside ? 'has-typingInfo' : ''
  ].join(' ')

  const charNumber = value ? value.length : 0

  const typingInfoClassName = ['Textarea--typingInfo', charNumber >= maxlength && 'is-max']
    .join(' ')
    .replace(/\s{2,}/g, ' ')

  function renderTypingInfo() {
    return (
      <div className={typingInfoClassName}>
        <Text size='xs' align='right'>
          <span className='Textarea--typingInfo--active'>{charNumber}</span>
          <span className='Textarea--typingInfo--total'>/{maxlength}</span>
        </Text>
      </div>
    )
  }

  function renderSafeMessage() {
    return (
      <div className='Textarea--safeMessage'>
        <Text size='xxs' align='center'>
          <BsLockFill size='10' />
          <span>{translate('generic.safeMessage')}</span>
        </Text>
      </div>
    )
  }

  return (
    <div className='Textarea--container'>
      <div className={mod_class}>
        <textarea className='Textarea' maxLength={maxlength} value={value} onChange={onChange} {...others}></textarea>
        {maxlength && maxlength > 0 && renderTypingInfo()}

        {contentInside ? <div className='Textarea--contentInside'>{contentInside}</div> : <></>}
      </div>
      {showSafeMessage && renderSafeMessage()}
      {helperText && !error && !hasErrors ? (
        <Text size='xs' theme='dark'>
          {helperText}
        </Text>
      ) : (
        <></>
      )}
      {helperText && markAsError ? (
        <Text size='xs' theme='danger'>
          {helperText}
        </Text>
      ) : (
        <></>
      )}
    </div>
  )
}

export default Textarea

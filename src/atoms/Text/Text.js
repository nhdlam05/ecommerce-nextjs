import './_Text.scss'

Text.defaultProps = {
  align: 'left',
  size: 'm',
  tag: 'p',
  theme: undefined,
  isMultiline: undefined
}

function Text(props) {
  const mod_class = [
    'Text',
    props.className,
    props.isMultiline !== undefined ? 'multiline' : '',
    props.align !== undefined ? 'align-' + props.align : '',
    props.size !== undefined ? 'size-' + props.size : '',
    props.theme !== undefined ? 'theme-' + props.theme : '',
    props.noMargin !== undefined ? 'no-margin' : '',
    props.strikethrough === true ? 'is-strikethrough' : '',
    props.isLink ? 'is-link' : ''
  ].join(' ')

  function renderEl() {
    if (props.tag === 'ul') {
      return <ul className={mod_class}>{props.children}</ul>
    } else if (props.tag === 'div') {
      return <div className={mod_class}>{props.children}</div>
    } else if (props.tag === 'span') {
      return <span className={mod_class}>{props.children}</span>
    } else {
      return <p className={mod_class}>{props.children}</p>
    }
  }

  return renderEl()
}

export default Text

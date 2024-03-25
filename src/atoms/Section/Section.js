import './_Section.scss'

Section.defaultProps = {
  theme: undefined, // "", light, highlighted, dark, white
  spacing: undefined, // s, m, l
  spacingTop: undefined, // s, m, l
  spacingBottom: undefined, // s, m, l
  container: undefined // large, short, tiny
}

function Section(props) {
  const mod_class = [
    'Section',
    props.className && props.className,
    props.theme !== undefined ? 'theme-' + props.theme : '',
    props.spacing !== undefined ? 'spacing-' + props.spacing : '',
    props.spacingTop !== undefined ? 'spacing-top-' + props.spacingTop : '',
    props.spacingBottom !== undefined ? 'spacing-bottom-' + props.spacingBottom : ''
  ]
    .join(' ')
    .replace(/\s{2,}/g, ' ')

  function renderDOM() {
    if (props.container === 'large') {
      return (
        <div className={mod_class}>
          <div className='g_container'>{props.children}</div>
        </div>
      )
    } else if (props.container === 'short') {
      return (
        <div className={mod_class}>
          <div className='g_short_container'>{props.children}</div>
        </div>
      )
    } else if (props.container === 'tiny') {
      return (
        <div className={mod_class}>
          <div className='g_tiny_container'>{props.children}</div>
        </div>
      )
    } else {
      return <div className={mod_class}>{props.children}</div>
    }
  }

  return renderDOM()
}

export default Section

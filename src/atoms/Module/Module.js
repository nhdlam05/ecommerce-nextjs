import './_Module.scss'

Module.defaultProps = {
  padding: 'm',
  radius: 'm'
}

export default function Module(props) {
  const mod_class = [
    'Module',
    props.className ? props.className : '',
    props.padding !== undefined ? 'padding-' + props.padding : '',
    props.radius !== undefined ? 'radius-' + props.radius : '',
    props.theme !== undefined ? 'theme-' + props.theme : '',
    props.variant ? 'variant-' + props.variant : '',
    props.highlighted ? 'is-highlighted' : '',
    props.highlightedShort ? 'is-highlighted-short' : '',
    props.inactive ? 'is-inactive' : ''
  ].join(' ')

  const handleClick = () => {
    if (props.onClick) props.onClick()
  }

  const renderDOM = () => {
    if (props.title !== undefined) {
      return (
        <div onClick={handleClick}>
          <div className='Module--title'>{props.title}</div>
          <div className={mod_class}>{props.children}</div>
        </div>
      )
    } else {
      return (
        <div className={mod_class} onClick={handleClick}>
          {props.children}
        </div>
      )
    }
  }

  return renderDOM()
}

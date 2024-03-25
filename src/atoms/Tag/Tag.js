import './Tag.scss'

function Tag(props) {
  const mod_class = [
    'Tag',
    props.align !== undefined ? 'align-' + props.align : '',
    props.size !== undefined ? 'size-' + props.size : '',
    props.theme !== undefined ? 'theme-' + props.theme : '',
    props.variant !== undefined ? 'v-' + props.variant : ''
  ].join(' ')

  return (
    <span className={mod_class}>
      {props.icon ? <i className='Tag--icon'>{props.icon}</i> : ' '}
      {props.label}
    </span>
  )
}

Tag.propTypes = {}

Tag.defaultProps = {
  size: 'm'
}

export default Tag

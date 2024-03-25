import { FaCheck } from 'react-icons/fa'
import './_SingleCheckbox.scss'

SingleCheckbox.defaultProps = {
  type: 'checkbox'
}

function SingleCheckbox(props) {
  const mod_class = [
    'SingleCheckbox',
    props.size !== undefined ? 'size-' + props.size : '',
    props.error ? 'is-error' : ''
  ].join(' ')

  return (
    <label className={mod_class}>
      <input
        id={props.id}
        type={props.type}
        value={props.value}
        name={props.name}
        onChange={props.onChange}
        checked={props.checked}
      />
      <span className='SingleCheckbox--custom'>
        <i className='SingleCheckbox--check'>
          <FaCheck />
        </i>
      </span>
      <span className='SingleCheckbox--label'>{props.children}</span>
    </label>
  )
}

export default SingleCheckbox

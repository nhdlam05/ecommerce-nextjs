import Text from 'atoms/Text/Text'
import Title from 'atoms/Title/Title'
import './Card.scss'

// Default
Card.defaultProps = {
  format: 'h', // horizontal (h), vertical (v)
  title: 'title is a title',
  text: 'This is a text',
  variant: '' // heroTitle, infoTile
}

function Card(props) {
  const mod_class = [
    'Card',
    props.format !== undefined ? 'format-' + props.format : 'format-h',
    props.variant !== undefined ? 'variant-' + props.variant : '',
    props.inactive !== undefined ? 'is-inactive' : '',
    props.outlined !== undefined ? 'is-outlined' : ''
  ].join(' ')

  return (
    <div className={mod_class}>
      {props.visual !== undefined ? <div className='Card--visual'>{props.visual}</div> : ' '}
      <div className='Card--content'>
        <Title tag='h4' size='ml'>
          {props.title}
        </Title>
        {/* <Divider spacing="xs" /> */}
        <Text size='s'>{props.text}</Text>
        {props.link}
      </div>
    </div>
  )
}

export default Card

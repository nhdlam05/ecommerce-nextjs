import './Table.scss'

interface Props {
  variant?: string
  className?: string
  size?: string
  children: React.ReactNode
  scrollable?: boolean
}

const Table: React.FC<Props> = ({ variant, className, scrollable = false, size, children }) => {
  const mod_class = ['Table', className, size ? 'size-' + size : '', variant ? 'variant-' + variant : '']

  if (scrollable) {
    return (
      <div className={mod_class.join(' ')}>
        <div className='Table--scrollable'>{children}</div>
      </div>
    )
  }

  return <div className={mod_class.join(' ')}>{children}</div>
}

export default Table

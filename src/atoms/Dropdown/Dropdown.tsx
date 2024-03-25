import { useMemo, useState } from 'react'
import './Dropdown.scss'
import DropdownItem from './DropdownItem'

export type DropdownItemType = {
  icon?: React.ReactNode
  title?: React.ReactNode | string
  subtitle?: React.ReactNode | string
  id: string
}

interface Props {
  options: Array<DropdownItemType>
  value: string
  onChange?: (value: string) => void
  onClick?: (item: DropdownItemType) => void
}

const Dropdown: React.FC<Props> = ({ options, value, onChange, onClick }) => {
  const [optionShown, setOptionShown] = useState(false)

  const handleClick = (e: any, item: DropdownItemType) => {
    e.preventDefault()
    onChange && onChange(item.id)
    onClick && onClick(item)
    setOptionShown(false)
  }

  const toggleOption = () => setOptionShown(!optionShown)

  const currentItem = useMemo(() => {
    return options.find((item: DropdownItemType) => item.id === value) || options[0]
  }, [value])

  return (
    <>
      <div className='Dropdown--select'>
        <DropdownItem item={currentItem} onClick={toggleOption} />
        <div className='Dropdown--toggle' onClick={toggleOption}>
          icon
        </div>
      </div>
      {optionShown && (
        <div className='Dropdown--options'>
          {options.map((o: DropdownItemType) => (
            <DropdownItem key={o.id} item={o} onClick={(e: any) => handleClick(e, o)} />
          ))}
        </div>
      )}
    </>
  )
}

export default Dropdown

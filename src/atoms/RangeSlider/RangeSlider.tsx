import { Slider } from '@mui/material'
import './RangeSlider.scss'

export type RangeSliderLabelDisplayType = 'on' | 'auto' | 'off'

interface RangeSliderProps {
  defaultValue: number
  value?: number
  min: number
  max: number
  step?: number
  scale?: (value: number) => number
  disabled?: boolean
  valueLabelDisplay?: RangeSliderLabelDisplayType
  valueLabelFormat?: (value: number) => string
  onChange?: (event: Event, value: number | number[]) => void
}

const RangeSlider: React.FC<RangeSliderProps> = ({
  defaultValue,
  value,
  min,
  max,
  step = 1,
  scale,
  disabled,
  valueLabelDisplay,
  valueLabelFormat,
  onChange
}) => {
  function ariaValueText() {
    return `${value}`
  }

  return (
    <Slider
      defaultValue={defaultValue}
      value={value}
      getAriaValueText={ariaValueText}
      aria-labelledby='discrete-slider'
      valueLabelDisplay={valueLabelDisplay}
      valueLabelFormat={valueLabelFormat}
      step={step}
      scale={scale}
      marks={max - min <= 20}
      min={min}
      max={max}
      disabled={disabled}
      onChange={onChange}
    />
  )
}

export default RangeSlider

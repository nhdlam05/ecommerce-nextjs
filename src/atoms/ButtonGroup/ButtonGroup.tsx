import { Grid, GridSize } from '@mui/material'
import { useMemo } from 'react'
import Button from '../Button/Button'
import './ButtonGroup.scss'

export type ButtonGroupProps = {
  buttons: Array<any>
  borderPosition?: 'top' | 'bottom'
}

const ButtonGroup = ({ buttons, borderPosition = 'top' }: ButtonGroupProps) => {
  const colSize = useMemo((): GridSize => {
    // return the col size based on the length of buttons array passed
    switch (buttons.length) {
      case 3:
        return 4
      case 2:
        return 6
      default:
        return 12
    }
  }, [buttons])

  return (
    <div className='ButtonGroup'>
      <Grid container>
        {buttons.map((b, index) => (
          <Grid
            key={index}
            item
            xs={colSize}
            className={`ButtonGroup--Item ${borderPosition} ${b.active ? 'active' : ''}`}
            onClick={b.onClick}
          >
            {b.icon}
            <Button variant='inline' align='center' {...b} />
          </Grid>
        ))}
      </Grid>
    </div>
  )
}

export default ButtonGroup

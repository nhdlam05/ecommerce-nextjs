import { DatetimeChangeEventDetail, IonDatetime, useIonModal } from '@ionic/react'
import Text from 'atoms/Text/Text'
import moment, { Moment } from 'moment'
import { renderDateTime } from 'utils/time/formatTime'
import './DateTimePicker.scss'

interface Props {
  value: Moment | null
  onChange: (value: Moment) => void
  isError?: boolean
  presentation?: 'date-time' | 'time-date' | 'date' | 'time' | 'month' | 'year' | 'month-year'
}

const DateTimePicker: React.FC<Props> = ({ value, onChange, isError, presentation = 'date-time' }) => {
  const handleChange = (event: CustomEvent<DatetimeChangeEventDetail>) => {
    const newDate = moment(event.detail.value)
    onChange(newDate)
  }

  const [present, dismiss] = useIonModal(
    <IonDatetime
      mode='md'
      onIonChange={handleChange}
      minuteValues={[0, 15, 30, 45]}
      value={moment(value).toISOString(true)}
      firstDayOfWeek={1}
      presentation={presentation}
    >
      <div slot='time-label'>time</div>
    </IonDatetime>,
    {
      onClick: async () => {
        await dismiss()
      }
    }
  )

  return (
    <div className='DateTimePicker'>
      <button
        onClick={(e: any) => {
          e.preventDefault()
          e.stopPropagation()
          present({
            cssClass: 'DateTimePicker--modal'
          })
        }}
      />
      <div className={`DataTimePicker--input ${isError ? 'is-error' : ''}`}>
        <Text size='s'>
          {value ? renderDateTime(value, presentation === 'date' ? 'MMMM Do YYYY' : 'MMMM Do HH:mm') : 'Select'}
        </Text>
      </div>
      {isError && (
        <Text theme='danger' size='s'>
          Invalid
        </Text>
      )}
    </div>
  )
}

export default DateTimePicker

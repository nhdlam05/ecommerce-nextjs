import CalendarNextAvailability from './CalendarNextAvailability'
import './CalendarProvider.scss'
import CalendarProviderOverrides from './CalendarProviderOverrides'
import CalendarProviderWeekly from './CalendarProviderWeekly'

interface Props {
  externalCalendarSynced: boolean
}

const CalendarProvider: React.FC<Props> = ({ externalCalendarSynced }) => {
  return (
    <div className='CalendarProvider'>
      <div className='CalendarProvider--content'>
        <div className='CalendarProvider--content--body'>
          <CalendarProviderWeekly externalCalendarSynced={externalCalendarSynced} />
        </div>

        <div className='CalendarProvider--content--aside'>
          <CalendarProviderOverrides />
        </div>
      </div>
    </div>
  )
}

export default CalendarProvider

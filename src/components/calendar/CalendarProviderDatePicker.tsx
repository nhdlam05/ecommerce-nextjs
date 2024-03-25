import { useMutation, useQuery } from '@apollo/client'
import { DatetimeChangeEventDetail, IonDatetime } from '@ionic/react'
import Button from 'atoms/Button/Button'
import { DialogContent, DialogFooter } from 'atoms/Dialog'
import Loader from 'atoms/Loader/Loader'
import Section from 'atoms/Section/Section'
import Text from 'atoms/Text/Text'
import Title from 'atoms/Title/Title'
import { ModalContext } from 'context/modal'
import { AvailabilityEvent, OverrideEvent, OverrideEventType } from 'generated/graphql'
import {
  GET_OVERRIDE_EVENTS_FOR_DATE,
  GET_WEEKLY_AVAILABILITY_EVENTS_FOR_DAY,
  UPDATE_BUSY_OVERRIDE_EVENT,
  UPDATE_OVERRIDE_EVENTS
} from 'gql/schedule'
import { useTranslationWithContext } from 'hooks'
import { TimeInterval, WEEK_DAYS_TO_MOMENT_INDEX } from 'model/calendar'
import moment, { Moment } from 'moment'
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { IoMdAdd } from 'react-icons/io'
import { validateOverlappingPeriod } from 'util/time/formatTime'
import { v4 as uuidv4 } from 'uuid'
import './CalendarProviderDatePicker.scss'
import { refetchOption } from './CalendarProviderOverrides'
import CalendarTimeInterval from './CalendarTimeInterval'

interface Props {
  openingDay: Moment
}

type OverrideTimeInterval = {
  id: string
  eventType: OverrideEventType
} & TimeInterval

const MAX_START_TIME = moment('22:45', 'HH:mm')

const CalendarProviderDatePicker: React.FC<Props> = ({ openingDay }) => {
  const preSelectedDate = useRef<Moment | null>(null)
  const { hideModal } = useContext(ModalContext)
  const [selectedDate, setSelectedDate] = useState<Moment>(openingDay)
  const [isLoading, setIsLoading] = useState(false)
  const { translate } = useTranslationWithContext()
  const [error, setError] = useState<string | null>(null)
  const [overrideTimeIntervals, setOverrideTimeInterval] = useState<OverrideTimeInterval[]>([])
  const [dataModified, setDataModified] = useState(false)

  // query to get daily schedule - fallback if user has no override event set for today
  const { refetch: fetchWeeklyAvailability } = useQuery<{
    availabilityEvent: AvailabilityEvent[]
  }>(GET_WEEKLY_AVAILABILITY_EVENTS_FOR_DAY, {
    // variables: {weekDay: WEEK_DAYS[selectedDate.day()]},
    skip: true
  })

  // query to get current date's override events - should only been invoked if openening day is set (when the date picker modal is shown)
  const { refetch: fetchOverrideEventData } = useQuery<{
    overrideEvents: OverrideEvent[]
  }>(GET_OVERRIDE_EVENTS_FOR_DATE, {
    // variables: {date: selectedDate.format('YYYY-MM-DD')},
    skip: true
  })

  const [updateBusyOverrideEvent] = useMutation(UPDATE_BUSY_OVERRIDE_EVENT, refetchOption)
  const [updateNonBusyOverrideEvent] = useMutation(UPDATE_OVERRIDE_EVENTS, refetchOption)

  /**
   * fetch override event data for chosen date
   * if it not exists, fetch the time interval from weekly schedule
   */
  async function fetchCurrentDateData(date: Moment) {
    const { data: overrideEventData } = await fetchOverrideEventData({
      date: date.format('YYYY-MM-DD')
    })
    const overrideEvents = overrideEventData?.overrideEvents

    if (overrideEvents && overrideEvents.length > 0) {
      setOverrideTimeInterval(
        overrideEventData.overrideEvents.map(e => ({
          id: e.id,
          startTime: e.startTime,
          endTime: e.endTime,
          eventType: e.type
        }))
      )
    } else {
      const { data: weeklyAvailabilityData } = await fetchWeeklyAvailability({
        weekDay: WEEK_DAYS_TO_MOMENT_INDEX[date.day()]
      })
      if (weeklyAvailabilityData && weeklyAvailabilityData.availabilityEvent) {
        setOverrideTimeInterval(
          weeklyAvailabilityData.availabilityEvent.map(e => ({
            id: e.id,
            startTime: e.startTime,
            endTime: e.endTime,
            eventType: OverrideEventType.Available
          }))
        )
      }
    }
  }

  useEffect(() => {
    setIsLoading(true)

    setSelectedDate(openingDay)
    fetchCurrentDateData(openingDay)

    setIsLoading(false)
  }, [openingDay])

  const handleCalendarDayChange = useCallback(
    async (event: CustomEvent<DatetimeChangeEventDetail>) => {
      preSelectedDate.current = selectedDate
      const {
        detail: { value: newDate }
      } = event

      if (newDate) {
        setIsLoading(true)
        setSelectedDate(moment(newDate))
        await fetchCurrentDateData(moment(newDate))
        setError(null)
        setIsLoading(false)
      }
    },
    [dataModified, error, preSelectedDate.current]
  )

  const updateTime = async () => {
    if (preSelectedDate.current) {
      setDataModified(false)
      await updateData(preSelectedDate.current)
    }
  }

  useEffect(() => {
    if (dataModified && !error && preSelectedDate.current) {
      updateTime()
    }
  }, [preSelectedDate.current])

  async function handleDelete(id: string) {
    setIsLoading(true)
    setDataModified(true)

    const nonDeletedEvents = overrideTimeIntervals.filter(e => e.id !== id)
    setOverrideTimeInterval(nonDeletedEvents)

    setIsLoading(false)
  }

  function validateOverlapping(validatedInterval: TimeInterval, id: string | null): boolean {
    const currentIntervals = overrideTimeIntervals
      .filter(e => e.id !== id || id == null)
      .map(e => ({
        startTime: e.startTime,
        endTime: e.endTime
      }))

    return validateOverlappingPeriod(validatedInterval, currentIntervals)
  }

  function calculateNewTimeInterval() {
    let start = '06:00'
    let end = '07:00'
    if (overrideTimeIntervals.length > 0) {
      start = overrideTimeIntervals[overrideTimeIntervals.length - 1].endTime
      let endDuration = moment(start, 'HH:mm').add(1, 'hour')
      if (endDuration.isAfter(MAX_START_TIME)) {
        endDuration = MAX_START_TIME
      }
      end = endDuration.format('HH:mm')
    }

    return { start, end }
  }

  function shouldDisableAddButton() {
    if (isLoading) {
      return true
    }

    if (hasBusyOverrideInterval()) {
      return false
    }

    // if user already has a time interval at max time, then not allow him to add new interval
    return (
      overrideTimeIntervals.length > 0 &&
      moment(overrideTimeIntervals[overrideTimeIntervals.length - 1].endTime, 'HH:mm').isSameOrAfter(MAX_START_TIME)
    )
  }

  async function handleUpdate(id: string, startTime: string, endTime: string) {
    setIsLoading(true)
    setDataModified(true)

    if (validateOverlapping({ startTime, endTime }, id)) {
      setError(translate('calendar.provider.error.overlappingPeriods'))
    } else {
      setError(null)

      // modify the updated event in the list
      const updatedEvent = [...overrideTimeIntervals]
      updatedEvent[updatedEvent.findIndex(e => e.id === id)] = {
        id,
        startTime,
        endTime,
        eventType: OverrideEventType.Available
      }
      setOverrideTimeInterval(updatedEvent)
    }
    setIsLoading(false)
  }

  function renderCalendarTimeInterval(event: OverrideTimeInterval) {
    return <CalendarTimeInterval key={event.id} {...event} handleDelete={handleDelete} handleUpdate={handleUpdate} />
  }

  function handleCreateNewTimeInterval() {
    setIsLoading(true)
    setDataModified(true)

    if (hasBusyOverrideInterval()) {
      setOverrideTimeInterval([
        {
          id: uuidv4(),
          startTime: '06:00',
          endTime: '07:00',
          eventType: OverrideEventType.Available
        }
      ])
    } else {
      const { start, end } = calculateNewTimeInterval()

      if (validateOverlapping({ startTime: start, endTime: end }, null)) {
        setError(translate('calendar.provider.error.overlappingPeriods'))
      } else {
        setError(null)
        setOverrideTimeInterval([
          ...overrideTimeIntervals,
          {
            id: uuidv4(),
            startTime: start,
            endTime: end,
            eventType: OverrideEventType.Available
          }
        ])
      }
    }

    setIsLoading(false)
  }

  async function updateData(newDate?: Moment) {
    const date = newDate || selectedDate
    if (error || !dataModified) {
      return
    }

    if (overrideTimeIntervals.length == 0) {
      // set the whole day as busy
      await updateBusyOverrideEvent({
        variables: { date: date.format('YYYY-MM-DD') }
      })
    } else {
      // update time interval
      const overrideEventUpdateInput = {
        events: overrideTimeIntervals.map(i => ({
          date: date.format('YYYY-MM-DD'),
          startTime: i.startTime,
          endTime: i.endTime
        }))
      }
      await updateNonBusyOverrideEvent({
        variables: { overrideEventUpdateInput }
      })
    }
  }

  async function onMainActionClick() {
    setIsLoading(true)
    await updateData()
    setIsLoading(false)
    hideModal()
  }

  function onSecondaryActionClick() {
    hideModal()
  }

  function hasBusyOverrideInterval() {
    return overrideTimeIntervals && overrideTimeIntervals.filter(e => e.eventType === OverrideEventType.Busy).length > 0
  }

  function renderTimeInterval() {
    if (overrideTimeIntervals.length == 0 || hasBusyOverrideInterval()) {
      return <Text size='m'>{translate('generic.unavailable')}</Text>
    }

    return <>{overrideTimeIntervals.map(e => renderCalendarTimeInterval(e))}</>
  }

  return (
    <>
      <DialogContent>
        <div className='CalendarProviderDatePicker'>
          <div className='CalendarProviderDatePicker-container'>
            <IonDatetime
              presentation='date'
              onIonChange={handleCalendarDayChange}
              firstDayOfWeek={1}
              locale='de-DE'
              min={moment().toISOString(true)}
              value={selectedDate.toISOString(true)}
            />
          </div>

          <div className='CalendarProviderDatePicker--intervals'>
            {!isLoading ? (
              <div>
                {error && (
                  <Section spacing='xs'>
                    <Text size='s' theme='danger' align='left'>
                      {error}
                    </Text>
                  </Section>
                )}
                <div className='gf gf_h_apart'>
                  <div>
                    <Title size='s'>{translate('calendar.provider.overrides.datePicker.available.title')}</Title>
                  </div>

                  {/* Add new time */}
                  <div>
                    <Button
                      theme='white'
                      size='s'
                      label={<IoMdAdd size={20} />}
                      disabled={shouldDisableAddButton()}
                      onClick={handleCreateNewTimeInterval}
                    />
                  </div>
                </div>

                <div>{renderTimeInterval()}</div>
              </div>
            ) : (
              <Loader />
            )}
          </div>
        </div>
      </DialogContent>
      <DialogFooter>
        <Section>
          <Button label={translate('generic.save')} onClick={onMainActionClick} disabled={!!error || isLoading} />
        </Section>
        <Button label={translate('generic.cancel')} variant='naked' onClick={onSecondaryActionClick} />
      </DialogFooter>
    </>
  )
}

export default CalendarProviderDatePicker

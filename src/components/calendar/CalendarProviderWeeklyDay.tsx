import { useMutation } from '@apollo/client'
import * as Sentry from '@sentry/capacitor'
import Button from 'atoms/Button/Button'
import Section from 'atoms/Section/Section'
import Text from 'atoms/Text/Text'
import Title from 'atoms/Title/Title'
import { AvailabilityEvent, WeekDay } from 'generated/graphql'
import {
  CREATE_AVAILABILITY_EVENT,
  DELETE_AVAILABILITY_EVENT,
  GET_ACTIVE_OVERRIDE_EVENTS,
  GET_WEEKLY_AVAILABILITY_EVENTS,
  UPDATE_AVAILABILITY_EVENT
} from 'gql/schedule'
import { useTranslationWithContext } from 'hooks'
import WEEK_DAY_TRANSLATION_KEY, { TimeInterval } from 'model/calendar'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { IoMdAdd } from 'react-icons/io'
import { validateOverlappingPeriod } from 'util/time/formatTime'
import './CalendarProviderWeeklyDay.scss'
import CalendarTimeInterval from './CalendarTimeInterval'

interface Props {
  weekDay: WeekDay
  events: AvailabilityEvent[]
}

const MAX_START_TIME = moment('22:45', 'HH:mm')

const refetchOption = {
  refetchQueries: [
    {
      query: GET_WEEKLY_AVAILABILITY_EVENTS
    },
    {
      query: GET_ACTIVE_OVERRIDE_EVENTS
    }
  ],
  awaitRefetchQueries: true
}

const CalendarProviderWeeklyDay: React.FC<Props> = ({ weekDay, events }) => {
  const { translate } = useTranslationWithContext()

  const [deleteAvailabilityEvent] = useMutation(DELETE_AVAILABILITY_EVENT, refetchOption)
  const [updateAvailabilityEvent] = useMutation(UPDATE_AVAILABILITY_EVENT, refetchOption)
  const [createAvailabilityEvent] = useMutation(CREATE_AVAILABILITY_EVENT, refetchOption)

  const [currentEvents, setCurrentEvents] = useState<AvailabilityEvent[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setCurrentEvents(events)
  }, [])

  async function handleDelete(id: string) {
    setIsProcessing(true)

    await deleteAvailabilityEvent({ variables: { id } })
    const nonDeletedEvents = currentEvents.filter(e => e.id !== id)

    setCurrentEvents(nonDeletedEvents)
    setIsProcessing(false)
  }

  function validateOverlapping(validatedInterval: TimeInterval, id: string | null): boolean {
    const currentIntervals = currentEvents
      .filter(e => e.id !== id || id == null)
      .map(e => ({
        startTime: e.startTime,
        endTime: e.endTime
      }))

    return validateOverlappingPeriod(validatedInterval, currentIntervals)
  }

  async function handleUpdate(id: string, startTime: string, endTime: string) {
    setIsProcessing(true)

    if (validateOverlapping({ startTime, endTime }, id)) {
      setError(translate('calendar.provider.error.overlappingPeriods'))
    } else {
      setError(null)
      try {
        const { data } = await updateAvailabilityEvent({
          variables: {
            updateInput: {
              id,
              startTime,
              endTime,
              isFullDay: false
            }
          }
        })

        // modify the updated event in the list
        const updatedEvent = [...currentEvents]
        updatedEvent[updatedEvent.findIndex(e => e.id === id)] = data.updateAvailabilityEvent
        setCurrentEvents(updatedEvent)
      } catch (e: any) {
        setError(e.message)
        Sentry.captureException(e)
      }
    }
    setIsProcessing(false)
  }

  async function handleCreateNewTimeInterval() {
    setIsProcessing(true)
    const { start, end } = calculateNewTimeInterval()

    if (validateOverlapping({ startTime: start, endTime: end }, null)) {
      setError(translate('calendar.provider.error.overlappingPeriods'))
    } else {
      setError(null)
      try {
        const { data } = await createAvailabilityEvent({
          variables: {
            createInput: {
              startTime: start,
              endTime: end,
              isFullDay: false,
              weekDay: weekDay
            }
          }
        })
        setCurrentEvents([...currentEvents, data.createAvailabilityEvent])
      } catch (e: any) {
        setError(e.message)
        Sentry.captureException(e)
      }
    }
    setIsProcessing(false)
  }

  function calculateNewTimeInterval() {
    let start = '06:00'
    let end = '07:00'
    if (currentEvents.length > 0) {
      start = currentEvents[currentEvents.length - 1].endTime
      let endDuration = moment(start, 'HH:mm').add(1, 'hour')
      if (endDuration.isAfter(MAX_START_TIME)) {
        endDuration = MAX_START_TIME
      }
      end = endDuration.format('HH:mm')
    }

    return { start, end }
  }

  function renderCalendarTimeInterval(event: AvailabilityEvent) {
    return <CalendarTimeInterval key={event.id} {...event} handleDelete={handleDelete} handleUpdate={handleUpdate} />
  }

  function renderTimeInterval() {
    if (currentEvents.length == 0) {
      return <Text size='m'>{translate('generic.unavailable')}</Text>
    }

    return <>{currentEvents.map(e => renderCalendarTimeInterval(e))}</>
  }

  function shouldDisableAddButton() {
    if (isProcessing) {
      return true
    }

    // if user already has a time interval at max time, then not allow him to add new interval
    return (
      currentEvents.length > 0 &&
      moment(currentEvents[currentEvents.length - 1].endTime, 'HH:mm').isSameOrAfter(MAX_START_TIME)
    )
  }

  return (
    <div className='CalendarProviderWeeklyDay'>
      <div className='CalendarProviderWeeklyDay--inner'>
        {/* Day */}
        <div className='gf gf_h_apart'>
          <div>
            <Title size='m'>{translate(WEEK_DAY_TRANSLATION_KEY[weekDay])}</Title>
          </div>

          {/* Add new time */}
          <div>
            <Button
              theme='white'
              disabled={shouldDisableAddButton()}
              label={<IoMdAdd size={20} />}
              size='s'
              onClick={handleCreateNewTimeInterval}
            />
          </div>
        </div>

        {/* Time Intervals */}
        <div>{renderTimeInterval()}</div>
        {error && (
          <Section spacing='xs'>
            <Text size='s' theme='danger' align='left'>
              {error}
            </Text>
          </Section>
        )}
      </div>
    </div>
  )
}

export default CalendarProviderWeeklyDay

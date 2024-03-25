import { useMutation, useQuery } from '@apollo/client'
import Button from 'atoms/Button/Button'
import Loader from 'atoms/Loader/Loader'
import Section from 'atoms/Section/Section'
import Text from 'atoms/Text/Text'
import Title from 'atoms/Title/Title'
import { DialogMode, ModalContext } from 'context/modal'
import { DailyOverrideEvent } from 'generated/graphql'
import { DELETE_OVERRIDE_EVENTS, GET_ACTIVE_OVERRIDE_EVENTS } from 'gql/schedule'
import { useTranslationWithContext } from 'hooks'
import moment from 'moment'
import { useContext, useState } from 'react'
import CalendarProviderDatePicker from './CalendarProviderDatePicker'
import CalendarProviderOverrideItem from './CalendarProviderOverrideItem'
import './CalendarProviderOverrides.scss'

export const refetchOption = {
  refetchQueries: [
    {
      query: GET_ACTIVE_OVERRIDE_EVENTS
    }
  ],
  awaitRefetchQueries: true
}

const CalendarProviderOverrides = () => {
  const { showModal } = useContext(ModalContext)
  const { translate } = useTranslationWithContext()
  const [isProcessing, setIsProcessing] = useState(false)

  const { data: activeOverrides, loading } = useQuery<{
    activeOverrideEvents: DailyOverrideEvent[]
  }>(GET_ACTIVE_OVERRIDE_EVENTS)
  const [deleteOverrideEvents] = useMutation(DELETE_OVERRIDE_EVENTS, refetchOption)

  function handleCalendarOpen() {
    showModal(<CalendarProviderDatePicker openingDay={moment()} />, {
      mode: DialogMode.Custom,
      title: translate('calendar.provider.overrides.mainAction')
    })
  }

  function handleOnItemClick(date: string) {
    showModal(<CalendarProviderDatePicker openingDay={moment(date)} />, {
      mode: DialogMode.Custom,
      title: translate('calendar.provider.overrides.mainAction')
    })
  }

  async function handleOnItemDelete(date: string) {
    setIsProcessing(true)
    await deleteOverrideEvents({
      variables: {
        date
      }
    })
    setIsProcessing(false)
  }

  function renderActiveOverrideEvents(overrideEvent: DailyOverrideEvent) {
    if (loading) {
      return null
    }

    return (
      <CalendarProviderOverrideItem
        key={overrideEvent.date}
        {...overrideEvent}
        disabled={isProcessing}
        handleOnItemDelete={handleOnItemDelete}
        handleOnItemClick={handleOnItemClick}
      />
    )
  }

  return (
    <div className='CalendarProviderOverrides'>
      <div className='CalendarProviderOverrides--header'>
        <Section spacingBottom='s'>
          <Title size='m'>{translate('calendar.provider.overrides.title')}</Title>
          <Text size='s'>{translate('calendar.provider.overrides.subtitle')}</Text>
        </Section>

        <Section spacingBottom='s'>
          <Button
            label={translate('calendar.provider.overrides.mainAction')}
            onClick={handleCalendarOpen}
            align='center'
          />
        </Section>
      </div>

      {activeOverrides && (
        <Section spacingBottom='s'>
          {loading && <Loader />}
          {!loading && activeOverrides.activeOverrideEvents.map(d => renderActiveOverrideEvents(d))}
        </Section>
      )}
    </div>
  )
}

export default CalendarProviderOverrides

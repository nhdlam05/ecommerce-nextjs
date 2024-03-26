import i18n from 'i18next'
import moment, { Moment } from 'moment'
import 'moment/locale/de'
import 'moment/locale/fr'
import 'moment/locale/it'

export const convertDateToRangeDate = (date: Moment) => ({
  startDate: date.startOf('month').format('YYYY-MM-DD'),
  endDate: date.endOf('month').format('YYYY-MM-DD')
})

export function renderFriendlyTimestampString(bookedAtString: string): string {
  const locale: any = i18n.language

  const bookedAt = moment(bookedAtString)
  const today = moment().startOf('day')
  const dateDiff = bookedAt.diff(today, 'days', true)

  if (dateDiff >= 0 && dateDiff < 1) {
    return `${i18n.t('generic.today')} ${bookedAt.locale(locale).format(`[${i18n.t('generic.at')}] HH:mm`)}`
  }

  return bookedAt.locale(locale).format(`dddd, Do MMMM [${i18n.t('generic.at')}] HH:mm`)
}

export function renderFriendlyTimestampWithDurationString(bookedAtString: string, duration: number): string {
  const locale: any = i18n.language

  const bookedAt = moment(bookedAtString)
  const today = moment().startOf('day')
  const dateDiff = bookedAt.diff(today, 'days', true)

  const bookingEndedAt = bookedAt.clone().add(duration, 'minute')

  const bookingEndedAtMinute = bookingEndedAt.locale(locale).format('HH:mm')

  if (dateDiff >= 0 && dateDiff < 1) {
    return `${i18n.t('generic.today')} ${bookedAt.locale(locale).format('[,] HH:mm')}-${bookingEndedAtMinute}`
  }

  return `${bookedAt.locale(locale).format('dddd, Do MMMM [,] HH:mm')}-${bookingEndedAtMinute}`
}

export function renderSimplifiedFriendlyTimestampString(bookedAtString: string): string {
  const locale: any = i18n.language

  const bookedAt = moment(bookedAtString)
  const today = moment().startOf('day')
  const dateDiff = bookedAt.diff(today, 'days', true)

  if (dateDiff >= 0 && dateDiff < 1) {
    return `${bookedAt.locale(locale).format('HH:mm')}`
  }
  if (dateDiff < 0 && dateDiff >= -1) {
    return `${i18n.t('generic.yesterday')}, ${bookedAt.locale(locale).format('HH:mm')}`
  }

  return bookedAt.locale(locale).format('l')
}

export function renderFriendlyTimestampStringWithPreviousText(bookedAtString: string): string {
  const locale: any = i18n.language

  const bookedAt = moment(bookedAtString)
  const today = moment().startOf('day')
  const dateDiff = bookedAt.diff(today, 'days', true)
  const timeLabel = 'clock'

  if (dateDiff >= 0 && dateDiff < 1) {
    return `${i18n.t('generic.today').toLowerCase()} ${bookedAt
      .locale(locale)
      .format(`[${i18n.t('generic.at')}] HH:mm [${timeLabel}]`)}`
  }

  return bookedAt
    .locale(locale)
    .format(`[${i18n.t('generic.on')}] dddd, Do MMMM [${i18n.t('generic.at')}] HH:mm [${timeLabel}]`)
}

export function renderFriendlyWeekDay(dateString: string): string {
  const locale: any = i18n.language

  const date = moment(dateString)
  const today = moment().startOf('day')
  const dateDiff = date.diff(today, 'days', false)

  if (dateDiff >= 0 && dateDiff < 2) {
    return dateDiff === 0 ? i18n.t('generic.today') : i18n.t('generic.tomorrow')
  }

  return date.locale(locale).format('dddd')
}

export function renderFriendlyWeekDayWithTimestamp(timestamp: string): string {
  const locale: any = i18n.language

  const date = moment(timestamp)

  return `${renderFriendlyWeekDay(timestamp)} ${date.locale(locale).format(`[${i18n.t('generic.at')}] HH:mm`)}`
}

export function renderFriendlyDateString(date: Moment): string {
  const locale: any = i18n.language

  const today = moment().startOf('day')
  const dateDiff = date.diff(today, 'days', false)

  if (dateDiff >= 0 && dateDiff < 2) {
    return dateDiff === 0 ? i18n.t('generic.today') : i18n.t('generic.tomorrow')
  }

  return date.locale(locale).format('dddd, Do MMMM')
}

export function renderFriendlyHoursMintues(bookedAtString: string): string {
  const locale: any = i18n.language

  const bookedAt = moment(bookedAtString)

  return bookedAt.locale(locale).format('HH:mm')
}

export function renderFriendlyDate(dateString: string): string {
  const locale: any = i18n.language

  const date = moment(dateString)

  return date.locale(locale).format('Do MMMM')
}

export function renderDateTime(dateString: string | Moment, format: string): string {
  const locale: any = i18n.language

  const date = moment(dateString)

  return date.locale(locale).format(format)
}

/*

    Generate a list of time with X min interval. 
    Mainly used for the Provider's calendar. 

*/
const START_HOUR = 6 // start at 6am
const END_HOUR = 23 // end at 11pm
const quarterHours = ['00', '15', '30', '45']

function generateTimeSlotList(start_hour = START_HOUR, end_hour = END_HOUR) {
  const timeSlots = []
  for (let i = start_hour; i < end_hour; i++) {
    for (let j = 0; j < 4; j++) {
      const ni = ('0' + i).slice(-2)
      const label = ni + ':' + quarterHours[j]
      timeSlots.push({ label, value: moment(label, 'HH:mm') })
    }
  }

  return timeSlots
}

export const TIME_SLOT_TO_MOMENT_TIME = new Map(generateTimeSlotList().map(t => [t.label, t.value]))
export const AVAILABLE_TIME_SLOTS = generateTimeSlotList().map(t => t.label)

/*

    Render Session Duration in min

*/

export function renderSessionDurationInText(duration: number) {
  switch (duration) {
    case 15:
    case 30:
    case 45:
      return duration + 'min'
    case 60:
      return '1h'
    case 90:
      return '1h30'
    default:
      return duration + 'min'
  }
}

export const calculateDayOld = (date: string) => {
  const today = moment().startOf('day')
  const dayOld = Math.round(today.diff(moment(date), 'days', true))
  if (dayOld < 8) {
    return {
      num: dayOld,
      unit: i18n.t('generic.day', { count: dayOld })
    }
  } else if (dayOld > 30) {
    const monthOld = Math.round(dayOld / 30)

    return {
      num: monthOld,
      unit: i18n.t('generic.month', { count: monthOld })
    }
  } else {
    const weekOld = Math.round(dayOld / 7)

    return {
      num: Math.round(dayOld / 7),
      unit: i18n.t('generic.week', { count: weekOld })
    }
  }
}

// reminders should only happen between start hour and end hour
const ALLOWED_START_HOUR = 9
const ALLOWED_END_HOUR = 23
const ROUND_TO_MINUTES = 15

export function calculateReminderDateTime(interval: number, reminderTime: string): Date {
  if (!reminderTime) {
    // TODO: MOVE THIS LOGIC TO USE moment
    const roundMs = 1000 * 60 * ROUND_TO_MINUTES
    const date = new Date()

    // round time
    date.setTime(Math.round(date.getTime() / roundMs) * roundMs)

    // add provided interval in hours
    date.setHours(date.getHours() + interval)

    // postpone reminder to the morning / next day, if it would occur at night
    const h = date.getHours()
    const m = date.getMinutes()
    const isTooLate = h > ALLOWED_END_HOUR || (h === ALLOWED_END_HOUR && m > 0)
    const isTooEarly = h < ALLOWED_START_HOUR

    if (isTooLate) {
      date.setDate(date.getDate() + 1)
    }
    if (isTooLate || isTooEarly) {
      date.setHours(ALLOWED_START_HOUR, 0)
    }

    return date
  } else {
    const today = moment(new Date())
    const scheduledReminder = today.add(interval, 'hours')

    const fixedReminderTime = moment(reminderTime, 'HH:mm')

    scheduledReminder.hour(fixedReminderTime.hour()).minute(fixedReminderTime.minute())

    return scheduledReminder.toDate()
  }
}

export function roundingBookedTime(time: Moment) {
  const currentMin = time.get('minute')

  if (currentMin <= 15) return time.add('minute', 15 - currentMin)

  if (currentMin <= 30) return time.add('minute', 30 - currentMin)

  if (currentMin <= 45) return time.add('minute', 45 - currentMin)

  return time.subtract('minute', currentMin).add('hour', 1)
}

export function renderFriendlyTimeRange(startDate: string, endDate: string) {
  const startTime = moment(startDate).format('HH:mm')
  const endTime = moment(endDate).format('HH:mm')
  const day = moment(startDate).format('DD.MM.YY')

  return `${startTime} - ${endTime} ${day}`
}

export function renderFriendlyDateInfo(date: Moment, variant?: 'short' | 'full'): string {
  const locale: any = i18n.language

  const today = moment().startOf('day')
  const dateDiff = date.diff(today, 'days', false)

  if (dateDiff >= 0 && dateDiff < 2) {
    if (variant === 'short') {
      return dateDiff == 0 ? i18n.t('generic.today') : i18n.t('generic.tomorrow')
    }

    return dateDiff == 0 ? i18n.t('generic.today').toLowerCase() : i18n.t('generic.tomorrow').toLowerCase()
  }

  return date.locale(locale).format(`[${i18n.t('generic.from')}] dd. Do MMM`)
}

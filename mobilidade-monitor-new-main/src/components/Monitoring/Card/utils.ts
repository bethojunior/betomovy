import Utils from '@/utils/Utils'

type TripLike = Partial<TripDto> | Partial<TripActive> | undefined

const normalizeDateValue = (value: string | Date | undefined | null) => {
  if (!value) return null

  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value
  }

  if (typeof value === 'string') {
    const trimmed = value.trim()
    if (!trimmed) return null
    const normalizedString = trimmed.includes('T') ? trimmed : trimmed.replace(' ', 'T')
    const parsed = new Date(normalizedString)
    if (!Number.isNaN(parsed.getTime())) {
      return parsed
    }
  }

  return null
}

export const formatTripDateTime = (trip?: TripDto | TripActive) => {
  const tripLike = trip as TripLike

  const candidateValues = [
    tripLike?.schedule,
    (tripLike as TripDto)?.date?.date,
    tripLike?.date,
    (tripLike as TripDto)?.requestDate,
    (tripLike as TripDto)?.createdAt
  ]

  const resolvedDate =
    candidateValues.map(normalizeDateValue).find((dateValue) => dateValue != null) ?? null

  if (!resolvedDate) {
    return {
      dateLabel: null,
      timeLabel: null,
      dateTimeLabel: null
    }
  }

  const dateLabel = Utils.formatTripDate(resolvedDate.toISOString())
  const timeLabel = Utils.formatTime(resolvedDate)
  const dateTimeLabel = `${dateLabel}${timeLabel ? ` ${timeLabel}` : ''}`

  return {
    dateLabel,
    timeLabel,
    dateTimeLabel
  }
}

import { EventItemInterface } from '../components/Trip/Details/Header/types'

export interface NormalizedTripEvent {
  lng: number
  lat: number
  timestampIso: string | undefined
}

export const normalizeTripEvent = (event: EventItemInterface): NormalizedTripEvent => {
  const driverLocation = event.driver_location ?? event.data?.driver?.location
  const parsedLng = parseFloat(driverLocation?.longitude ?? event.data?.longitude ?? '0')
  const parsedLat = parseFloat(driverLocation?.latitude ?? event.data?.latitude ?? '0')
  const lng = Number.isFinite(parsedLng) ? parsedLng : 0
  const lat = Number.isFinite(parsedLat) ? parsedLat : 0
  const timestampIso =
    event.created_at ?? event.date ?? event.data?.driver?.location?.created_at
  return { lng, lat, timestampIso }
}

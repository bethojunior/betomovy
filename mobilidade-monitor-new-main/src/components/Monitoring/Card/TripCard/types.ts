export type TripCardStatus =
  | 'searching'
  | 'searching_favorite'
  | 'pre_accepted'
  | 'accepted'
  | 'boarding'
  | 'in_progress'
  | 'waiting'
  | 'scheduled'

export interface StatusConfig {
  title: string
  gradientClass: string
  showDriver: boolean
  showProgress: boolean
  showAlertButton: boolean
  showCollapse: boolean
  showDriversCalled: boolean
  showEstimatedArrival: boolean
  showRequestTime: boolean
  layout: 'simple' | 'detailed'
}

export interface TripCardProps {
  tripReference: string
  tripData?: TripDto
}

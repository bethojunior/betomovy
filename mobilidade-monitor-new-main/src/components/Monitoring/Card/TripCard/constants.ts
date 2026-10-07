import { StatusConfig, TripCardStatus } from './types'

export const statusConfig: Record<TripCardStatus, StatusConfig> = {
  searching: {
    title: 'Solicitando Motorista',
    gradientClass: 'gradientRed',
    showDriver: false,
    showProgress: false,
    showAlertButton: false,
    showCollapse: false,
    showDriversCalled: true,
    showEstimatedArrival: false,
    showRequestTime: true,
    layout: 'simple'
  },
  searching_favorite: {
    title: 'Solicitando Motorista',
    gradientClass: 'gradientRed',
    showDriver: false,
    showProgress: false,
    showAlertButton: false,
    showCollapse: false,
    showDriversCalled: true,
    showEstimatedArrival: false,
    showRequestTime: true,
    layout: 'simple'
  },
  pre_accepted: {
    title: 'Aceita por motorista em viagem',
    gradientClass: 'gradientYellow',
    showDriver: true,
    showProgress: false,
    showAlertButton: false,
    showCollapse: true,
    showDriversCalled: false,
    showEstimatedArrival: false,
    showRequestTime: false,
    layout: 'detailed'
  },
  accepted: {
    title: 'Motorista aceitou a viagem',
    gradientClass: 'gradientYellow',
    showDriver: true,
    showProgress: false,
    showAlertButton: false,
    showCollapse: true,
    showDriversCalled: false,
    showEstimatedArrival: true,
    showRequestTime: false,
    layout: 'detailed'
  },
  boarding: {
    title: 'Motorista esperando cliente',
    gradientClass: 'gradientYellow',
    showDriver: true,
    showProgress: false,
    showAlertButton: false,
    showCollapse: true,
    showDriversCalled: false,
    showEstimatedArrival: true,
    showRequestTime: false,
    layout: 'detailed'
  },
  in_progress: {
    title: 'Em viagem',
    gradientClass: 'gradientGreen',
    showDriver: true,
    showProgress: true,
    showAlertButton: true,
    showCollapse: true,
    showDriversCalled: false,
    showEstimatedArrival: false,
    showRequestTime: false,
    layout: 'detailed'
  },
  waiting: {
    title: 'Em viagem',
    gradientClass: 'gradientGreen',
    showDriver: true,
    showProgress: true,
    showAlertButton: true,
    showCollapse: true,
    showDriversCalled: false,
    showEstimatedArrival: false,
    showRequestTime: false,
    layout: 'detailed'
  },
  scheduled: {
    title: 'Corrida agendada',
    gradientClass: 'gradientScheduled',
    showDriver: false,
    showProgress: false,
    showAlertButton: false,
    showCollapse: false,
    showDriversCalled: true,
    showEstimatedArrival: false,
    showRequestTime: true,
    layout: 'simple'
  }
}

statusConfig.waiting = statusConfig.in_progress

export const getStatusConfig = (status: string): StatusConfig => {
  return statusConfig[status as TripCardStatus] || statusConfig.searching
}

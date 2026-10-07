export interface ClientData {
  date: string
  timezone: string
  timezone_type: number
  document: string
  email: string
  idCustomer: string
  idUser: string
  isDependent: boolean
  name: string
  nickname: string
  phone: string
  profileImage: string
  quantityTripsFinished: number
  rg: string
  status: string
  voucherBalance: string
}

export type ModalType = 'driver' | 'client'

export interface SelectedMonitoringArea {
  id: number
  name: string
  cityId: number
  active: number
  area: { lat: number; lng: number }[]
}

export interface ModalProps {
  type: ModalType
  isVisible: boolean
  setIsVisible: (visible: boolean) => void
  selectedArea?: SelectedMonitoringArea | null
  onDriverSelect?: (driver: DriverRealtime) => void
  onClientSelect?: (client: ClientData) => void
  driverRecencyMode?: 'all' | 'recent'
}

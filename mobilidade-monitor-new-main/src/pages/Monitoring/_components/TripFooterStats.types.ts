export interface TripOption {
  id: number | string
  price: number | string
  tripTypeId: number | string
  tripTypeName?: string
}

export interface TripDetail {
  id: number | string
  tripReference?: string
  date?: string
  created_at?: string
  customerName?: string
  customer?: { name: string }
  cancelReason?: string
  originAddress?: string
  destinationAddress?: string
  price?: number | string
  customerPhone?: string
  canceledBy?: string
  status?: string
  is_abandoned?: boolean
  tripTypeName?: string
  priceName?: string
  tripOptions?: TripOption[]
}

export interface TripQuantities {
  totalTodayTrips: number
  totalAcceptedTrips: number
  quantityTripsFinished: number
  totalCanceledByDriver: number
  totalCanceledByCustomer: number
  totalCanceledByAdmin: number
  totalMoneyTrips: number
  totalVoucherTrips: number
  totalCardTrips: number
  quantityTripsNotAnswered: number
  quantityCustomersNotAnswered: number
  lostCustomersNotAnswered: number
  totalPrice: string | number
  totalPriceFinished: string | number
}

export interface TripDetailsListProps {
  trips: TripDetail[]
  loading: boolean
  emptyMessage: string
  loadingMessage: string
  showCancelReason?: boolean
  onWhatsAppClick: (options: { phone: string; name?: string; message?: string }) => void
  onDetailsClick: (tripReference: string) => void
  formatTime: (dateString: string) => string
  formatPrice: (price: number | string) => string
  buildWhatsAppMessage?: (trip: TripDetail) => string | undefined
}


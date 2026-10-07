import { Spin } from 'antd'
import React, { useState } from 'react'
import { FaWhatsapp } from 'react-icons/fa'
import { FiChevronDown } from 'react-icons/fi'
import {
  ButtonsContainer,
  CanceledByTag,
  DetailsLink,
  RouteLine,
  RouteMarker,
  RouteRow,
  RouteText,
  RouteTrack,
  TripOptionChip,
  TripOptionPreview,
  TripOptionPrice,
  TripOptionsLabel,
  TripOptionsToggle,
  TripOptionsWrapper,
  TripDetailItem,
  TripInfo,
  TripParticipant,
  TripPrice,
  TripReason,
  TripRoute,
  TripTime,
  WhatsAppButton
} from './styles'
import { TripDetailsListProps } from './TripFooterStats.types'

const CANCELED_BY_LABEL: Record<string, string> = {
  customer: 'Cliente',
  driver: 'Motorista',
  admin: 'Admin'
}

export const TripDetailsList: React.FC<TripDetailsListProps> = ({
  trips,
  loading,
  emptyMessage,
  loadingMessage,
  showCancelReason = false,
  onWhatsAppClick,
  onDetailsClick,
  formatTime,
  formatPrice,
  buildWhatsAppMessage
}) => {
  const [expandedTrips, setExpandedTrips] = useState<Record<string, boolean>>({})

  const toggleTripOptions = (tripId: number | string) => {
    const key = String(tripId)
    setExpandedTrips((prev) => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  if (loading) {
    return (
      <TripDetailItem>
        <TripInfo style={{ textAlign: 'center', width: '100%' }}>
          <Spin size="small" />
          <div style={{ marginTop: '8px' }}>{loadingMessage}</div>
        </TripInfo>
      </TripDetailItem>
    )
  }

  if (trips.length === 0) {
    return (
      <TripDetailItem>
        <TripInfo>
          <TripParticipant>{emptyMessage}</TripParticipant>
        </TripInfo>
      </TripDetailItem>
    )
  }

  return (
    <>
      {trips.map((trip) => {
        const tripOptions = trip.tripOptions || []
        const previewOptions = tripOptions.slice(0, 2)
        const hasMoreOptions = tripOptions.length > 2
        const isExpanded = expandedTrips[String(trip.id)]

        return (
        <TripDetailItem key={trip.id} data-dropdown>
          <TripInfo>
            {(trip.date || trip.created_at) && (
              <TripTime>{formatTime((trip.date || trip.created_at)!)}</TripTime>
            )}
            <TripParticipant>
              {trip.customerName || trip.customer?.name || 'Cliente'}
              {showCancelReason && trip.canceledBy && (
                <CanceledByTag $type={trip.canceledBy}>
                  {CANCELED_BY_LABEL[trip.canceledBy] || trip.canceledBy}
                </CanceledByTag>
              )}
            </TripParticipant>
            {showCancelReason && trip.cancelReason && (
              <TripReason>Motivo: {trip.cancelReason}</TripReason>
            )}
            {trip.originAddress && trip.destinationAddress && (
              <TripRoute>
                <RouteTrack>
                  <RouteLine />
                  <RouteRow>
                    <RouteMarker $variant="origin" />
                    <RouteText><strong>Origem:</strong> {trip.originAddress}</RouteText>
                  </RouteRow>
                  <RouteRow>
                    <RouteMarker $variant="destination" />
                    <RouteText><strong>Destino:</strong> {trip.destinationAddress}</RouteText>
                  </RouteRow>
                </RouteTrack>
                {trip.price && <TripPrice>{formatPrice(trip.price)}</TripPrice>}
              </TripRoute>
            )}
            {trip.price && !(trip.originAddress && trip.destinationAddress) && tripOptions.length === 0 && (
              <TripPrice>{formatPrice(trip.price)}</TripPrice>
            )}

            {tripOptions.length > 0 && (
              <TripOptionsWrapper>
                <TripOptionsLabel>Preços simulados</TripOptionsLabel>
                <TripOptionPreview>
                  {(isExpanded ? tripOptions : previewOptions).map((option) => (
                    <TripOptionChip key={option.id}>
                      <span>{option.tripTypeName || `Tipo ${option.tripTypeId}`}</span>
                      <TripOptionPrice>{formatPrice(option.price)}</TripOptionPrice>
                    </TripOptionChip>
                  ))}
                </TripOptionPreview>

                {hasMoreOptions && (
                  <TripOptionsToggle
                    type="button"
                    data-dropdown
                    onClick={(event) => {
                      event.stopPropagation()
                      toggleTripOptions(trip.id)
                    }}
                    className={isExpanded ? 'expanded' : ''}
                  >
                    {isExpanded ? 'Ocultar tipos' : `+${tripOptions.length - 2} tipos`}
                    <FiChevronDown />
                  </TripOptionsToggle>
                )}
              </TripOptionsWrapper>
            )}
          </TripInfo>
          <ButtonsContainer>
            {trip.customerPhone && (!showCancelReason || trip.canceledBy === 'customer') && (
              <WhatsAppButton
                data-dropdown
                onMouseDown={(e: React.MouseEvent) => {
                  e.stopPropagation()
                }}
                onClick={(e: React.MouseEvent) => {
                  e.stopPropagation()
                  onWhatsAppClick({
                    phone: trip.customerPhone || '',
                    name: trip.customerName || trip.customer?.name,
                    message: buildWhatsAppMessage?.(trip)
                  })
                }}
                title="Contatar cliente via WhatsApp"
              >
                <FaWhatsapp />
              </WhatsAppButton>
            )}
            {trip.tripReference && (
              <DetailsLink
                data-dropdown
                onMouseDown={(e: React.MouseEvent) => {
                  e.stopPropagation()
                }}
                onClick={(e: React.MouseEvent) => {
                  e.stopPropagation()
                  onDetailsClick(trip.tripReference || '')
                }}
              >
                Ver detalhes
              </DetailsLink>
            )}
          </ButtonsContainer>
        </TripDetailItem>
      )})}
    </>
  )
}

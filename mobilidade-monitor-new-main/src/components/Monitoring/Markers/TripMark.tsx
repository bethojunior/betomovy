import { Flex } from 'antd/lib'
import { useEffect, useState } from 'react'
import { Layer, Marker, Source } from 'react-map-gl'
import AvatarWoman from '../../../assets/avatar.png'
import PointGreen from '../../../assets/Pointer/pointer-green.png'
import PointYellow from '../../../assets/Pointer/pointer-yellow.png'
import StartImage from '../../../assets/racing-flag.png'
import { TripStatus } from '../../../constants/tripStatus'
import { getCustomerPhotoUrl } from '../../../utils/imageUtils'
import { ImageCustomer, ImagePointer, StartImageStyle } from './styles'
interface TripMarkProps {
  originLatitude: number | string
  originLongitude: number | string
  destinationLatitude?: number | string
  destinationLongitude?: number | string
  destination?: any
  origin?: any
  tripStatus: string
  tripReference: string
  customerPhoto: string
  driverPhoto?: string
  driverId: number | string
  drivers?: DriverRealtime[]
  driversCalled?: any[]
  driverCalleds?: any[]
}

export const TripMark = (props: TripMarkProps) => {
  const [originLatitude, setOriginLatitude] = useState<number | string>(0)
  const [originLongitude, setOriginLongitude] = useState<number | string>(0)
  const [driverLongitude, setDriverLongitude] = useState<number | string>(0)
  const [driverLatitude, setDriverLatitude] = useState<number | string>(0)
  const [destinationLatitude, setDestinationLatitude] = useState<number | string>(0)
  const [destinationLongitude, setDestinationLongitude] = useState<number | string>(0)
  const [tripStatusFlow, setTripStatusFlow] = useState<number>(1)
  const [driverPositionLoaded, setDriverPositionLoaded] = useState<boolean>(false)

  const getTripStatusId = (tripStatus: string) => {
    if ([TripStatus.STATUS_SEARCHING_FAVORITE, TripStatus.STATUS_SEARCHING].includes(tripStatus))
      return 1
    if ([TripStatus.STATUS_BOARDING, TripStatus.STATUS_ACCEPTED].includes(tripStatus)) return 2
    if (tripStatus === TripStatus.STATUS_IN_PROGRESS || 
        tripStatus === 'corrida' || 
        tripStatus === 'in_progress') return 3
  }

  // Função para buscar coordenadas do motorista no array drivers[]

  const findDriverPosition = (driverId: number | string) => {
    // Se driverId é 0, undefined ou inválido, não busca
    if (!driverId || driverId === 0 || isNaN(Number(driverId))) {
      setDriverPositionLoaded(false)
      return false
    }

    if (!props.drivers || props.drivers.length === 0) {
      setDriverPositionLoaded(false)
      return false
    }

    const driver = props.drivers.find((d) => d.idDriver === Number(driverId))

    if (driver && driver.latitude && driver.longitude) {
      setDriverLatitude(driver.latitude)
      setDriverLongitude(driver.longitude)
      setDriverPositionLoaded(true)
      return true
    } else {
      setDriverPositionLoaded(false)
      return false
    }
  }

  useEffect(() => {
    setOriginLatitude(props.originLatitude)
    setOriginLongitude(props.originLongitude)
    
    // Atualizar coordenadas de destino - tentar múltiplas fontes
    if (props.destinationLatitude && props.destinationLongitude) {
      setDestinationLatitude(props.destinationLatitude)
      setDestinationLongitude(props.destinationLongitude)
    } else if (props.destination) {
      setDestinationLatitude(props.destination.latitude)
      setDestinationLongitude(props.destination.longitude)
    }
    
    if (props.origin) {
      setOriginLatitude(props.origin.latitude)
      setOriginLongitude(props.origin.longitude)
    }
    setTripStatusFlow(getTripStatusId(props.tripStatus) ?? 1)
  }, [
    props.originLatitude,
    props.originLongitude,
    props.destinationLatitude,
    props.destinationLongitude,
    props.destination,
    props.origin,
    props.tripStatus
  ])

  useEffect(() => {
    findDriverPosition(props.driverId)
  }, [props.drivers, props.driverId])

  const tripStatusMap: Record<string, number> = {
    [TripStatus.STATUS_SEARCHING_FAVORITE]: 1,
    [TripStatus.STATUS_SEARCHING]: 1,
    [TripStatus.STATUS_BOARDING]: 2,
    [TripStatus.STATUS_ACCEPTED]: 2,
    [TripStatus.STATUS_IN_PROGRESS]: 3,
    'corrida': 3,
    'in_progress': 3
  }

  const getTripStatusIdStatic = (tripStatus: string): number => {
    return tripStatusMap[tripStatus]
  }

  const getTripLineCor = (status: string) => {
    if ([TripStatus.STATUS_SEARCHING_FAVORITE, TripStatus.STATUS_SEARCHING].includes(status))
      return 'rgba(27, 183, 245, 0.356)'
    if ([TripStatus.STATUS_BOARDING, TripStatus.STATUS_ACCEPTED].includes(status))
      return 'rgba(255, 187, 1, 0.39)'
    if (status === TripStatus.STATUS_IN_PROGRESS || 
        status === 'corrida' || 
        status === 'in_progress') return 'rgba(47, 238, 56, 0.5)'
    if (status === 'scheduled') return 'rgba(27, 183, 245, 0.356)'
    return 'rgba(27, 183, 245, 0.356)'
  }

  const hasValidCoordinates = (lat: number | string, lng: number | string) => {
    const numLat = Number(lat)
    const numLng = Number(lng)
    const isValid = !isNaN(numLat) && !isNaN(numLng) && numLat !== 0 && numLng !== 0
    return isValid
  }

  const buildLineCoordinates = () => {
    const driverValid = hasValidCoordinates(driverLatitude, driverLongitude) && driverPositionLoaded
    const originValid = hasValidCoordinates(originLatitude, originLongitude)
    const destinationValid = hasValidCoordinates(destinationLatitude, destinationLongitude)
    const tripStatusId = getTripStatusIdStatic(props.tripStatus)
    const hasDriversCalled =
      (props.driversCalled && props.driversCalled.length > 0) ||
      (props.driverCalleds && props.driverCalleds.length > 0)

    if (driverValid && originValid && destinationValid) {
      if (tripStatusId === 3) {
        return [
          [Number(driverLongitude), Number(driverLatitude)],
          [Number(destinationLongitude), Number(destinationLatitude)]
        ]
      } else {
        return [
          [Number(driverLongitude), Number(driverLatitude)],
          [Number(originLongitude), Number(originLatitude)],
          [Number(destinationLongitude), Number(destinationLatitude)]
        ]
      }
    }

    if (!driverValid && originValid && destinationValid) {
      return [
        [Number(originLongitude), Number(originLatitude)],
        [Number(destinationLongitude), Number(destinationLatitude)]
      ]
    }

    if (!driverValid && originValid && hasDriversCalled && !destinationValid) {
      return []
    }

    return []
  }

  const dataLayer: any = {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'LineString',
      coordinates: buildLineCoordinates()
    }
  }

  const destinationPointColor = (status: number) => {
    switch (status) {
      case 1:
        return PointYellow
      case 2:
        return PointYellow
      case 3:
        return PointGreen
    }
  }

  return (
    <>
      {[
        TripStatus.STATUS_SEARCHING_FAVORITE,
        TripStatus.STATUS_SEARCHING,
        TripStatus.STATUS_ACCEPTED,
        TripStatus.STATUS_BOARDING,
        TripStatus.STATUS_SCHEDULED
      ].includes(props.tripStatus) &&
        hasValidCoordinates(originLatitude, originLongitude) && (
          <Marker
            longitude={Number(originLongitude)}
            latitude={Number(originLatitude)}
            anchor="bottom"
          >
            <Flex align="center" gap="middle">
              <ImageCustomer
                src={getCustomerPhotoUrl(props.customerPhoto) || AvatarWoman}
                onError={(e) => {
                  e.currentTarget.onerror = null
                  e.currentTarget.src = AvatarWoman
                }}
              />
            </Flex>
          </Marker>
        )}

      {[TripStatus.STATUS_BOARDING, TripStatus.STATUS_ACCEPTED].includes(props.tripStatus) &&
        hasValidCoordinates(originLatitude, originLongitude) && (
          <Marker
            longitude={Number(originLongitude)}
            latitude={Number(originLatitude)}
            anchor="bottom"
          >
            <ImagePointer src={destinationPointColor(tripStatusFlow)} />
          </Marker>
        )}

      {hasValidCoordinates(destinationLatitude, destinationLongitude) && (
        <Marker
          longitude={Number(destinationLongitude)}
          latitude={Number(destinationLatitude)}
          anchor="bottom"
        >
          <StartImageStyle src={StartImage} />
        </Marker>
      )}

      <Source id={`polylineLayer-${props.tripReference}`} type="geojson" data={dataLayer}>
        {(() => {
          const originValid = hasValidCoordinates(originLatitude, originLongitude)
          const destinationValid = hasValidCoordinates(destinationLatitude, destinationLongitude)

          const hasDriversCalled =
            (props.driversCalled && props.driversCalled.length > 0) ||
            (props.driverCalleds && props.driverCalleds.length > 0)

          const shouldShowLine =
            (originValid && destinationValid) || (originValid && hasDriversCalled)

          const hasEnoughCoordinates = buildLineCoordinates().length >= 2

          return (
            shouldShowLine &&
            hasEnoughCoordinates && (
              <Layer
                id={`lineLayer-${props.tripReference}`}
                type="line"
                source={`polylineLayer-${props.tripReference}`}
                layout={{
                  'line-join': 'round',
                  'line-cap': 'round'
                }}
                paint={{
                  'line-color': getTripLineCor(props.tripStatus),
                  'line-width': 1.4
                }}
              />
            )
          )
        })()}
      </Source>
    </>
  )
}

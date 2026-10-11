import { Button, Skeleton } from 'antd'
import { FC, useCallback, useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import swal from 'sweetalert'
import pathAnimationCancelTrip from '../../../assets/animations/animation_cancel_trip.json'
import BlueMarker from '../../../assets/Pointer/pointer-blue.png'
import DarkBlueMarker from '../../../assets/Pointer/pointer-darkblue.png'
import GreenMarker from '../../../assets/Pointer/pointer-green.png'
import PurpleMarker from '../../../assets/Pointer/pointer-purple.png'
import RedMarker from '../../../assets/Pointer/pointer-red.png'
import YellowMarker from '../../../assets/Pointer/pointer-yellow.png'
import ContainerCancelComponent from '../../../components/ContainerCancelComponent'
import ModalCancelTrip from '../../../components/ModalLottie'
import BonusSection from '../../../components/Trip/Details/BonusSection'
import Header from '../../../components/Trip/Details/Header'
import { TripDetailsProps } from '../../../components/Trip/Details/Header/types'
import ListDetails from '../../../components/Trip/Details/List'
import Map from '../../../components/Trip/Details/Map'
import Alert from '../../../components/Utils/Alert'
import Preload from '../../../components/Utils/Preload'
import api from '../../../services/api'
import MapService from '../../../services/MapService'
import Mask from '../../../services/Mask'
import {
  calculateDriverDisplacementDistance,
  calculateDriverDisplacementTime,
  calculateTotalDistanceFromPolyline,
  calculateTotalTripTimeFromEvents
} from '../../../utils/tripCalculations'
import { normalizeTripEvent } from '../../../utils/tripEventUtils'
import {
  STATUS_CANCELED,
  TRIP_ANALYZE,
  TRIP_BLOCKED,
  TRIP_RELEASED_ID_AFTER_ANALYZE,
  TRIP_SITUATION_AFTER_ANALYZE
} from '../../../utils/TripStatus'
import Utils from '../../../utils/Utils'
import {
  ButtonCancelRacer,
  ButtonReleaseRacer,
  ContainerCancel,
  Content,
  DisplacementInfoContainer,
  DisplacementInformationContent,
  DisplacementSection,
  DisplacementTitle,
  ComparisonTable,
  FoorterMapContent,
  FooterMapInformation,
  GeneralContent,
  Hour,
  Information,
  Marker,
  RouteTripContent,
  Section,
  SectionContent,
  SectionInformation,
  Span,
  TextArea,
  TextBalanceDriver,
  Title,
  TrajetContent
} from './styles'
import {
  CoordinateInterface,
  EventList,
  PositionInterface,
  TypeStatus,
  TypesAlertStatusProps
} from '../../../@types/tripDetails'

const DetailsTrip: FC = () => {
  const { tripReference }: { tripReference: string } = useParams()
  const modalRef = useRef<ModalRefProps>(null)
  const modalWithReportRef = useRef<ModalRefProps>(null)
  const textAreaRef = useRef<HTMLTextAreaElement>(null)
  const [detailsTrip, setDetailsTrip] = useState({} as TripDetailsProps)
  const [statusTrip, setStatuTrip] = useState('')
  const [priceTrip, setPriceTrip] = useState(0)
  const [priceMinutesTrip, setPriceMinutesTrip] = useState(0)
  const [coordinatesMap, setCoordinatesMap] = useState<CoordinateInterface>([])
  const [boundsOrigin, setBoundsOrigin] = useState<PositionInterface | undefined>()
  const [boundsDestination, setBoundsDestination] = useState<PositionInterface | undefined>()
  const [events, setEvents] = useState<EventList>([])
  const [contentVisibility, setContentVisibility] = useState(false)
  const [loadingTripDetails, setLoadingTripDetails] = useState<boolean>(true)

  const [loading, setLoading] = useState<boolean>(false)

  const [message, setMessage] = useState<string>('')
  const [typeAlert, setTypeAlert] = useState<TypesAlertStatusProps>('success')
  const [visibleAlert, setVisibleAlert] = useState<boolean>(false)
  const [driverDisplacementDistance, setDriverDisplacementDistance] = useState<number | null>(null)
  const [driverDisplacementTime, setDriverDisplacementTime] = useState<number | null>(null)
  const [calculatedRealDistance, setCalculatedRealDistance] = useState<number | null>(null)
  const [calculatedRealTime, setCalculatedRealTime] = useState<number | null>(null)

  const conditionForReleaseAndCancelTrip =
    [TRIP_ANALYZE, TRIP_BLOCKED]?.includes(Number(detailsTrip?.tripAuditId || 0)) &&
    detailsTrip?.status !== STATUS_CANCELED

  const itsReport = detailsTrip?.trip_report?.monetized === 1 || null

  function getStatus(status: string) {
    const allStatus: TypeStatus = {
      searching: 'Buscando motorista',
      searching_favorite: 'Buscando motorista favorito',
      pre_accepted: 'Aceita por motorista em viagem',
      accepted: 'Aceita',
      boarding: 'Embarcando',
      in_progress: 'Em viagem',
      finished: 'Finalizada',
      canceled: 'Cancelada',
      payment_refused: 'Pagamento recusado',
      not_answered: 'Não atendida',
      back_off: 'Desistiu',
      scheduled: 'Agendada'
    }

    if (!allStatus[status]) {
      setStatuTrip('Status não definido')
      return ''
    }

    setStatuTrip(allStatus[status])
    return ''
  }

  const handleMessageAlerts = (messageAlert: string, typeMessage: TypesAlertStatusProps) => {
    setMessage(messageAlert)
    setTypeAlert(typeMessage)
    setVisibleAlert(true)
  }

  const handleReleaseRace = () => {
    swal({
      title: 'Deseja liberar essa corrida?',
      icon: 'info',
      buttons: ['Não', 'Sim']
    }).then((isReleased) => {
      if (isReleased) {
        setLoading(true)
        api
          .put(`trip/release/${tripReference}`, {})
          .then((response) => {
            setLoading(false)
            if (response.data.status) {
              handleMessageAlerts('Corrida liberada com sucesso!', 'success')
              setDetailsTrip({
                ...detailsTrip,
                tripAuditId: TRIP_RELEASED_ID_AFTER_ANALYZE,
                situation: TRIP_SITUATION_AFTER_ANALYZE
              })
            }
          })
          .catch((error) => {
            console.log(error)
            setLoading(false)
            handleMessageAlerts('Erro ao liberar corrida!', 'error')
          })
      }
    })
  }

  const handleContinue = () => {
    if (itsReport) {
      modalRef.current?.closeModal()
      modalWithReportRef.current?.openModal()
      return
    }
    handleCancelTrip()
  }

  const handleCancelTrip = () => {
    swal({
      title: 'Deseja cancelar essa corrida?',
      icon: 'info',
      buttons: ['Não', 'Sim']
    }).then((isCancel) => {
      if (isCancel) {
        setLoading(true)
        modalRef.current?.closeModal()
        api
          .put(`trip/${tripReference}/cancel`, {
            reason: textAreaRef.current?.value || 'Corrida cancelada'
          })
          .then((response) => {
            setLoading(false)
            if (response.data.status) {
              handleMessageAlerts('Corrida cancelada com sucesso!', 'success')
              setDetailsTrip({
                ...detailsTrip,
                status: STATUS_CANCELED
              })
              getStatus(STATUS_CANCELED)
            }
          })
          .catch((error) => {
            console.log(error)
            setLoading(false)
            handleMessageAlerts('Erro ao cancelar corrida!', 'error')
          })
      }
      if (textAreaRef.current) textAreaRef.current.value = ''
    })
  }
  const initDetailsTrip = useCallback(() => {
    setLoadingTripDetails(true)
    const requestDetailsTrip = api(`trip/${tripReference}`)
    const requestPointsTrip = api(`trip/${tripReference}/driverPositions`)

    Promise.all([requestDetailsTrip, requestPointsTrip])
      .then((result) => {
      const tripDetails: TripDetailsProps = result[0].data.response
      const driverCalledId = tripDetails.driverId
      const drivers = tripDetails.driver_called
      const hourTripStarted = tripDetails.date

      const distanceDriverToOrigin = calculateDriverDisplacementDistance(drivers, driverCalledId)
      const timeDriverToOrigin = calculateDriverDisplacementTime(
        drivers,
        driverCalledId,
        hourTripStarted,
        tripDetails.events
      )

      setDriverDisplacementDistance(distanceDriverToOrigin)
      setDriverDisplacementTime(timeDriverToOrigin)

      setDetailsTrip(result[0].data.response)
      getStatus(result[0].data.response.status)

      setPriceTrip(
        result[0].data.response.recalculated_trip
          ? result[0].data.response.recalculated_trip.newDistance
          : result[0].data.response.distance
      )

      setPriceMinutesTrip(
        result[0].data.response.recalculated_trip
          ? result[0].data.response.recalculated_trip.newTripTime
          : result[0].data.response.estimatedTripTime
      )

      const rawPoints = result[1].data?.response?.points
      const decodedPoints = rawPoints
        ? MapService.decodePolyline(rawPoints).map((item) => [item.lng, item.lat] as [number, number])
        : []

      const coordinates = (decodedPoints.length > 0
        ? decodedPoints
        : [
            [parseFloat(tripDetails.originLongitude), parseFloat(tripDetails.originLatitude)],
            [parseFloat(tripDetails.destinationLongitude), parseFloat(tripDetails.destinationLatitude)]
          ]) as [number, number][]

      setCoordinatesMap(coordinates)

      if (tripDetails.recalculated_trip) {
        const polylinePoints = rawPoints
          ? MapService.decodePolyline(rawPoints).map((item) => [item.lng, item.lat] as [number, number])
          : []

        const calculatedDistance =
          tripDetails.recalculated_trip.newDistance != null
            ? tripDetails.recalculated_trip.newDistance
            : calculateTotalDistanceFromPolyline(polylinePoints)

        const calculatedTime =
          tripDetails.recalculated_trip.newTripTime != null
            ? tripDetails.recalculated_trip.newTripTime
            : calculateTotalTripTimeFromEvents(tripDetails.events)

        setCalculatedRealDistance(calculatedDistance)
        setCalculatedRealTime(calculatedTime)
      } else {
        setCalculatedRealDistance(null)
        setCalculatedRealTime(null)
      }

      const Icons = [BlueMarker, PurpleMarker, YellowMarker, DarkBlueMarker]

      setEvents([
        {
          description: tripDetails.originAddress,
          icon: GreenMarker,
          date: null,
          position: [parseFloat(tripDetails.originLongitude), parseFloat(tripDetails.originLatitude)]
        },
        ...((tripDetails.events || []).map((item, index) => {
          const { lng, lat, timestampIso } = normalizeTripEvent(item)
          return {
            description: item.message,
            icon: Icons[index] || BlueMarker,
            date: timestampIso ? new Date(timestampIso).toLocaleString() : 'Data não disponível',
            position: [lng, lat]
          }
        })),
        {
          description: tripDetails.destinationAddress,
          icon: RedMarker,
          date: null,
          position: [
            parseFloat(tripDetails.destinationLongitude),
            parseFloat(tripDetails.destinationLatitude)
          ]
        }
      ])

      setBoundsOrigin([parseFloat(tripDetails.originLongitude), parseFloat(tripDetails.originLatitude)])
      setBoundsDestination([
        parseFloat(tripDetails.destinationLongitude),
        parseFloat(tripDetails.destinationLatitude)
      ])
      setLoadingTripDetails(false)
    })
    .catch((err) => {
      setLoadingTripDetails(false)
      handleMessageAlerts(
        err?.response?.data?.message ?? 'Erro ao carregar detalhes da viagem. Tente novamente.',
        'error'
      )
    })
  }, [tripReference])

  useEffect(() => {
    initDetailsTrip()
  }, [initDetailsTrip])

  return (
    <GeneralContent>
      <Header data={detailsTrip} loading={loadingTripDetails} />
      <Preload visible={loading} />

      <Alert
        message={message}
        typeAlert={typeAlert}
        visibility={visibleAlert}
        setVisibility={setVisibleAlert}
      />

      <Content>
        <SectionContent>
          {loadingTripDetails ? (
            <div style={{ padding: 10 }}>
              <Skeleton active={true} />
              <Skeleton active={true} />
              <Skeleton active={true} />
            </div>
          ) : (
            <>
              {Object.keys(detailsTrip).length > 0 &&
                detailsTrip.status !== 'back_off' &&
                detailsTrip.status !== 'not_answered' &&
                detailsTrip.status !== 'payment_refused' &&
                ((detailsTrip?.trip_history &&
                  Array.isArray(detailsTrip.trip_history) &&
                  detailsTrip.trip_history.length > 0) ||
                  (detailsTrip?.driverId !== null && detailsTrip?.driverId !== undefined)) && (
                  <div
                    style={{
                      marginBottom: 10
                    }}
                  >
                    <TextBalanceDriver>
                      Saldo no Momento do Chamado:{' '}
                      <span>
                        {detailsTrip.trip_history &&
                        detailsTrip.trip_history.length > 0 &&
                        detailsTrip.trip_history[0]?.driverBalanceInStartCall !== null &&
                        detailsTrip.trip_history[0]?.driverBalanceInStartCall !== undefined
                          ? detailsTrip.trip_history[0].driverBalanceInStartCall.toLocaleString(
                              'pt-br',
                              { style: 'currency', currency: 'BRL' }
                            )
                          : 'Não disponível'}
                      </span>
                    </TextBalanceDriver>
                  </div>
                )}
              {!contentVisibility && (
                <Button type="primary" onClick={() => setContentVisibility(true)}>
                  Exibir mapa
                </Button>
              )}
              {contentVisibility && (
                <Map
                  boundsOrigin={boundsOrigin}
                  boundsDestination={boundsDestination}
                  coordinate={coordinatesMap}
                  events={events}
                />
              )}
              <FoorterMapContent>
                <DisplacementInfoContainer>
                  <DisplacementSection>
                    <DisplacementTitle>Deslocamento até Embarque</DisplacementTitle>
                    <DisplacementInformationContent>
                      <SectionInformation>
                        <Title>Distância</Title>
                        <FooterMapInformation>
                          {driverDisplacementDistance !== null
                            ? `${driverDisplacementDistance.toFixed(2)} km`
                            : '-'}
                        </FooterMapInformation>
                      </SectionInformation>
                      <SectionInformation>
                        <Title>Tempo</Title>
                        <FooterMapInformation>
                          {driverDisplacementTime !== null ? `${driverDisplacementTime} min` : '-'}
                        </FooterMapInformation>
                      </SectionInformation>
                    </DisplacementInformationContent>
                  </DisplacementSection>

                  <ComparisonTable>
                    <thead>
                      <tr>
                        <th>Tipo</th>
                        <th>Km Viagem</th>
                        <th>Duração Viagem</th>
                        <th>Preço Viagem</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{detailsTrip?.tripType || ''}</td>
                        <td>{detailsTrip?.distance || '0'} km</td>
                        <td>{detailsTrip?.estimatedTripTime || '0'} min</td>
                        <td>
                          {detailsTrip?.recalculated_trip
                            ? detailsTrip.recalculated_trip.oldPrice != null
                              ? Mask.setMaskMoneyNumber(Number(detailsTrip.recalculated_trip.oldPrice))
                              : '0,00'
                            : detailsTrip?.fare !== null
                              ? Mask.setMaskMoneyNumber(Number(detailsTrip?.price))
                              : '0,00'}
                        </td>
                      </tr>
                      {detailsTrip?.recalculated_trip && (
                        <tr>
                          <td>Real</td>
                          <td>
                            {calculatedRealDistance != null
                              ? `${Number(calculatedRealDistance).toFixed(3)} km`
                              : '-'}
                          </td>
                          <td>
                            {calculatedRealTime != null ? `${calculatedRealTime} min` : '-'}
                          </td>
                          <td>
                            {detailsTrip?.fare !== null
                              ? Mask.setMaskMoneyNumber(Number(detailsTrip?.price))
                              : '-'}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </ComparisonTable>
                </DisplacementInfoContainer>
                <TrajetContent>
                  {(events || []).map((item) => {
                    return (
                      <RouteTripContent>
                        <Section>
                          <Marker
                            style={{
                              backgroundImage: `url(${item.icon})`
                            }}
                          />
                          <Information>{item.description}</Information>
                        </Section>
                        {item.date && <Hour>{item.date}</Hour>}
                      </RouteTripContent>
                    )
                  })}
                </TrajetContent>

                <div style={{ paddingLeft: 10 }}>
                  <BonusSection
                    rewardTripLongDistance={detailsTrip?.reward_trip_long_distance}
                    rewardCampaignTrip={detailsTrip?.reward_campaign_trip}
                    tripLongDistance={detailsTrip?.trip_long_distance}
                  />
                  <Section>
                    <span>Forma de pagamento:</span>
                    <Title style={{ marginLeft: 5 }}>{detailsTrip?.paymentForm}</Title>
                  </Section>
                  <Section>
                    <span>Utilização de gps fake:</span>
                    <Title style={{ marginLeft: 5 }}>
                      {detailsTrip?.usedFakeGps ? 'Sim' : 'Não'}
                    </Title>
                  </Section>
                  {itsReport && (
                    <Section
                      style={{
                        marginTop: 10
                      }}
                    >
                      <span>Relato do cliente:</span>
                      <Title style={{ marginLeft: 5, marginBottom: 5 }}>
                        {detailsTrip?.trip_report?.cancellationReasons}
                      </Title>
                      Mensagem do cliente sobre o relato: <br />
                      <Title style={{ marginLeft: 5 }}>{detailsTrip?.trip_report?.message}</Title>
                    </Section>
                  )}

                  {conditionForReleaseAndCancelTrip && (
                    <Section>
                      <ButtonReleaseRacer onClick={handleReleaseRace}>
                        Liberar Corrida
                      </ButtonReleaseRacer>
                      <ButtonCancelRacer
                        onClick={() => {
                          modalRef.current?.openModal()
                        }}
                      >
                        Cancelar Corrida
                      </ButtonCancelRacer>
                    </Section>
                  )}
                </div>
              </FoorterMapContent>
            </>
          )}
        </SectionContent>
        <SectionContent>
          {loadingTripDetails ? (
            <div style={{ padding: 10 }}>
              <Skeleton active={true} />
              <Skeleton active={true} />
              <Skeleton active={true} />
              <Skeleton active={true} />
            </div>
          ) : (
            <ListDetails
              tripReference={tripReference}
              data={detailsTrip}
              status={statusTrip}
              priceTrip={priceTrip}
              priceMinutesTrip={priceMinutesTrip}
            />
          )}
        </SectionContent>
      </Content>
      <ModalCancelTrip
        ref={modalRef}
        useLottie={{
          animationData: pathAnimationCancelTrip,
          width: '300px'
        }}
        title="Cancelar viagem"
        description="Deseja realmente cancelar essa viagem, com esta ação o motorista terá seus valores retidos definitivamente e o usuário final terá direito a devolução de valores conforme sua avaliação."
        footer={[
          <Button key={1} onClick={() => modalRef.current?.closeModal()}>
            Fechar
          </Button>,
          <Button key={2} type="primary" onClick={() => handleContinue()}>
            Continuar
          </Button>
        ]}
        children={
          <div>
            {!itsReport && (
              <>
                <Span>Texto ao enviar ao cliente e Prestador via Push</Span>

                <TextArea ref={textAreaRef} />
              </>
            )}
          </div>
        }
      />
      <ModalCancelTrip
        ref={modalWithReportRef}
        title="Cancelar viagem - Regras e ações sobre o cancelamento"
        description=""
        width={Utils.isMobile() ? '100%' : '50%'}
        footer={[<></>]}
        children={
          <ContainerCancel>
            <ContainerCancelComponent
              detailsTrip={detailsTrip}
              onCancelTripNoRefund={handleCancelTrip}
              handleMessageAlerts={handleMessageAlerts}
              setDetailsTrip={setDetailsTrip}
              onClose={() => {
                modalWithReportRef.current?.closeModal()
              }}
              getStatus={getStatus}
            />
          </ContainerCancel>
        }
      />
    </GeneralContent>
  )
}

export default DetailsTrip

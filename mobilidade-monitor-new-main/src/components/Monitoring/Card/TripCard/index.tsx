/* eslint-disable @typescript-eslint/no-unused-vars */
import { getCustomerPhotoUrl, getDriverPhotoUrl } from '@/utils/imageUtils'
import Utils from '@/utils/Utils'
import { DownOutlined, UpOutlined } from '@ant-design/icons'
import { Button, Collapse, Dropdown, Menu, Spin, Timeline, Tooltip } from 'antd'
import { FC, useEffect, useMemo, useState } from 'react'
import { BiTimeFive } from 'react-icons/bi'
import swal from 'sweetalert'
import AvatarWoman from '../../../../assets/avatar.png'
import { TripStatus } from '../../../../constants/tripStatus'
import { useTripTimes } from '../../../../contexts/TripTimesContext'
import api from '../../../../services/api'
import { openTripSharingLink } from '../../../../utils/tripUtils'
import { formatTripDateTime } from '../utils'
import { getFirstName, extractTripDate } from '../../../../utils/formatters'
import NotificationModal from '../../NotificationModal'
import { getStatusConfig } from './constants'
import { TripCardProps } from './types'
import { Constants } from '../../../../utils/constants'
import { breadCrumble } from '../../../../utils/translation/breadCrumble'
import * as S from './styles'

const TruncatedValue: FC<{ value?: string | null; as: typeof S.InformationTrip | typeof S.ValueDetail }> = ({ value, as: Component }) => (
  <Tooltip title={value}>
    <Component>{value}</Component>
  </Tooltip>
)

const TripCard: FC<TripCardProps> = ({ tripReference, tripData }) => {
  const [loading, setLoading] = useState(false)
  const [activeDetails, setActiveDetails] = useState('0')
  const [isNotificationModalVisible, setNotificationModalVisible] = useState(false)
  const [notifyTarget, setNotifyTarget] = useState<'customer' | 'driver'>('customer')
  const { getTripStartTime, setTripStartTime, removeTripStartTime } = useTripTimes()
  
  const tripWithStartTime = useMemo(() => {
    if (!tripData) return null
    const tripActiveData = { ...(tripData as unknown as TripActive) }

    if (tripActiveData.status === TripStatus.STATUS_IN_PROGRESS) {
      const storedStartTime = getTripStartTime(tripActiveData.tripReference)

      if (storedStartTime) {
        tripActiveData.tripStartTime = storedStartTime
      } else {
        const currentTime = new Date().toISOString()
        tripActiveData.tripStartTime = currentTime
      }
    }

    return tripActiveData
  }, [tripData, getTripStartTime])

  useEffect(() => {
    if (!tripData?.tripReference) return

    const tripActiveData = tripData as unknown as TripActive

    if (tripActiveData.status === TripStatus.STATUS_IN_PROGRESS) {
      const storedStartTime = getTripStartTime(tripActiveData.tripReference)

      if (!storedStartTime) {
        const currentTime = new Date().toISOString()
        setTripStartTime(tripActiveData.tripReference, currentTime)
      }
    } else {
      const storedStartTime = getTripStartTime(tripActiveData.tripReference)
      if (storedStartTime) {
        removeTripStartTime(tripActiveData.tripReference)
      }
    }
  }, [tripData?.tripReference, tripData?.status, getTripStartTime, setTripStartTime, removeTripStartTime])

  const trip = tripWithStartTime
  const status = tripData?.status || 'searching'
  const config = getStatusConfig(status)
  const hasAcceptedDriver = Boolean(
    trip?.driverId || trip?.driverUserId || tripData?.driverId || tripData?.driverUserId
  )

  const handleSendNotification = async (title: string, message: string) => {
    setLoading(true)
    try {
      const userId =
        notifyTarget === 'customer'
          ? trip?.userId || tripData?.userId
          : trip?.driverUserId || tripData?.driverUserId

      if (!userId) {
        swal({
          title: breadCrumble('error.title'),
          text: `${breadCrumble('error.user_id_not_found')} ${notifyTarget === 'customer' ? breadCrumble('common.customer').toLowerCase() : breadCrumble('common.driver').toLowerCase()}`,
          icon: 'error'
        })
        return
      }

      const payload = {
        action: 'message',
        link: '',
        message,
        notificationTypeId: 2,
        title,
        userIdAdministrator: trip?.adminUserId || tripData?.adminUserId || Constants.DEFAULT_ADMIN_USER_ID,
        userTypeId: '4',
        usersId: [userId]
      }

      await api.post('/notification/', payload)

      swal({
        title: breadCrumble('success.notification_sent'),
        icon: 'success'
      })
      setNotificationModalVisible(false)
    } catch (error: any) {
      swal({
        title: breadCrumble('error.notification_failed'),
        text: error.response?.data?.message || breadCrumble('error.unknown'),
        icon: 'error'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAction = async (action: string, callAgain = false) => {
    setLoading(true)
    try {
      switch (action) {
        case 'notifyCustomer':
          setNotifyTarget('customer')
          setNotificationModalVisible(true)
          setLoading(false)
          return

        case 'notifyDriver':
          setNotifyTarget('driver')
          setNotificationModalVisible(true)
          setLoading(false)
          return

        case 'cancelTrip':
          const confirmCancel = await swal({
            title: callAgain
              ? breadCrumble('trip.cancel_and_recall_confirmation_title')
              : breadCrumble('trip.cancel_confirmation_title'),
            text: breadCrumble('trip.undone_action_text'),
            icon: 'warning',
            buttons: [breadCrumble('common.no'), breadCrumble('common.yes')]
          })

          if (!confirmCancel) {
            setLoading(false)
            return
          }

          await api.put(`/trip/${tripReference}/cancel`, { callAgain })
          swal({
            title: callAgain
              ? breadCrumble('success.trip_cancelled_and_recalled')
              : breadCrumble('success.trip_cancelled'),
            icon: 'success'
          })
          break

        case 'finishTrip':
          const confirmFinish = await swal({
            title: breadCrumble('trip.finish_confirmation_title'),
            text: breadCrumble('trip.undone_action_text'),
            icon: 'warning',
            buttons: [breadCrumble('common.no'), breadCrumble('common.yes')]
          })

          if (!confirmFinish) {
            setLoading(false)
            return
          }

          await api.put(`/trip/${tripReference}/finish`)
          swal({
            title: breadCrumble('success.trip_finished'),
            icon: 'success'
          })
          break

        default:
          throw new Error('Ação não reconhecida.')
      }
    } catch (error: any) {
      swal({
        title: breadCrumble('error.operation_failed'),
        text: error.response?.data?.message || breadCrumble('error.operation_error'),
        icon: 'error'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleViewRoute = () => openTripSharingLink(tripReference)

  const getTargetName = () => {
    if (notifyTarget === 'customer') {
      return customerFirstName || 'Cliente'
    }
    return driverFirstName || 'Motorista'
  }

  const getTargetPhoto = () => {
    if (notifyTarget === 'customer') {
      return tripData?.customerPhoto || trip?.customerPhoto
    }
    return tripData?.driverPhoto || trip?.driverPhoto
  }

  const menuDropDown = (
    <Menu>
      <Menu.Item key="1" onClick={() => handleAction('notifyCustomer')}>
        {breadCrumble('trip.menu.notify_customer')}
      </Menu.Item>
      {hasAcceptedDriver && (
        <Menu.Item key="2" onClick={() => handleAction('notifyDriver')}>
          {breadCrumble('trip.menu.notify_driver')}
        </Menu.Item>
      )}
      <Menu.Item key="3" onClick={handleViewRoute}>
        {breadCrumble('trip.menu.view_route')}
      </Menu.Item>
      <Menu.Item key="4" onClick={() => handleAction('cancelTrip', false)}>
        {breadCrumble('trip.menu.cancel_trip')}
      </Menu.Item>
      <Menu.Item key="5" onClick={() => handleAction('cancelTrip', true)}>
        {breadCrumble('trip.menu.cancel_and_call_another')}
      </Menu.Item>
      <Menu.Item key="6" onClick={() => handleAction('finishTrip')}>
        {breadCrumble('trip.menu.finish_trip')}
      </Menu.Item>
    </Menu>
  )

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const customerFirstName = useMemo(() => 
    getFirstName(tripData?.customerName || trip?.customerName), 
    [tripData?.customerName, trip?.customerName]
  )
  
  const driverFirstName = useMemo(() => 
    getFirstName(tripData?.driverName || trip?.driverName), 
    [tripData?.driverName, trip?.driverName]
  )

  const { dateLabel, timeLabel } = formatTripDateTime(tripData ?? (tripWithStartTime as unknown as TripDto))
  const headerTimestamp = dateLabel != null ? `${dateLabel}${timeLabel ? ` ${timeLabel}` : ''}` : null
  const tripProgress = Math.round(tripData?.tripProgress ?? 0)


  const renderDriversCalled = () => {
    const baseDriversCalled =
      (Array.isArray(trip?.driversCalled) && trip.driversCalled.length > 0 ? trip.driversCalled : null) ||
      (Array.isArray((trip as any)?.driverCalleds) && (trip as any).driverCalleds.length > 0 ? (trip as any).driverCalleds : null) ||
      (Array.isArray(tripData?.driversCalled) && tripData.driversCalled.length > 0 ? tripData.driversCalled : null) ||
      (Array.isArray((tripData as any)?.driverCalleds) && (tripData as any).driverCalleds.length > 0 ? (tripData as any).driverCalleds : null) ||
      []

    if (!config.showDriversCalled) return null

    type DriverCalledStatus = 'default' | 'not_answered' | 'refused' | 'calling'

    // Extrai os IDs dos motoristas que estão tocando atualmente
    const rawCalling = trip?.callingDriver ?? tripData?.callingDriver
    const callingDriverIds = new Set<string>()

    if (Array.isArray(rawCalling)) {
      rawCalling.forEach((item) => {
        if (typeof item === 'object' && item !== null) {
          callingDriverIds.add(String((item as any).idDriver ?? (item as any).driverId ?? (item as any).id ?? ''))
        } else if (item != null) {
          callingDriverIds.add(String(item).trim())
        }
      })
    } else if (typeof rawCalling === 'string') {
      rawCalling.split(',').forEach((id) => {
        const clean = id.trim()
        if (clean) callingDriverIds.add(clean)
      })
    } else if (typeof rawCalling === 'number') {
      callingDriverIds.add(String(rawCalling))
    } else if (typeof rawCalling === 'object' && rawCalling !== null) {
      callingDriverIds.add(String((rawCalling as any).idDriver ?? (rawCalling as any).driverId ?? (rawCalling as any).id ?? ''))
    }
    callingDriverIds.delete('')

    // Se a lista de chamadas ainda não carregou do backend mas há callingDriver ativo, cria entrada sintética para exibir o botão imediatamente
    const rawDriversCalled = [...baseDriversCalled]
    if (rawDriversCalled.length === 0 && callingDriverIds.size > 0) {
      Array.from(callingDriverIds).forEach((id, index) => {
        rawDriversCalled.push({
          id: index + 1,
          driverId: id,
          name: 'Motorista',
          nickname: 'Motorista',
          status: 'calling',
          touched: 1,
          proximity: null,
        })
      })
    }

    if (rawDriversCalled.length === 0) return null

    const resolveDriverCalledStatus = (
      driverId: number | string | null | undefined,
      rawStatus: DriverCalledStatus | undefined
    ): DriverCalledStatus => {
      const idStr = String(driverId ?? '')
      // Se este motorista é o que está chamando agora -> VERDE
      if (idStr && callingDriverIds.has(idStr)) {
        return 'calling'
      }
      // Se o status da última chamada é calling e coincide ou não há callingDriver explícito
      if (rawStatus === 'calling' && callingDriverIds.size === 0) {
        return 'calling'
      }
      if (rawStatus === 'refused') {
        return 'refused'
      }
      // Não atendida / em espera -> CINZA
      return 'not_answered'
    }

    // Formata proximidade em Milhas (mi) para viagens nos EUA ou quando configurado, e km no Brasil
    const formatProximity = (proximity: number | null | undefined) => {
      if (proximity == null || isNaN(Number(proximity))) return '--'
      const num = Number(proximity)
      const fullAddress = `${trip?.originAddress || ''} ${trip?.destinationAddress || ''} ${tripData?.originAddress || ''} ${tripData?.destinationAddress || ''}`
      const isUsa = /EUA|USA|United States|Massachusetts|Everett|Boston|\bMA\b/i.test(fullAddress)

      if (isUsa) {
        // Conversão exata: 1 km = 0.621371 milhas
        const miles = num * 0.621371
        return `${miles.toFixed(2)} mi`
      }
      return `${num.toFixed(2)} km`
    }

    // Agrupa chamadas por motorista mantendo a última chamada e quantidade de toques
    const groupedByDriver: Record<string, (typeof rawDriversCalled)[0][]> = {}
    rawDriversCalled.forEach((driver: any) => {
      const id = driver.driverId || driver.idDriver || driver.id
      if (!id) return
      const key = String(id)
      if (!groupedByDriver[key]) {
        groupedByDriver[key] = []
      }
      groupedByDriver[key].push(driver)
    })

    const driverEntries = Object.entries(groupedByDriver)
      .map(([driverId, calls]) => {
        const lastCall = calls.reduce((prev: any, curr: any) => ((curr.id ?? 0) > (prev.id ?? 0) ? curr : prev))
        const firstCall = calls.reduce((prev: any, curr: any) => ((curr.id ?? 0) < (prev.id ?? 0) ? curr : prev))
        const driverName = lastCall.name || lastCall.nickname || `Motorista #${driverId}`
        const count = calls.length || lastCall.touched || 1
        const rawStatus = (lastCall.status as DriverCalledStatus) || 'default'
        const status = resolveDriverCalledStatus(driverId, rawStatus)
        const firstName = getFirstName(driverName)
        const proximity = lastCall.proximity != null ? Number(lastCall.proximity) : null

        return {
          driverId,
          firstName,
          count,
          status,
          proximity,
          formattedDistance: formatProximity(proximity),
          firstCallId: Number(firstCall?.id ?? 0),
        }
      })
      .filter(Boolean)

    // Ordenação: pela ordem cronológica de chamada (primeiro motorista chamado à esquerda, próximo à direita)
    const sortedDrivers = driverEntries.sort((a, b) => {
      if (a.firstCallId && b.firstCallId) {
        return a.firstCallId - b.firstCallId
      }
      return 0
    })

    // Exibe os motoristas chamados (mantém pelo menos 2 se disponíveis)
    const displayedDrivers = sortedDrivers.slice(0, Math.max(2, sortedDrivers.length))

    return (
      <S.DriversCalledContainer>
        <S.DriversCalledSection>
          {displayedDrivers.map((driver) => (
            <S.DriversCalled status={driver.status} key={`driver_${driver.driverId}`}>
              <S.DriversCalledText title={driver.firstName}>
                {driver.firstName}
              </S.DriversCalledText>
              <S.DriversCalledSubtext>
                {driver.formattedDistance} ({driver.count}x)
              </S.DriversCalledSubtext>
            </S.DriversCalled>
          ))}
        </S.DriversCalledSection>
      </S.DriversCalledContainer>
    )
  }

  const renderCardContent = () => {
    if (config.layout === 'simple') {
      return (
        <>
          <S.CardBody style={{ padding: '0px 20px' }}>
            {status === 'scheduled' && hasAcceptedDriver ? (
              <S.CustomersContainer>
                <S.UsersSection>
                  <S.Users>
                    <S.PictureContainer>
                      <S.CardAvatar
                        src={getCustomerPhotoUrl(trip?.customerPhoto) || AvatarWoman}
                        width={80}
                        height={80}
                        onError={(e) => {
                          e.currentTarget.onerror = null
                          e.currentTarget.src = AvatarWoman
                        }}
                      />
                    </S.PictureContainer>
                    <S.TitleUser>{breadCrumble('common.customer')}:</S.TitleUser>
                    <S.NameUser>{trip?.customerName}</S.NameUser>
                    <S.VersionApp>{breadCrumble('common.version')}: {trip?.customerAppVersion || trip?.customer?.appVersion || tripData?.customer?.appVersion || '--'}</S.VersionApp>
                  </S.Users>
                  <S.Users>
                    <S.PictureContainer>
                      <S.CardAvatar
                        src={getDriverPhotoUrl(trip?.driverPhoto || tripData?.driverPhoto) || AvatarWoman}
                        width={80}
                        height={80}
                        onError={(e) => {
                          e.currentTarget.onerror = null
                          e.currentTarget.src = AvatarWoman
                        }}
                      />
                    </S.PictureContainer>
                    <S.TitleUser>{breadCrumble('common.driver')}:</S.TitleUser>
                    <S.NameUser>{driverFirstName || breadCrumble('common.driver')}</S.NameUser>
                    <S.VersionApp>{breadCrumble('common.version')}: {trip?.driverAppVersion || tripData?.driverAppVersion || '--' || tripData?.driver?.appVersion}</S.VersionApp>
                  </S.Users>
                </S.UsersSection>
              </S.CustomersContainer>
            ) : (
              <S.ContainerCustomer>
                <S.CardAvatar
                  src={getCustomerPhotoUrl(trip?.customerPhoto) || AvatarWoman}
                  width={80}
                  height={80}
                  onError={(e) => {
                    e.currentTarget.onerror = null
                    e.currentTarget.src = AvatarWoman
                  }}
                />
                <div>
                  <h3 style={{ margin: 0 }}>
                    {status === 'scheduled' ? `${breadCrumble('common.customer')}: ` : ''}
                    {trip?.customerName}
                  </h3>
                  <p style={{ margin: 0 }}> {breadCrumble('common.version')}: {trip?.customerAppVersion || trip?.customer?.appVersion || tripData?.customer?.appVersion || '--'} </p>
                </div>
              </S.ContainerCustomer>
            )}

            <S.GeneralInformationsTrip>
              <S.ContainerDetailsTrip>
                <S.TripInfoContainer>
                  <S.LabelInformationTrip>{breadCrumble('common.value')} </S.LabelInformationTrip>
                  <S.InformationTrip>
                    {formatCurrency(Number(trip?.price || tripData?.price) || 0)}
                  </S.InformationTrip>
                </S.TripInfoContainer>

                <S.TripInfoContainer>
                  <S.LabelInformationTrip>{breadCrumble('common.trip_type')} </S.LabelInformationTrip>
                  <TruncatedValue value={trip?.tripType} as={S.InformationTrip} />
                </S.TripInfoContainer>

                <S.TripInfoContainer>
                  <S.LabelInformationTrip>{breadCrumble('common.payment')}</S.LabelInformationTrip>
                  <TruncatedValue value={trip?.paymentForm} as={S.InformationTrip} />
                </S.TripInfoContainer>
              </S.ContainerDetailsTrip>
              <S.AdressContainer layout={config.layout}>
                <Timeline>
                  <Timeline.Item color="red">
                    <S.AdressSimple style={{ marginBottom: -20 }}>
                      <S.AdressLabel>{breadCrumble('common.origin')}:</S.AdressLabel>
                      <Tooltip title={trip?.originAddress}>
                        <S.AdressLocation>{`${trip?.originAddress}`}</S.AdressLocation>
                      </Tooltip>
                    </S.AdressSimple>
                  </Timeline.Item>
                      {tripData?.tripWayPoints &&
                        tripData.tripWayPoints.length > 0 &&
                        tripData.tripWayPoints.map((waypoint: TripWaypoint, index: number) => (
                          <Timeline.Item key={waypoint.id ?? index} color="blue">
                            <S.AdressSimple style={{ marginBottom: -20 }}>
                              <S.AdressLabel>{breadCrumble('common.waypoint')} {index + 1}:</S.AdressLabel>
                              <Tooltip title={waypoint?.address}>
                                <S.AdressLocation>{waypoint?.address}</S.AdressLocation>
                              </Tooltip>
                            </S.AdressSimple>
                          </Timeline.Item>
                        ))}
                  <Timeline.Item
                    color="green"
                    style={{
                      paddingBottom: 0,
                      marginBottom: -20
                    }}
                  >
                    <S.AdressSimple>
                      <S.AdressLabel>{breadCrumble('common.destination')}:</S.AdressLabel>
                      <Tooltip title={trip?.destinationAddress || trip?.destination?.address}>
                        <S.AdressLocation>{trip?.destinationAddress || trip?.destination?.address}</S.AdressLocation>
                      </Tooltip>
                    </S.AdressSimple>
                  </Timeline.Item>
                </Timeline>
              </S.AdressContainer>
              {config.showRequestTime && (
                <S.TripDateContainer layout={config.layout}>
                  <S.BadgeHourRequested layout={config.layout}>
                    <S.BadgeText>
                      Solicitando desde:
                      <BiTimeFive />
                      {Utils.formatTime(extractTripDate(tripData, trip))}
                    </S.BadgeText>
                  </S.BadgeHourRequested>
                </S.TripDateContainer>
              )}
            </S.GeneralInformationsTrip>
          </S.CardBody>
          {renderDriversCalled()}
        </>
      )
    }

    return (
      <>
        <S.CustomersContainer>
          <S.UsersSection>
            <S.Users>
              {activeDetails === '1' && (
                <S.PictureContainer>
                  <S.CardAvatar
                    src={getCustomerPhotoUrl(trip?.customerPhoto || tripData?.customerPhoto) || AvatarWoman}
                    width={80}
                    height={80}
                    onError={(e) => {
                      e.currentTarget.onerror = null
                      e.currentTarget.src = AvatarWoman
                    }}
                  />
                </S.PictureContainer>
              )}
              <S.TitleUser>{breadCrumble('common.customer')}:</S.TitleUser>
              <S.NameUser>
                {customerFirstName}
              </S.NameUser>
              <S.VersionApp>{breadCrumble('common.version')}: {trip?.customerAppVersion || tripData?.customerAppVersion || tripData?.customer?.appVersion || trip.customer?.appVersion}</S.VersionApp>
            </S.Users>
            {config.showDriver && hasAcceptedDriver && (
              <S.Users>
                {activeDetails === '1' && (
                  <S.PictureContainer>
                    <S.CardAvatar
                      src={getDriverPhotoUrl(trip?.driverPhoto || tripData?.driverPhoto) || AvatarWoman}
                      width={80}
                      height={80}
                      onError={(e) => {
                        e.currentTarget.onerror = null
                        e.currentTarget.src = AvatarWoman
                      }}
                    />
                  </S.PictureContainer>
                )}
                <S.TitleUser>{breadCrumble('common.driver')}:</S.TitleUser>
                <S.NameUser>
                  {driverFirstName}
                </S.NameUser>
                <S.VersionApp>{breadCrumble('common.version')}: {trip?.driverAppVersion || tripData?.driverAppVersion || tripData?.driver?.appVersion || ''}</S.VersionApp>
              </S.Users>
            )}
          </S.UsersSection>
        </S.CustomersContainer>

        {config.showCollapse && (
          <Collapse
            onChange={() => setActiveDetails(activeDetails === '1' ? '0' : '1')}
            ghost
            activeKey={activeDetails}
          >
            <S.PanelCollapse header="" key="1" showArrow={false}>
              <S.CardBody>
                <S.ContainerDetailsTrip>
                  <S.DetailsWrapper>
                    <S.TitleDetails> {breadCrumble('common.value')} </S.TitleDetails>
                    <S.ValueDetail> {formatCurrency(Number(trip?.price || tripData?.price) || 0)} </S.ValueDetail>
                  </S.DetailsWrapper>

                  <S.DetailsWrapper>
                    <S.TitleDetails> {breadCrumble('common.trip_type')} </S.TitleDetails>
                    <TruncatedValue value={trip?.tripType || tripData?.tripType} as={S.ValueDetail} />
                  </S.DetailsWrapper>

                  <S.DetailsWrapper>
                    <S.TitleDetails> {breadCrumble('common.payment')} </S.TitleDetails>
                    <TruncatedValue value={trip?.paymentForm || tripData?.paymentForm} as={S.ValueDetail} />
                  </S.DetailsWrapper>
                </S.ContainerDetailsTrip>

                <S.ContainerDestination>
                  <S.SectionAdress>
                    <Timeline>
                      <Timeline.Item style={{ padding: 0 }} color="red">
                        <S.AdressWrapper>
                          <S.TitleAdress> {breadCrumble('common.origin')}:</S.TitleAdress>
                          <Tooltip title={trip?.originAddress || tripData?.originAddress}>
                            <S.Adress>{`${trip?.originAddress || tripData?.originAddress}`}</S.Adress>
                          </Tooltip>
                        </S.AdressWrapper>
                      </Timeline.Item>
                      {tripData?.tripWayPoints &&
                        tripData.tripWayPoints.length > 0 &&
                        tripData.tripWayPoints.map((waypoint: TripWaypoint, index: number) => (
                          <Timeline.Item key={waypoint.id ?? index} color="blue" style={{ padding: 0 }}>
                            <S.AdressWrapper>
                              <S.TitleAdress> {breadCrumble('common.waypoint')} {index + 1}:</S.TitleAdress>
                              <Tooltip title={waypoint?.address}>
                                <S.Adress>{waypoint?.address}</S.Adress>
                              </Tooltip>
                            </S.AdressWrapper>
                          </Timeline.Item>
                        ))}
                      <Timeline.Item color="green" style={{ padding: 0 }}>
                        <S.AdressWrapper>
                          <S.TitleAdress> {breadCrumble('common.destination')}:</S.TitleAdress>
                          <Tooltip title={trip?.destinationAddress || tripData?.destinationAddress}>
                            <S.Adress>{trip?.destinationAddress || tripData?.destinationAddress}</S.Adress>
                          </Tooltip>
                        </S.AdressWrapper>
                      </Timeline.Item>
                    </Timeline>
                  </S.SectionAdress>
                </S.ContainerDestination>
              </S.CardBody>
            </S.PanelCollapse>
          </Collapse>
        )}

        {config.showCollapse && (
          <S.FooterContainer>
            <S.FooterContent>
              <S.ToggleButton onClick={() => setActiveDetails(activeDetails === '1' ? '0' : '1')}>
                {activeDetails === '1' ? (
                  <>
                    <UpOutlined />
                    {breadCrumble('common.see_less')}
                  </>
                ) : (
                  <>
                    <DownOutlined />
                    {breadCrumble('common.see_more')}
                  </>
                )}
              </S.ToggleButton>
              {config.showProgress ? (
                <S.ProgressContainer>
                  <S.TitleGraphic>{breadCrumble('common.progress')}</S.TitleGraphic>
                  <Tooltip title={`Progresso: ${tripProgress}%`}>
                    <S.GraphicTrip
                      strokeColor={{
                        '0%': '#007300',
                        '100%': '#73ee73'
                      }}
                      percent={tripProgress}
                      status="active"
                      style={{ width: '100%' }}
                    />
                  </Tooltip>
                </S.ProgressContainer>
              ) : config.showEstimatedArrival ? (
                <S.TripDateContainer layout={config.layout}>
                  <S.BadgeHourRequested layout={config.layout}>
                    <S.BadgeText>
                      Início previsto:
                      <BiTimeFive />
                      {tripData?.estimatedArrivalMinutes != null
                        ? Utils.convertMinutesToHours(tripData.estimatedArrivalMinutes)
                        : 'Calculando...'}
                    </S.BadgeText>
                  </S.BadgeHourRequested>
                </S.TripDateContainer>
              ) : null}
            </S.FooterContent>
          </S.FooterContainer>
        )}
      </>
    )
  }

  if (!tripData || !tripWithStartTime) {
    return null
  }

  return (
    <Spin spinning={loading} tip="Processando...">
      <S.CardTripList>
        <S.CardHeader>
          <S.StatusTrip className={config.gradientClass} layout={config.layout}>
            <S.StatusTripTitle>{config.title}</S.StatusTripTitle>
            <S.HeaderActions>
              {headerTimestamp && config.layout === 'detailed' && (
                <S.TripDateText>
                  <S.TripDateValue>{dateLabel}</S.TripDateValue>
                  {timeLabel && <S.TripTimeValue>{timeLabel}</S.TripTimeValue>}
                </S.TripDateText>
              )}
              {headerTimestamp && config.layout === 'simple' && status === 'scheduled' && (
                <S.HeaderDate>{headerTimestamp}</S.HeaderDate>
              )}
              {headerTimestamp && config.layout === 'simple' && status !== 'scheduled' && (
                <S.HeaderTimestamp>
                  <S.HeaderTimestampValue>{headerTimestamp}</S.HeaderTimestampValue>
                </S.HeaderTimestamp>
              )}
              {config.showAlertButton && (
                <Tooltip title="Botão de pânico foi acionado">
                  <S.ButtonAlertTrip shape="circle" icon={<S.IconALert />} />
                </Tooltip>
              )}
              <Dropdown overlay={menuDropDown} placement="bottomLeft">
                <Button
                  type="text"
                  className="ant-dropdown-link"
                  onClick={(e) => e.preventDefault()}
                  style={{ width: '100%', marginRight: -5 }}
                >
                  <S.IconMoreDetails />
                </Button>
              </Dropdown>
            </S.HeaderActions>
          </S.StatusTrip>
        </S.CardHeader>
        {renderCardContent()}
      </S.CardTripList>

      <NotificationModal
        visible={isNotificationModalVisible}
        target={notifyTarget}
        targetName={getTargetName()}
        targetPhoto={getTargetPhoto()}
        onCancel={() => setNotificationModalVisible(false)}
        onSend={handleSendNotification}
        loading={loading}
      />
    </Spin>
  )
}

export default TripCard

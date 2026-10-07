import { Tooltip } from 'antd'
import { FC, useCallback, useEffect, useRef, useState } from 'react'
import { FiRefreshCw } from 'react-icons/fi'
import {
  buildAbandonedTripMessage,
  buildCanceledTripMessage,
  buildUnattendedTripMessage
} from '../../../constants/whatsappTemplates'
import { TripService } from '../../../services/TripService'
import api from '../../../services/api'
import { useClickOutside } from '../../../hooks/useClickOutside'
import { formatPrice, formatTime } from '../../../utils/formatters'
import { FooterDropdown } from './FooterDropdown'
import { TripDetailsList } from './TripDetailsList'
import { TripDetail, TripQuantities } from './TripFooterStats.types'
import {
  ButtonContainerReload,
  CardsWrapper,
  DriverStatusContainer,
  DropdownBackdrop,
  DropdownCard,
  FooterBar,
  FooterContent,
  FooterFilterButton,
  FooterFilterContainer,
  FooterReloadButton,
  FooterToggleButton,
  HelpIcon,
  ReloadText,
  SkeletonText,
  StatCard,
  StatCardContainer,
  StatCardDetails,
  StatusDriversText
} from './styles'

type Props = {
  showTripsColumn: boolean
  driverRecencyMode: 'all' | 'recent'
  onDriverRecencyModeChange: (mode: 'all' | 'recent') => void
}

const TripFooterStats: FC<Props> = ({
  showTripsColumn,
  driverRecencyMode,
  onDriverRecencyModeChange
}) => {
  const tripQuantitiesRef = useRef<TripQuantities | null>(null)
  const allDriversRef = useRef<DriverRealtime[]>([])
  const [elapsedTime, setElapsedTime] = useState<string>('')
  const lastUpdatedRef = useRef<Date | null>(null)

  const [footerVisible, setFooterVisible] = useState(false)
  const [reloading, setReloading] = useState(false)
  const [, forceUpdate] = useState(0)

  const [canceledDropdownOpen, setCanceledDropdownOpen] = useState(false)
  const [unattendedDropdownOpen, setUnattendedDropdownOpen] = useState(false)
  const [abandonedDropdownOpen, setAbandonedDropdownOpen] = useState(false)
  const [canceledTrips, setCanceledTrips] = useState<TripDetail[]>([])
  const [unattendedTrips, setUnattendedTrips] = useState<TripDetail[]>([])
  const [abandonedTrips, setAbandonedTrips] = useState<TripDetail[]>([])
  const [loadingCanceled, setLoadingCanceled] = useState(false)
  const [loadingUnattended, setLoadingUnattended] = useState(false)
  const [loadingAbandoned, setLoadingAbandoned] = useState(false)
  const [abandonedSummary, setAbandonedSummary] = useState({
    total: 0,
    abandoned: 0,
    abandonedAttempts: 0,
    converted: 0
  })

  const defaultTripQuantities: TripQuantities = {
    totalTodayTrips: 0,
    totalAcceptedTrips: 0,
    quantityTripsFinished: 0,
    totalCanceledByDriver: 0,
    totalCanceledByCustomer: 0,
    totalCanceledByAdmin: 0,
    totalMoneyTrips: 0,
    totalVoucherTrips: 0,
    totalCardTrips: 0,
    quantityTripsNotAnswered: 0,
    quantityCustomersNotAnswered: 0,
    lostCustomersNotAnswered: 0,
    totalPrice: '0,00',
    totalPriceFinished: '0,00'
  }

  const updateElapsedTime = useCallback(() => {
    if (!lastUpdatedRef.current) {
      setElapsedTime('nunca')
      return
    }

    const diff = Math.floor((Date.now() - lastUpdatedRef.current.getTime()) / 1000)
    if (diff < 60) {
      setElapsedTime(`${diff}s atrás`)
    } else if (diff < 3600) {
      const min = Math.floor(diff / 60)
      setElapsedTime(`${min}min atrás`)
    } else {
      const hr = Math.floor(diff / 3600)
      setElapsedTime(`${hr}h atrás`)
    }
  }, [])

  const fetchTripQuantities = async () => {
    try {
      const data = await TripService.getTripQuantities()
      tripQuantitiesRef.current = data?.[0] ?? defaultTripQuantities
      lastUpdatedRef.current = new Date()
      updateElapsedTime()
      forceUpdate((n) => n + 1)
    } catch (error) {
      console.error('Erro ao carregar as estatísticas', error)
    }
  }

  const fetchCanceledTrips = async () => {
    setLoadingCanceled(true)
    try {
      const data = await TripService.getCanceledTrips()
      setCanceledTrips(data || [])
    } catch (error) {
      console.error('Erro ao carregar viagens canceladas', error)
      setCanceledTrips([])
    } finally {
      setLoadingCanceled(false)
    }
  }

  const fetchUnattendedTrips = async () => {
    setLoadingUnattended(true)
    try {
      const data = await TripService.getUnattendedTrips()
      setUnattendedTrips(data || [])
    } catch (error) {
      console.error('Erro ao carregar viagens não atendidas', error)
      setUnattendedTrips([])
    } finally {
      setLoadingUnattended(false)
    }
  }

  const fetchAbandonedTrips = async () => {
    setLoadingAbandoned(true)
    try {
      const data = await TripService.getAbandonedTrips()
      const summary = data?.summary || {}
      const items: TripDetail[] = data?.items || []
      setAbandonedTrips(items.filter((item) => item.is_abandoned))
      setAbandonedSummary({
        total: summary.total || 0,
        abandoned: summary.abandoned || 0,
        abandonedAttempts: summary.abandonedAttempts || 0,
        converted: summary.converted || 0
      })
    } catch (error) {
      console.error('Erro ao carregar simulações abandonadas', error)
      setAbandonedTrips([])
      setAbandonedSummary({
        total: 0,
        abandoned: 0,
        abandonedAttempts: 0,
        converted: 0
      })
    } finally {
      setLoadingAbandoned(false)
    }
  }

  const handleReloadClick = async () => {
    setReloading(true)
    try {
      try {
        await TripService.syncQueueInsert()
      } catch (error) {
        console.error('Erro ao sincronizar dados de simulações:', error)
      }

      await Promise.all([
        fetchTripQuantities(),
        fetchDriverPositions(),
        fetchCanceledTrips(),
        fetchUnattendedTrips(),
        fetchAbandonedTrips()
      ])
    } catch (error) {
      console.error('Erro ao recarregar dados:', error)
    } finally {
      setReloading(false)
    }
  }

  const fetchDriverPositions = async () => {
    try {
      const response = await api.get(`/driver/positions`, {
        params: {
          status: 'disponivel,corrida,boarding,in_progress,accepted,desligado',
        }
      })

      const allResults: DriverRealtime[] = response.data?.response ?? []

      allDriversRef.current = allResults
    } catch (error) {
      console.error('Erro ao buscar motoristas:', error)
    }
  }

  useEffect(() => {
    fetchTripQuantities()
    fetchDriverPositions()
    fetchCanceledTrips()
    fetchUnattendedTrips()
    fetchAbandonedTrips()
  }, [])

  // Atualiza o timer a cada segundo
  useEffect(() => {
    updateElapsedTime() // Atualiza imediatamente
    
    const interval = setInterval(() => {
      updateElapsedTime()
    }, 1000) // Atualiza a cada 1 segundo

    return () => clearInterval(interval)
  }, [updateElapsedTime])

  const stats = tripQuantitiesRef.current
  const statsLoading = !stats
  const drivers = allDriversRef.current
  const onlineDrivers = drivers.filter((driver) => driver.status === 'disponivel').length
  const busyDrivers = drivers.filter((driver) => driver.status === 'corrida').length

  const handleCanceledDropdownToggle = () => {
    if (canceledDropdownOpen) {
      setCanceledDropdownOpen(false)
      return
    }
    setCanceledDropdownOpen(true)
    setUnattendedDropdownOpen(false)
    setAbandonedDropdownOpen(false)
    if (canceledTrips.length === 0) {
      fetchCanceledTrips()
    }
  }

  const handleUnattendedDropdownToggle = () => {
    if (unattendedDropdownOpen) {
      setUnattendedDropdownOpen(false)
      return
    }
    setUnattendedDropdownOpen(true)
    setCanceledDropdownOpen(false)
    setAbandonedDropdownOpen(false)
    if (unattendedTrips.length === 0) {
      fetchUnattendedTrips()
    }
  }

  const handleAbandonedDropdownToggle = () => {
    if (abandonedDropdownOpen) {
      setAbandonedDropdownOpen(false)
      return
    }
    setAbandonedDropdownOpen(true)
    setCanceledDropdownOpen(false)
    setUnattendedDropdownOpen(false)
    if (abandonedTrips.length === 0) {
      fetchAbandonedTrips()
    }
  }

  const handleFooterToggle = () => {
    setFooterVisible((prev) => {
      const next = !prev

      if (!next) {
        // Ao minimizar, fecha os dropdowns
        setCanceledDropdownOpen(false)
        setUnattendedDropdownOpen(false)
        setAbandonedDropdownOpen(false)
      }
      // Não atualiza automaticamente ao maximizar - apenas quando clicar no botão

      return next
    })
  }

  const handleWhatsAppClick = ({
    phone,
    message
  }: {
    phone: string
    name?: string
    message?: string
  }) => {
    const cleanPhone = phone.replace(/\D/g, '')
    if (!cleanPhone) return

    let whatsappUrl = `https://wa.me/55${cleanPhone}`

    const encodedMessage = message

    if (encodedMessage) {
      whatsappUrl += `?text=${encodedMessage}`
    }

    window.open(whatsappUrl, '_blank', 'noopener,noreferrer')
  }

  const handleDetailsClick = (tripReference: string) => {
    window.open(`/trip/list/details/${tripReference}`, '_blank', 'noopener,noreferrer')
  }

  const anyDropdownOpen =
    canceledDropdownOpen || unattendedDropdownOpen || abandonedDropdownOpen

  const closeAllDropdowns = () => {
    setCanceledDropdownOpen(false)
    setUnattendedDropdownOpen(false)
    setAbandonedDropdownOpen(false)
  }

  useClickOutside(anyDropdownOpen, closeAllDropdowns)

  return (
    <FooterBar showTripsColumn={showTripsColumn}>
      <DropdownBackdrop isOpen={anyDropdownOpen} onClick={closeAllDropdowns} />
      <FooterToggleButton onClick={handleFooterToggle} $hidden={anyDropdownOpen}>
        {footerVisible ? 'Ocultar detalhes' : 'Exibir detalhes'}
      </FooterToggleButton>
      <FooterFilterContainer $hidden={anyDropdownOpen}>
        <FooterFilterButton
          type="button"
          $active={driverRecencyMode === 'all'}
          onClick={() => onDriverRecencyModeChange('all')}
        >
          Todos
        </FooterFilterButton>
        <FooterFilterButton
          type="button"
          $active={driverRecencyMode === 'recent'}
          onClick={() => onDriverRecencyModeChange('recent')}
        >
          Recentes
        </FooterFilterButton>
      </FooterFilterContainer>

      {footerVisible && (
        <FooterContent $dropdownOpen={anyDropdownOpen}>
          <ButtonContainerReload>
            <Tooltip title="Atualizar estatísticas">
              <FooterReloadButton
                onClick={handleReloadClick}
                className={reloading ? 'rotating' : ''}
              >
                <FiRefreshCw />
              </FooterReloadButton>
            </Tooltip>
            <ReloadText>Atualizado: {elapsedTime}</ReloadText>
            <DriverStatusContainer>
              <StatusDriversText>Disponíveis: {onlineDrivers} </StatusDriversText>
              <StatusDriversText>Ocupados: {busyDrivers}</StatusDriversText>
            </DriverStatusContainer>
          </ButtonContainerReload>

          <StatCardContainer>
            <CardsWrapper></CardsWrapper>

            <CardsWrapper>
              <StatCard className="wider">
                <h4>
                  Viagens (
                  {statsLoading ? <SkeletonText width="32px" /> : stats?.totalTodayTrips || 0})
                </h4>
                <StatCardDetails>
                  <p>
                    Aceitas:{' '}
                    {statsLoading ? <SkeletonText width="40px" /> : stats?.totalAcceptedTrips || 0}
                  </p>
                  <p>
                    Finalizadas:{' '}
                    {statsLoading ? (
                      <SkeletonText width="40px" />
                    ) : (
                      stats?.quantityTripsFinished || 0
                    )}
                  </p>
                </StatCardDetails>
              </StatCard>

              <DropdownCard onClick={handleCanceledDropdownToggle} data-dropdown $open={canceledDropdownOpen}>
                <h4>
                  Canceladas (
                  {statsLoading ? (
                    <SkeletonText width="32px" />
                  ) : (
                    (Number(stats?.totalCanceledByDriver) || 0) +
                    (Number(stats?.totalCanceledByCustomer) || 0) +
                    (Number(stats?.totalCanceledByAdmin) || 0)
                  )}
                  )
                </h4>
                <StatCardDetails className="three-items">
                  <p>
                    Motorista:{' '}
                    {statsLoading ? (
                      <SkeletonText width="35px" />
                    ) : (
                      stats?.totalCanceledByDriver || 0
                    )}
                  </p>
                  <p>
                    Cliente:{' '}
                    {statsLoading ? (
                      <SkeletonText width="35px" />
                    ) : (
                      stats?.totalCanceledByCustomer || 0
                    )}
                  </p>
                  <p>
                    Admin:{' '}
                    {statsLoading ? (
                      <SkeletonText width="35px" />
                    ) : (
                      stats?.totalCanceledByAdmin || 0
                    )}
                  </p>
                </StatCardDetails>

                <FooterDropdown
                  isOpen={canceledDropdownOpen}
                  title="Canceladas"
                  onClose={() => setCanceledDropdownOpen(false)}
                >
                  <TripDetailsList
                    trips={canceledTrips}
                    loading={loadingCanceled}
                    emptyMessage="Nenhuma viagem cancelada pelo cliente"
                    loadingMessage="Carregando viagens canceladas..."
                    showCancelReason={true}
                    onWhatsAppClick={handleWhatsAppClick}
                    buildWhatsAppMessage={(trip) =>
                      buildCanceledTripMessage(
                        trip.customerName || trip.customer?.name,
                        trip.cancelReason
                      )
                    }
                    onDetailsClick={handleDetailsClick}
                    formatTime={formatTime}
                    formatPrice={formatPrice}
                  />
                </FooterDropdown>
              </DropdownCard>

              <StatCard>
                <h4>Corridas</h4>
                <StatCardDetails className="three-items">
                  <p>
                    Dinheiro:{' '}
                    {statsLoading ? <SkeletonText width="45px" /> : stats?.totalMoneyTrips || 0}
                  </p>
                  <p>
                    Voucher:{' '}
                    {statsLoading ? <SkeletonText width="45px" /> : stats?.totalVoucherTrips || 0}
                  </p>
                  <p>
                    Cartão:{' '}
                    {statsLoading ? <SkeletonText width="45px" /> : stats?.totalCardTrips || 0}
                  </p>
                </StatCardDetails>
              </StatCard>

              <DropdownCard
                onClick={handleUnattendedDropdownToggle}
                data-dropdown
                className="narrower"
                $open={unattendedDropdownOpen}
              >
                <h4>
                  Não atendidas
                  <Tooltip title="Qtd. de viagens solicitadas e não atendidas / Qtd. de clientes diferentes afetados / Clientes que não conseguiram nenhuma corrida no dia">
                    <HelpIcon size={13} onClick={(e) => e.stopPropagation()} />
                  </Tooltip>
                </h4>
                <p>
                  {statsLoading ? (
                    <SkeletonText width="70px" />
                  ) : (
                    `${stats?.quantityTripsNotAnswered || 0}/${
                      stats?.quantityCustomersNotAnswered || 0
                    }/${stats?.lostCustomersNotAnswered || 0}`
                  )}
                </p>

                <FooterDropdown
                  isOpen={unattendedDropdownOpen}
                  title="Não atendidas"
                  onClose={() => setUnattendedDropdownOpen(false)}
                >
                  <TripDetailsList
                    trips={unattendedTrips}
                    loading={loadingUnattended}
                    emptyMessage="Nenhuma viagem não atendida"
                    loadingMessage="Carregando viagens não atendidas..."
                    showCancelReason={false}
                    onWhatsAppClick={handleWhatsAppClick}
                    buildWhatsAppMessage={(trip) =>
                      buildUnattendedTripMessage(trip.customerName || trip.customer?.name)
                    }
                    onDetailsClick={handleDetailsClick}
                    formatTime={formatTime}
                    formatPrice={formatPrice}
                  />
                </FooterDropdown>
              </DropdownCard>

              <DropdownCard
                onClick={handleAbandonedDropdownToggle}
                data-dropdown
                className="narrower"
                $open={abandonedDropdownOpen}
              >
                <h4>
                  Abandonadas
                  <Tooltip title="Clientes diferentes que abandonaram / Total de tentativas de cotação (o mesmo cliente pode ter tentado mais de uma vez)">
                    <HelpIcon size={13} onClick={(e) => e.stopPropagation()} />
                  </Tooltip>
                </h4>
                <p>
                  {statsLoading || loadingAbandoned ? (
                    <SkeletonText width="40px" />
                  ) : (
                    `${abandonedSummary.abandoned}/${abandonedSummary.abandonedAttempts}`
                  )}
                </p>

                <FooterDropdown
                  isOpen={abandonedDropdownOpen}
                  title="Abandonadas"
                  onClose={() => setAbandonedDropdownOpen(false)}
                >
                  <TripDetailsList
                    trips={abandonedTrips}
                    loading={loadingAbandoned}
                    emptyMessage="Nenhuma simulação abandonada"
                    loadingMessage="Carregando simulações..."
                    onWhatsAppClick={(options) =>
                      handleWhatsAppClick({
                        ...options,
                        message: buildAbandonedTripMessage(options.name)
                      })
                    }
                    onDetailsClick={handleDetailsClick}
                    formatTime={formatTime}
                    formatPrice={formatPrice}
                  />
                </FooterDropdown>
              </DropdownCard>

              <StatCard>
                <h4>Faturamento</h4>
                <StatCardDetails className="column-layout">
                  <p>
                    Total:{' '}
                    {statsLoading ? (
                      <SkeletonText width="80px" />
                    ) : (
                      `R$ ${stats?.totalPrice || '0,00'}`
                    )}
                  </p>
                  <p>
                    Líquido:{' '}
                    {statsLoading ? (
                      <SkeletonText width="80px" />
                    ) : (
                      `R$ ${stats?.totalPriceFinished || '0,00'}`
                    )}
                  </p>
                </StatCardDetails>
              </StatCard>
            </CardsWrapper>
          </StatCardContainer>
        </FooterContent>
      )}
    </FooterBar>
  )
}

export default TripFooterStats

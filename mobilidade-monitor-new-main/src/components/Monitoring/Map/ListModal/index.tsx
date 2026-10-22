import AvatarWoman from '@/assets/avatar.png'
import { getCustomerPhotoUrl, getDriverPhotoUrl } from '@/utils/imageUtils'
import { Button, Modal } from 'antd'
import { FC, useEffect, useMemo, useRef, useState } from 'react'
import { BsCircleFill } from 'react-icons/bs'
import { Loader } from '../../../../components/Loader'
import api from '../../../../services/api'
import Session from '../../../../utils/Session'
import { ClientData, ModalProps } from './types'
import Utils from '../../../../utils/Utils'
import {filterDriversByOfflineRecency} from '../../../../utils/driverPosition'
import {
  CardDriver,
  CardRow,
  CircleStatus,
  DriverAvatar,
  DriverInfo,
  TextCard,
  ClientAvatar,
  Imageclient,
  Status,
  CardClient,
  ClientInfo,
  ImageDriver,
  ModalContainer,
  ModalHeader,
  ScrollableList,
  SearchInput,
  EmptyState
} from './styles'

type DriverRealtime = {
  idDriver: number
  userId: number
  status: 'disponivel' | 'desligado' | 'corrida'
  latitude?: string | number
  longitude?: string | number
  profileImage: string
  userName: string
  userPhone: string
  userNickname: string
  nickname: string
  driverRegisterStatusId: number
  userTypeId: number
  userRating: number
  userType: string
  driverRegisterStatus: string
  cityId: number
  lastConnection?: Date
  lastSocketClientId?: string
}

const isDriver = (item: ClientData | DriverRealtime): item is DriverRealtime => {
  if (!item) return false
  const itemAny = item as any
  return itemAny?.idDriver !== undefined && itemAny?.idDriver !== null
}

const isClient = (item: ClientData | DriverRealtime): item is ClientData => {
  if (!item) return false
  const itemAny = item as any
  return (
    (itemAny?.idCustomer !== undefined && itemAny?.idCustomer !== null) ||
    (itemAny?.customerId !== undefined && itemAny?.customerId !== null) ||
    (itemAny?.name !== undefined && itemAny?.idDriver === undefined)
  )
}

const FETCH_INTERVAL = 10000
const SEARCH_DEBOUNCE_MS = 500

const ListModal: FC<ModalProps> = ({
  type,
  isVisible,
  setIsVisible,
  selectedArea,
  onDriverSelect,
  onClientSelect,
  driverRecencyMode = 'all',
  initialDrivers = []
}) => {
  const [searchValue, setSearchValue] = useState('')
  const [listData, setListData] = useState<(DriverRealtime | ClientData)[]>(() => {
    return type === 'driver' && initialDrivers?.length ? initialDrivers : []
  })
  const [loading, setLoading] = useState(false)
  
  const allDriversRef = useRef<DriverRealtime[]>(initialDrivers || [])
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const fetchDriverPositions = async () => {
    if (!isVisible || type !== 'driver') {
      return
    }
    
    try {
      setLoading(true)
      const cityId = Session.getLocal('citySelected')?.cityId
      const response = await api.get(`/driver/positions`, {
        params: {
          status: 'disponivel,online,available,corrida,busy,boarding,in_progress,accepted,desligado',
          cityId: (cityId && Number(cityId) !== 0) ? cityId : undefined,
        }
      })

      let allResults: DriverRealtime[] = Array.isArray(response.data)
        ? response.data
        : (response.data?.response ?? response.data?.data ?? []);

      // Se a cidade atual não possuir motoristas no momento, busca de todas as cidades como fallback
      if ((!allResults || allResults.length === 0) && cityId && Number(cityId) !== 0) {
        try {
          const fallbackResponse = await api.get(`/driver/positions`, {
            params: {
              status: 'disponivel,online,available,corrida,busy,boarding,in_progress,accepted,desligado',
            }
          })
          allResults = Array.isArray(fallbackResponse.data)
            ? fallbackResponse.data
            : (fallbackResponse.data?.response ?? fallbackResponse.data?.data ?? []);
        } catch (e) {
          console.warn('Fallback all drivers error:', e);
        }
      }

      const filteredResults =
        driverRecencyMode === 'recent'
          ? filterDriversByOfflineRecency(allResults)
          : allResults
      const finalResults = filteredResults.length > 0 ? filteredResults : allResults
      allDriversRef.current = finalResults

      if (isVisible && type === 'driver') {
        setListData(finalResults)
      }
    } catch (error) {
      console.error('Erro ao buscar motoristas:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchClients = async (filter: string) => {
    if (type !== 'client') return

    try {
      setLoading(true)
      const trimmed = filter ? filter.trim() : ''
      const url = trimmed
        ? `customer?page=1&name=${encodeURIComponent(trimmed)}`
        : `customer?page=1`
      const response = await api.get(url)
      const raw =
        response.data?.data?.data ||
        response.data?.response?.data ||
        response.data?.data ||
        response.data?.response ||
        []
      const clients = Array.isArray(raw) ? raw : []
      setListData(clients)
    } catch (error) {
      console.error('Erro ao buscar clientes:', error)
      setListData([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isVisible && type === 'driver') {
      fetchDriverPositions()

      intervalRef.current = setInterval(() => {
        fetchDriverPositions()
      }, FETCH_INTERVAL)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [isVisible, type])

  useEffect(() => {
    if (!isVisible) {
      setSearchValue('')
      if (type === 'client') {
        setListData([])
      }
    } else if (isVisible && type === 'driver') {
      setListData(allDriversRef.current)
    } else if (isVisible && type === 'client') {
      fetchClients('')
    }
  }, [isVisible, type])

  useEffect(() => {
    if (isVisible && type === 'driver') {
      fetchDriverPositions()
    }
  }, [driverRecencyMode, isVisible, type])

  useEffect(() => {
    if (type === 'client' && isVisible) {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }

      searchTimeoutRef.current = setTimeout(() => {
        fetchClients(searchValue)
      }, SEARCH_DEBOUNCE_MS)
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [searchValue, type, isVisible])

  const normalize = (value?: string) =>
    value
      ?.normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase() ?? ''

  const filteredDrivers = useMemo(() => {
    if (type !== 'driver') return []
    
    let drivers = (Array.isArray(listData) ? listData : []) as DriverRealtime[]
    
    // Filtrar por área selecionada se houver
    if (selectedArea && selectedArea.area && selectedArea.area.length > 0) {
      drivers = drivers.filter((driver) => {
        const lat = Number(driver.latitude)
        const lng = Number(driver.longitude)
        
        if (isNaN(lat) || isNaN(lng)) {
          return false
        }

        return Utils.pointInPolygon({ lat, lng }, selectedArea.area)
      })
    }
    
    // Filtrar por busca de texto
    const normalizedSearch = normalize(searchValue.trim())
    if (!normalizedSearch) {
      return drivers
    }

    return drivers.filter((driver) => {
      const itemAny = driver as any
      const candidates = [
        itemAny?.nickname,
        itemAny?.userNickname,
        itemAny?.userName,
        itemAny?.name,
        itemAny?.userPhone,
        itemAny?.phone,
        itemAny?.userType,
        itemAny?.car?.plate,
        itemAny?.plate
      ]

      return candidates.some((candidate) => normalize(candidate).includes(normalizedSearch))
    })
  }, [listData, searchValue, type, selectedArea])

  const filteredData = type === 'driver' ? filteredDrivers : listData

  const title = type === 'driver' ? 'Lista de motoristas' : 'Lista de clientes'
  const placeholder = 'Buscar por nome...'
  const emptyMessage =
    type === 'driver'
      ? 'Nenhum motorista encontrado.'
      : searchValue.trim()
        ? 'Nenhum cliente encontrado com esse nome.'
        : 'Nenhum cliente cadastrado.'

  const renderDriverItem = (item: DriverRealtime) => (
    <CardDriver 
      key={item.idDriver}
      onClick={() => {
        if (onDriverSelect) {
          onDriverSelect(item)
        }
        setIsVisible(false)
      }}
      style={{ cursor: onDriverSelect ? 'pointer' : 'default' }}
    >
      <CardRow>
        <DriverAvatar>
          <ImageDriver
            src={getDriverPhotoUrl(item.profileImage) || AvatarWoman}
            preview={false}
            onError={(e) => {
              e.currentTarget.onerror = null
              e.currentTarget.src = AvatarWoman
            }}
          />
        </DriverAvatar>
        <DriverInfo>
          <TextCard>
            {(item as any).userName || (item as any).name || item.nickname || 'Motorista'}{(item as any).userType ? ` - ${(item as any).userType}` : ''}{(item as any).car?.plate ? ` (${(item as any).car.plate})` : ''}
          </TextCard>
        </DriverInfo>
        <CircleStatus status={item.status}>
          <BsCircleFill />
        </CircleStatus>
      </CardRow>
    </CardDriver>
  )

  const renderClientItem = (item: ClientData) => (
    <CardClient 
      key={item.idCustomer}
      onClick={() => {
        if (onClientSelect) {
          onClientSelect(item)
        }
        setIsVisible(false)
      }}
      style={{ cursor: onClientSelect ? 'pointer' : 'default' }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: 16
        }}
      >
        <ClientAvatar>
          <Imageclient
            src={getCustomerPhotoUrl(item.profileImage) || AvatarWoman}
            preview={false}
            onError={(e) => {
              e.currentTarget.onerror = null
              e.currentTarget.src = AvatarWoman
            }}
          />
        </ClientAvatar>
        <ClientInfo>
          <p>{item.name}</p>
          <p>{item.email}</p>
          <p>
            {item.phone} - {item.status}
          </p>
        </ClientInfo>
        <Status>
          <BsCircleFill
            style={{
              color: item.status === 'ATIVO' ? '#15c515' : '#FF0000',
              display: 'flex',
              alignItems: 'center'
            }}
          />
        </Status>
      </div>
    </CardClient>
  )

  return (
    <Modal
      open={isVisible}
      onCancel={() => setIsVisible(false)}
      footer={<Button onClick={() => setIsVisible(false)}>Fechar</Button>}
      bodyStyle={{ padding: 16 }}
      width={760}
      centered
    >
      <ModalContainer>
        <ModalHeader>
          <p>{title}</p>
          <SearchInput
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder={placeholder}
          />
        </ModalHeader>

        {loading && listData.length === 0 ? (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 20 }}>
            <Loader spinning />
          </div>
        ) : (
          <ScrollableList>
            {filteredData?.length ? (
              filteredData.map((item) => {
                if (type === 'driver' && isDriver(item)) {
                  return renderDriverItem(item)
                }
                if (type === 'client' && isClient(item)) {
                  return renderClientItem(item)
                }
                return null
              })
            ) : (
              <EmptyState>{emptyMessage}</EmptyState>
            )}
          </ScrollableList>
        )}
      </ModalContainer>
    </Modal>
  )
}

export default ListModal

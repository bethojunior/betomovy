import AvatarWoman from '@/assets/avatar.png'
import { getCustomerPhotoUrl, getDriverPhotoUrl } from '@/utils/imageUtils'
import { Button, Modal } from 'antd'
import { FC, useEffect, useMemo, useRef, useState } from 'react'
import { BsCircleFill } from 'react-icons/bs'
import { Loader } from '../../../../components/Loader'
import api from '../../../../services/api'
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
  return itemAny?.idCustomer !== undefined && itemAny?.idCustomer !== null
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
  driverRecencyMode = 'recent'
}) => {
  const [searchValue, setSearchValue] = useState('')
  const [listData, setListData] = useState<(DriverRealtime | ClientData)[]>([])
  
  const allDriversRef = useRef<DriverRealtime[]>([])
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const fetchDriverPositions = async () => {
    if (!isVisible || type !== 'driver') {
      return
    }
    
    try {
      const response = await api.get(`/driver/positions`, {
        params: {
          status: 'disponivel,corrida,boarding,in_progress,accepted,desligado',
        }
      })

      const allResults: DriverRealtime[] = response.data?.response ?? []
      const filteredResults =
        driverRecencyMode === 'recent'
          ? filterDriversByOfflineRecency(allResults)
          : allResults
      allDriversRef.current = filteredResults

      if (isVisible && type === 'driver') {
        setListData(filteredResults)
      }
    } catch (error) {
      console.error('Erro ao buscar motoristas:', error)
    }
  }

  const fetchClients = async (filter: string) => {
    if (type !== 'client') return
    
    try {
      const response = await api.get(`customer?page=1&name=${encodeURIComponent(filter)}`)
      const clients = response.data?.response?.data || []
      setListData(clients)
    } catch (error) {
      console.error('Erro ao buscar clientes:', error)
      setListData([])
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

      if (searchValue.trim()) {
        searchTimeoutRef.current = setTimeout(() => {
          fetchClients(searchValue)
        }, SEARCH_DEBOUNCE_MS)
      } else {
        setListData([])
      }
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
        itemAny?.userPhone,
        itemAny?.userType
      ]

      return candidates.some((candidate) => normalize(candidate).includes(normalizedSearch))
    })
  }, [listData, searchValue, type, selectedArea])

  const filteredData = type === 'driver' ? filteredDrivers : listData

  const title = type === 'driver' ? 'Lista de motoristas' : 'Lista de clientes'
  const placeholder = 'Buscar por nome...'
  const emptyMessage = type === 'driver' 
    ? 'Nenhum motorista encontrado.'
    : searchValue 
      ? 'Nenhum cliente encontrado.' 
      : 'Digite um nome para buscar.'

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
            {item.nickname || item.userName} - {item.userType}
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

        {type === 'driver' && allDriversRef.current.length === 0 ? (
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

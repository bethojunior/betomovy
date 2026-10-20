import { Button, Modal, Spin } from 'antd'
import { FC, useEffect, useState } from 'react'
import { BsCircleFill } from 'react-icons/bs'
import api from '../../../../services/api'
import {
  ModalContainer,
  ModalHeader,
  ScrollableList,
  EmptyState,
  AreaCard,
  AreaInfo,
  AreaStatus,
} from './styles'

interface AreaPoint {
  lat: number
  lng: number
}

interface MonitoringArea {
  id: number
  name: string
  cityId: number
  active: number
  area: AreaPoint[]
}

interface ModalProps {
  showMonitoringArea: boolean
  setShowMonitoringArea: (res: boolean) => void
  onAreaSelect?: (area: MonitoringArea) => void
}

const MonitoringAreaModal: FC<ModalProps> = ({ showMonitoringArea, setShowMonitoringArea, onAreaSelect }) => {
  const [areas, setAreas] = useState<MonitoringArea[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  const getMonitoringAreaData = async () => {
    setLoading(true)
    try {
      const result = await api.get(`monitoringArea`)
      const raw = result.data?.data || result.data?.response?.data || result.data?.response || []
      const items = Array.isArray(raw)
        ? raw.filter((item: any) => item && typeof item === 'object' && (item.id || item.name || item.area))
        : []
      setAreas(items)
    } catch (error) {
      console.error('Error fetching monitoring area data:', error)
      setAreas([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (showMonitoringArea) {
      getMonitoringAreaData()
    }
  }, [showMonitoringArea])

  return (
    <div>
      <Modal
        open={showMonitoringArea}
        onCancel={() => setShowMonitoringArea(false)}
        footer={[
          <Button key="back" onClick={() => setShowMonitoringArea(false)}>
            Fechar
          </Button>
        ]}
        bodyStyle={{ padding: 16 }}
        width={560}
        centered
      >
        <ModalContainer>
          <ModalHeader>
            <p>Área de Monitoramento</p>
          </ModalHeader>

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '24px' }}>
              <Spin size="large" />
            </div>
          ) : areas.length === 0 ? (
            <EmptyState>
              <p>Nenhuma área de monitoramento encontrada</p>
            </EmptyState>
          ) : (
            <ScrollableList>
              {areas.map((area) => {
                const isActive =
                  area.active === 1 ||
                  (area as any).active === true ||
                  String((area as any).active) === '1'

                return (
                  <AreaCard
                    key={area.id}
                    onClick={() => {
                      if (onAreaSelect) {
                        onAreaSelect(area)
                      }
                      setShowMonitoringArea(false)
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    <AreaInfo>
                      <p style={{ fontWeight: 600, fontSize: '16px', margin: 0 }}>
                        {area.name || `Área #${area.id}`}
                      </p>
                    </AreaInfo>
                    <AreaStatus>
                      <BsCircleFill
                        color={isActive ? '#10b981' : '#ef4444'}
                        size={12}
                      />
                      <span style={{ marginLeft: '6px', fontSize: '14px' }}>
                        {isActive ? 'Ativa' : 'Inativa'}
                      </span>
                    </AreaStatus>
                  </AreaCard>
                )
              })}
            </ScrollableList>
          )}
        </ModalContainer>
      </Modal>
    </div>
  )
}
export default MonitoringAreaModal

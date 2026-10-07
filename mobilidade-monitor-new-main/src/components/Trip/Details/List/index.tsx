import { Button } from 'antd'
import { FC, useEffect, useRef, useState } from 'react'
import { HiOutlineChatAlt2 } from 'react-icons/hi'
import swal from 'sweetalert'

const COMPACT_ACTIONS_BREAKPOINT = 800

import api from '../../../../services/api'
import Mask from '../../../../services/Mask'
import { getCustomerPhotoUrl } from '../../../../utils/imageUtils'
import DocumentsCostumerModal from '../../../Client/PhysicalPerson/Modal/Documents'
import Preload from '../../../Utils/Preload'
import AvatarWithFallback from '../../../Utils/AvatarWithFallback'
import ChatModal from '../Modal/ChatModal'
import { CancellationInfo } from './CancellationInfo'
import { CustomerWhatsAppButton } from './CustomerWhatsAppButton'
import {
  ClientDetails,
  DetailsTolls,
  HeaderActions,
  HeaderDetailing,
  HeaderMessage,
  HeaderRow,
  Information,
  ItemList,
  SectionList,
  SectionTolls,
  Situation,
  Title,
  TitleChatButton
} from './styles'

import { ListProps } from './types'

const formatNumber = (valor: number): string => {
  return valor.toLocaleString('pt-br', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}

const formatPercentage = (valor: number): string => {
  return valor % 1 === 0
    ? String(valor)
    : valor.toLocaleString('pt-br', {
        minimumFractionDigits: 1,
        maximumFractionDigits: 2
      })
}

const ListDetails: FC<ListProps> = ({
  data,
  status,
  priceMinutesTrip,
  priceTrip,
  tripReference
}) => {
  const [chatMessage, setChatMessage] = useState([])
  const [documentsModal, setDocumentsModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [chatModal, setChatModal] = useState(false)
  const [hideActionLabels, setHideActionLabels] = useState(false)
  const headerDetailingRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = headerDetailingRef.current
    if (!element) return

    const observer = new ResizeObserver(([entry]) => {
      setHideActionLabels(entry.contentRect.width < COMPACT_ACTIONS_BREAKPOINT)
    })

    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  const getChat = () => {
    setLoading(true)
    api(`chat/${tripReference}`)
      .then((result) => {
        setLoading(false)
        if (result.status) {
          if (result.data.response.length === 0) {
            swal({
              title: 'Não houveram mensagens nessa corrida',
              text: '',
              icon: 'info'
            })
            return
          }

          setChatMessage(result.data.response)
          setChatModal(true)
        }
      })
      .catch((error) => {
        console.log(error)
        swal({
          title: 'Não foi possível carregar as mensagens da corrida',
          text: 'Tente novamente',
          icon: 'error'
        })
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const handleCloseModal = () => {
    setChatModal(false)
    setDocumentsModal(false)
  }

  return (
    <>
      <Preload visible={loading} />
      <ChatModal
        tripReference={tripReference}
        data={chatMessage}
        visibility={chatModal}
        closeModal={handleCloseModal}
      />
      <DocumentsCostumerModal
        handleCancelProps={handleCloseModal}
        visibility={documentsModal}
        idUser={data?.userId}
        idCustomer={data?.customerId}
      />
      <div>
        <HeaderDetailing ref={headerDetailingRef}>
          <HeaderRow>
            <AvatarWithFallback
              src={getCustomerPhotoUrl(data?.customerPhoto)}
              alt="foto do cliente"
              size={80}
            />
            <ClientDetails>
              <Title>Cliente</Title>
              <Information>{data?.customerName}</Information>
              <Button
                size="small"
                type="text"
                onClick={() => setDocumentsModal(true)}
                style={{ padding: 0, color: '#1890ff' }}
              >
                Ver documentos
              </Button>
            </ClientDetails>
          </HeaderRow>
          <HeaderActions>
            <CustomerWhatsAppButton
              phone={data?.customerPhone}
              customerName={data?.customerName}
              hideLabel={hideActionLabels}
            />
            <Button type="text" title="Ver chat" style={{ height: '100%' }} onClick={getChat}>
              <HiOutlineChatAlt2 style={{ fontSize: 30 }} />
              {!hideActionLabels && <TitleChatButton>Ver chat</TitleChatButton>}
            </Button>
          </HeaderActions>
        </HeaderDetailing>
        {!data?.driverId && (
          <HeaderMessage>
            Nenhum motorista aceitou antes do cancelamento pelo cliente.
          </HeaderMessage>
        )}
        <div style={{ padding: 10 }}>
          <div>
            <Title>VIAGEM</Title>
            <SectionList>
              <ItemList>Status</ItemList>
              <Information>{status}</Information>
            </SectionList>
            <SectionList>
              <ItemList>Situação</ItemList>
              <Situation>{data?.situation}</Situation>
            </SectionList>
            <SectionList>
              <ItemList>Tipo de chamado</ItemList>
              <Information>{data?.tripCallType}</Information>
            </SectionList>
            <CancellationInfo
              canceledBy={data?.canceledBy}
              status={data?.status}
              cancellationReasons={data?.cancellationReasons}
              cancellationDate={data?.endDate}
            />
          </div>
          <div style={{ marginTop: 10 }}>
            <Title>DETALHES FINANCEIROS</Title>
            <SectionList>
              <ItemList>Multiplicador (Dinâmica, Bandeiras, Gatilhos)</ItemList>
              <Information>{data?.multiplierDynamic}</Information>
            </SectionList>
            <SectionList>
              <ItemList>Preço base</ItemList>
              <Information>+ {Mask.setMaskMoneyNumber(Number(data?.fare?.base_price))}</Information>
            </SectionList>
            <SectionList>
              <ItemList>
                Preço KM ({data?.fare?.km_price || 0} x{' '}
                {Number(priceTrip).toLocaleString('pt-br', {
                  style: 'currency',
                  currency: 'BRL'
                })}
                )
              </ItemList>
              <Information>
                +{' '}
                {((data?.fare?.km_price || 0) * priceTrip).toLocaleString('pt-br', {
                  style: 'currency',
                  currency: 'BRL'
                })}
              </Information>
            </SectionList>
            <SectionList>
              <ItemList>
                Preço minuto ({data?.fare?.minute_price} x {priceMinutesTrip})
              </ItemList>
              <Information>
                + {Mask.setMaskMoneyNumber((data?.fare?.minute_price || 0) * priceMinutesTrip)}
              </Information>
            </SectionList>
            <SectionList>
              <ItemList>
                Taxa motorista (
                {data?.driver_commission?.valueType === '%'
                  ? `% ${formatNumber(Number(data?.driver_commission?.value))}`
                  : `R$ ${Mask.setMaskMoneyNumber(Number(data?.driver_commission?.value))}`}
                )
              </ItemList>
              <Information>
                -
                {data?.driver_commission?.valueType === '%'
                  ? Mask.setMaskMoneyTruncated(
                      (data?.price * Number(data?.driver_commission?.value)) / 100
                    )
                  : Mask.setMaskMoneyNumber(Number(data?.driver_commission?.value))}
              </Information>
            </SectionList>

            {!!data?.paymentFormFee && Number(data.paymentFormFee) > 0 && (
              <SectionList>
                <ItemList>Taxa por forma de pagamento</ItemList>
                <Information>- {Mask.setMaskMoneyNumber(Number(data.paymentFormFee))}</Information>
              </SectionList>
            )}

            <SectionList>
              <ItemList>{data?.fare?.tax_price_description || 'Taxa de imposto'}</ItemList>
              <Information>+ {Mask.setMaskMoneyNumber(Number(data?.fare?.tax_price_value))}</Information>
            </SectionList>
            <SectionList>
              <ItemList>{data?.fare?.another_fee_description || 'Taxa extra'}</ItemList>
              <Information>+ {Mask.setMaskMoneyNumber(Number(data?.fare?.another_fee_value))}</Information>
            </SectionList>
            {data?.taxes?.length === 0
              ? ''
              : data?.taxes?.map((tax, index) => {
                  return (
                    <SectionList key={`tax-${index}-${tax.name}`}>
                      <ItemList>
                        {tax.name}
                        {tax.valueType === '%' && ` (%${formatPercentage(tax.value)})`}
                      </ItemList>
                      <Information>
                        {tax.chargeBy === 'customer' ? '+' : '-'}{' '}
                        {Mask.setMaskMoneyNumber(Number(tax.chargedValue))}
                      </Information>
                    </SectionList>
                  )
                })}
            <SectionTolls>
              <ItemList>Pedágios</ItemList>
              {data?.tolls?.length === 0
                ? 'Não houve pedágio'
                : data?.tolls?.map((item) => {
                    return (
                      <DetailsTolls>
                        <Information>{item.name}</Information>
                        <Information>R$ {Mask.setMaskMoneyNumber(item.value)}</Information>
                      </DetailsTolls>
                    )
                  })}
            </SectionTolls>
            <SectionList>
              <ItemList>
                Paradas ({data?.fare?.waypoint_price} x {data?.trip_way_points?.length})
              </ItemList>
              <Information>
                +{' '}
                {Mask.setMaskMoneyNumber(
                  (data?.fare?.waypoint_price || 0) * (data?.trip_way_points?.length || 0)
                )}
              </Information>
            </SectionList>
            <SectionList>
              <ItemList>Valor por longa distância</ItemList>
              <Information>
                + R${' '}
                {data?.trip_long_distance != null
                  ? Mask.setMaskMoneyNumber(data.trip_long_distance.value)
                  : '0,00'}
              </Information>
            </SectionList>
            <SectionList>
              <ItemList>Distância para cobrar valor adicional</ItemList>
              <Information>{data?.fare?.km_to_additional_value} km</Information>
            </SectionList>
            <SectionList>
              <ItemList>Valor adicional</ItemList>
              <Information>
                + {Mask.setMaskMoneyNumber(Number(data?.fare?.additional_value_after_km))}
              </Information>
            </SectionList>
            <SectionList>
              <ItemList>Preço estimado</ItemList>
              <Information>
                {' '}
                {data?.recalculated_trip
                  ? Mask.setMaskMoneyNumber(data?.recalculated_trip.oldPrice)
                  : Mask.setMaskMoneyNumber(Number(data?.price))}
              </Information>
            </SectionList>
            <SectionList>
              <ItemList>Total cobrado</ItemList>
              <Information>{Mask.setMaskMoneyNumber(Number(data?.price))}</Information>
            </SectionList>
            <SectionList>
              <ItemList>Valor líquido</ItemList>
              <Information>
                {data?.driverValue != null
                  ? Mask.setMaskMoneyNumber(Number(data.driverValue))
                  : 'Não disponível'}
              </Information>
            </SectionList>
          </div>
        </div>
      </div>
    </>
  )
}

export default ListDetails

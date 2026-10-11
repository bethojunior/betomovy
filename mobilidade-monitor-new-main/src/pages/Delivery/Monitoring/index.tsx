import { FC, useState, useEffect, useRef } from 'react';
import { Modal, Button } from 'antd';
import 'mapbox-gl/dist/mapbox-gl.css';
import api from '../../../services/api';
import Session from '../../../utils/Session';
import { Map, MapRef } from 'react-map-gl';
import { useMapbox } from '../../../contexts/mapbox';
import { DeliveryDriverMarker } from '../../../components/Driver/DeliveryMarker';
import { CityDelimiter } from '../../../components/Monitoring/Markers/CityDelimiter';
import {
  DeliveryMonitoringContainer,
  ContentMap,
  OrderActivesContainer,
  LoadingContainer,
  LoadingSpinner,
  OrderCard,
  OrderCardContent,
  CompanyLogo,
  OrderInfo,
  CompanyName,
  OrderMeta,
  OrderId,
  StatusBadge,
  ModalContent,
  ModalHeader,
  ModalCompanyLogo,
  ModalCompanyInfo,
  ModalCompanyName,
  ModalOrderInfo,
  ItemsList,
  ItemRow,
  ItemQuantity,
  ItemName,
  ItemPrice,
  PriceSummary,
  PriceRow,
  TotalRow,
  InfoSection,
  InfoTitle,
  InfoText,
  EmptyOrdersMessage,
  MapLoadingSpinner
} from './styles';

interface DeliveryOrder {
  id: string;
  value: number;
  deliveryFee?: number;
  changeValue?: number;
  orderDeliveryTypeId: number;
  company: {
    fantasyName: string;
    companyDeliveryConfig?: {
      picture?: string;
    };
    address?: string;
  };
  companyAddress?: {
    address: string;
  };
  deliveryOrderStatus?: {
    label: string;
  };
  deliveryPaymentForm?: {
    name: string;
  };
  deliveryOrderPlace?: {
    place: {
      address: string;
    };
  };
  deliveryOrderItems?: Array<{
    quantity: number;
    deliveryProduct: {
      name: string;
      price: number;
    };
  }>;
}



export const DeliveryMonitoring: FC = () => {
  const [orders, setOrders] = useState<DeliveryOrder[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<DeliveryOrder | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [ordersVisible, setOrdersVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [deliveryDrivers, setDeliveryDrivers] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const mapRef = useRef<MapRef>();
  const { mapboxToken, loading: mapboxLoading } = useMapbox();

  const citySelected = Session.getLocal('citySelected');
  const cityId = citySelected?.cityId;



  useEffect(() => {
    if (cityId && mapLoaded) {
      getDrivers();
    }

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    if (cityId && mapLoaded) {
      intervalRef.current = setInterval(() => {
        getDrivers();
        if (ordersVisible) {
          getActiveOrders();
        }
      }, 10000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [cityId, mapLoaded, ordersVisible]);

  const getDrivers = async () => {
    try {
      const response = await api.get('driver/delivery');

      if (response.data.status) {
        const resp = response.data.response;
        setDeliveryDrivers(Array.isArray(resp) ? resp : (Array.isArray(resp?.data) ? resp.data : []));
      }
    } catch (error) {
      console.error('Erro ao buscar motoristas:', error);
    }
  };

  const getActiveOrders = async () => {
    if (!cityId) return;
    
    setLoading(true);
    try {
      const response = await api.get(`deliveryOrder/${cityId}/actives`);
      if (response.data.status) {
        const resp = response.data.response;
        const ordersData = Array.isArray(resp) ? resp : (Array.isArray(resp?.data) ? resp.data : []);
        setOrders(ordersData);
        if (ordersData.length > 0 && !ordersVisible) {
          setOrdersVisible(true);
        }
      }
    } catch (error) {
      console.error('Erro ao buscar pedidos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOrdersToggle = () => {
    const newVisible = !ordersVisible;
    setOrdersVisible(newVisible);
    if (newVisible) {
      getActiveOrders();
    }
  };

  const showOrderDetails = (order: DeliveryOrder) => {
    setSelectedOrder(order);
    setModalVisible(true);
  };

  const formatMoney = (value: number) => {
    return value?.toFixed(2).replace('.', ',') || '0,00';
  };

  const handleMapLoaded = () => {
    setMapLoaded(true);
  };


  const defaultCoords = { x: -38.5434, y: -3.7319 };

  if (error) {
    return (
      <DeliveryMonitoringContainer>
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h3>Erro: {error}</h3>
          <Button onClick={() => window.location.reload()}>Recarregar</Button>
        </div>
      </DeliveryMonitoringContainer>
    );
  }

  if (!citySelected) {
    return (
      <DeliveryMonitoringContainer>
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h3>Nenhuma cidade selecionada</h3>
          <p>Por favor, selecione uma cidade para continuar.</p>
        </div>
      </DeliveryMonitoringContainer>
    );
  }

  return (
    <DeliveryMonitoringContainer>
      <OrderActivesContainer active={ordersVisible}>
        <label className="order-label" onClick={handleOrdersToggle}>
          Pedidos Ativos
        </label>
        <hr />
        <div className="order-container">
          {loading ? (
            <LoadingContainer>
              <LoadingSpinner />
            </LoadingContainer>
          ) : (orders || []).length > 0 ? (
            (orders || []).map(order => (
              <OrderCard key={order.id} onClick={() => showOrderDetails(order)}>
                <OrderCardContent>
                  <CompanyLogo 
                    style={{ backgroundImage: `url(${(order.company as any)?.company_delivery_config?.picture || ''})` }}
                  />
                  <OrderInfo>
                    <CompanyName>
                      {order.company?.fantasyName || 'Empresa não informada'}
                    </CompanyName>
                    <OrderMeta>
                      <OrderId>#{order.id}</OrderId>
                      <StatusBadge>
                        {(order as any).delivery_order_status?.label || 'Status'}
                      </StatusBadge>
                    </OrderMeta>
                  </OrderInfo>
                </OrderCardContent>
              </OrderCard>
            ))
          ) : (
            <EmptyOrdersMessage>
              Nenhum pedido ativo no momento
            </EmptyOrdersMessage>
          )}
        </div>
      </OrderActivesContainer>
      
      <ContentMap>
        {mapboxLoading || !mapboxToken ? (
          <MapLoadingSpinner>
            <LoadingSpinner />
          </MapLoadingSpinner>
        ) : null}
        {!mapboxLoading && mapboxToken && (
          <Map
            ref={(ref: MapRef) => {
              mapRef.current = ref;
            }}
            mapboxAccessToken={mapboxToken}
            initialViewState={{
              longitude: defaultCoords.x,
              latitude: defaultCoords.y,
              zoom: 11,
            }}
            mapStyle="mapbox://styles/mapbox/streets-v9"
            onLoad={handleMapLoaded}
            onError={(error) => {
              console.error('Erro no mapa:', error);
              setError('Erro ao carregar o mapa');
            }}
            style={{ height: '100vh', width: '100vw' }}
          >
            {citySelected?.pointsCity && (
              <CityDelimiter coordinates={citySelected.pointsCity} />
            )}
            {(deliveryDrivers || []).length > 0 && (deliveryDrivers || []).map((driver) => (
              <DeliveryDriverMarker key={driver.idDriver} driver={driver} />
            ))}
          </Map>
          )}
      </ContentMap>

      <Modal
        title="Detalhes do Pedido"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button key="close" type="primary" danger onClick={() => setModalVisible(false)}>
            Fechar
          </Button>
        ]}
        width={420}
      >
        {selectedOrder && (
          <ModalContent>
            <ModalHeader>
              <ModalCompanyLogo 
                style={{ backgroundImage: `url(${(selectedOrder.company as any)?.company_delivery_config?.picture || ''})` }}
              />
              <ModalCompanyInfo>
                <ModalCompanyName>
                  {selectedOrder.company.fantasyName}
                </ModalCompanyName>
                <ModalOrderInfo>
                  #{selectedOrder.id} • {(selectedOrder as any).delivery_order_status?.label}
                </ModalOrderInfo>
              </ModalCompanyInfo>
            </ModalHeader>

            <ItemsList>
              {(selectedOrder as any).delivery_order_items?.map((item: any, index: number) => (
                <ItemRow key={index} isLast={index === (selectedOrder as any).delivery_order_items.length - 1}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <ItemQuantity>{item.quantity}</ItemQuantity>
                    <ItemName>{item.delivery_product?.name || 'Produto'}</ItemName>
                  </div>
                  <ItemPrice>
                    R$ {formatMoney(item.delivery_product?.price || item.value)}
                  </ItemPrice>
                </ItemRow>
              )) || []}
            </ItemsList>

            <PriceSummary>
              <PriceRow>
                <span>Subtotal</span>
                <span>R$ {formatMoney(selectedOrder.deliveryFee ? selectedOrder.value - selectedOrder.deliveryFee : selectedOrder.value)}</span>
              </PriceRow>
              {selectedOrder.deliveryFee && (
                <PriceRow>
                  <span>Taxa de entrega</span>
                  <span>R$ {formatMoney(selectedOrder.deliveryFee)}</span>
                </PriceRow>
              )}
              <TotalRow>
                <span>Total</span>
                <span>R$ {formatMoney(selectedOrder.value)}</span>
              </TotalRow>
            </PriceSummary>

            <InfoSection>
              <InfoTitle>Pagamento</InfoTitle>
              <InfoText>
                {(selectedOrder as any).delivery_payment_form?.name || 'Não informado'}
                {selectedOrder.changeValue && ` • Troco: R$ ${formatMoney(selectedOrder.changeValue)}`}
              </InfoText>
            </InfoSection>

            <InfoSection>
              <InfoTitle>
                {selectedOrder.orderDeliveryTypeId === 1 ? 'Entrega' : 'Retirada'}
              </InfoTitle>
              <InfoText>
                {selectedOrder.orderDeliveryTypeId === 1 
                  ? (selectedOrder as any).delivery_order_place?.place?.address || 'Endereço não informado'
                  : (selectedOrder as any).company_address?.address || 'Endereço não informado'}
              </InfoText>
            </InfoSection>
          </ModalContent>
        )}
      </Modal>
    </DeliveryMonitoringContainer>
  );
};

export default DeliveryMonitoring;
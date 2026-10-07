import {useBubbleButton} from '@704apps/react-native-bubble-button';
import {useUserDriver} from '../../context/userDriver';
import {useEffect, useRef, useState} from 'react';
import io from 'socket.io-client';
import {buildApp} from '../../../../constantBuild/config';
import {useDeliveryOrder} from '../../../../context/DeliveryOrder';
import {DeliveryOrderService} from '../../../../context/DeliveryOrder/services';
import {useAuth} from '../../../../context/auth';

export const TripRealtimeDeliverySocket = () => {
  const {userDriverFind} = useUserDriver();
  const {openApp} = useBubbleButton();
  const socketRef = useRef(null);
  const {setOrderTrip, orderTrip, setOrdersActive} = useDeliveryOrder();
  const {cityConfig} = useAuth();

  const setOrderTripCallback = order => {
    if (Number(orderTrip?.id) === Number(order?.id)) {
      return;
    }
    setOrderTrip(order);
  };

  const getActiveDeliveryOrder = async () => {
    if (userDriverFind?.isDeliveryMan === '1') {
      const data = await DeliveryOrderService.getActiveOrders(
        cityConfig?.cityId,
      );
      if (!data?.status) {
        return;
      }
      if (data?.response && data?.response?.length > 0) {
        setOrdersActive(data?.response);
      }
    }
  };

  useEffect(() => {
    getActiveDeliveryOrder();
  }, [orderTrip]);

  useEffect(() => {
    // Verificando se o usuário é um entregador
    if (
      userDriverFind?.isDeliveryMan === '0' ||
      !userDriverFind?.isDeliveryMan
    ) {
      return;
    }
    // Inicialize a conexão de socket diretamente com a URL e opções desejadas
    const socket = io(buildApp().HOST_SOCKETV2, {
      query: `driverId=${userDriverFind?.idDriver}`,
    });
    socketRef.current = socket;

    socket.on(`searchDriverOrder_${userDriverFind?.idDriver}`, order => {
      openApp();
      setOrderTripCallback(order);
    });

    // Limpeza da conexão de socket quando o componente é desmontado
    return () => {
      socket.close();
    };
  }, []);

  return <></>;
};

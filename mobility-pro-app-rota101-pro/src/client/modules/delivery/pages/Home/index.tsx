// @ts-nocheck

import React, { useEffect } from 'react';
import { Modal, View } from 'react-native';
import { useAuth } from '../../../../../context/auth';
import { OfferFingerprint } from '../../../../components/OfferFingerprint';
import OrderServiceRoutes from '../../../../routes/orderservice.routes';
import Bag from '../Bag';
import { useOrderService } from '../../../../contexts/orderService';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeDelivery(props) {
  const { offerBiometry } = useAuth();
  const { setBag, setEstablishment, updateListOrdersActive } = useOrderService()

  const getData = async () => {
    const bagStorage = await AsyncStorage.getItem("bagCache");
    const establishmentStorage = await AsyncStorage.getItem(
      "establishmentCache"
    );

    if (bagStorage) setBag(JSON.parse(bagStorage));

    if (establishmentStorage)
      setEstablishment(JSON.parse(establishmentStorage));
  }

  useEffect(() => {
    getData();
    updateListOrdersActive();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <Modal visible={offerBiometry}>
        <OfferFingerprint />
      </Modal>
      <OrderServiceRoutes />
      <Bag {...props} />
    </View>
  );
}

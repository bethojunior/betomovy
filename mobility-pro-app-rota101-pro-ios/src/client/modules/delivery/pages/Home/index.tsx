// @ts-nocheck

import React from 'react';
import {Modal, View} from 'react-native';
import {useAuth} from '../../../../../context/auth';
import {OfferFingerprint} from '../../../../components/OfferFingerprint';
import OrderServiceRoutes from '../../../../routes/orderservice.routes';
import Bag from '../Bag';

export default function HomeDelivery(props) {
  const {offerBiometry} = useAuth();
  return (
    <View style={{flex: 1}}>
      <Modal visible={offerBiometry}>
        <OfferFingerprint />
      </Modal>
      <OrderServiceRoutes />
      <Bag {...props} />
    </View>
  );
}

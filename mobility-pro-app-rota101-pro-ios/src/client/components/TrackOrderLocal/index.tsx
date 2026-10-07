// @ts-nocheck

import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {DELIVERY_TYPE} from '../../constants/orderDeliveryType';
import {translate} from '../../locales';
import {SimpleText, styles} from './styles';

export default function TrackOrderLocal({order}) {
  function getAddress() {
    if (order.orderDeliveryTypeId === DELIVERY_TYPE)
      return order.delivery_order_place
        ? order.delivery_order_place.place.address
        : null;

    return order.company_address.address;
  }

  return (
    <View style={styles.containerLocal}>
      <SimpleText>
        {order.orderDeliveryTypeId === DELIVERY_TYPE
          ? translate('trackOrderLocal.text_delivery_address')
          : translate('trackOrderLocal.text_pickup_address')}
      </SimpleText>
      <SimpleText style={styles.labelLocal}>{getAddress()}</SimpleText>
    </View>
  );
}

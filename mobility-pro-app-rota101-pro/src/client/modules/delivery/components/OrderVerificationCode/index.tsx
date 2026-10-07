// @ts-nocheck

import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {AntDesign} from '@expo/vector-icons';
import {translate} from '../../../../locales';
import {order_confirmed, order_delivered} from '../../../../constants';
import {WITHDRAWAL_TYPE} from '../../../../constants/orderDeliveryType';
import {styles} from './styles';

export default function OrderVerificationCode({order}) {
  function isVerificationCode() {
    if (order.orderDeliveryTypeId === WITHDRAWAL_TYPE) return false;

    if (!order.verificationCode) return false;

    return (
      order.delivery_order_status.id > order_confirmed &&
      order.delivery_order_status.id <= order_delivered
    );
  }

  if (!isVerificationCode()) return true;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {translate('orderVerificationCode.title')}
      </Text>
      <View style={styles.contentCode}>
        <AntDesign name="lock" size={30} color="black" />
        <Text style={styles.textCode}>{order.verificationCode}</Text>
      </View>
    </View>
  );
}

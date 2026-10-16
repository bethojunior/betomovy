// @ts-nocheck

import React, { useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { order_confirmed, order_delivered } from '../../../../constants';
import { WITHDRAWAL_TYPE } from '../../../../constants/orderDeliveryType';

import { translate } from '../../../../locales';
import { styles } from './styles';

export default function PreviewDeliveryTime({ order }) {
  const start = new Date(
    order.startDeliveryTime &&
    `${order.startDeliveryTime.replace(' ', 'T')}.000+00:00`,
  );
  const end = new Date(
    order.endDeliveryTime &&
    `${order.endDeliveryTime.replace(' ', 'T')}.000+00:00`,
  );

  const formatDate = useCallback(date => {
    const time = date.toLocaleTimeString();
    const timeSplit = time?.split(':');

    return `${timeSplit[0]}:${timeSplit[1]}`;
  }, []);

  function isOrderDelivered() {
    if (!order.startDeliveryTime) return false;

    return (
      order.delivery_order_status.id > order_confirmed &&
      order.delivery_order_status.id <= order_delivered
    );
  }

  if (!isOrderDelivered()) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.description}>
        {order.orderDeliveryTypeId === WITHDRAWAL_TYPE
          ? translate('previewDeliveryTime.forecast_withdraw_text')
          : translate('previewDeliveryTime.text_delivery_forecast')}{' '}
      </Text>
      <Text style={styles.time}>
        {translate('previewDeliveryTime.text_today')}, {formatDate(start)}
        {order.orderDeliveryTypeId === WITHDRAWAL_TYPE
          ? ''
          : ` ${formatDate(end)}`}
      </Text>
    </View>
  );
}

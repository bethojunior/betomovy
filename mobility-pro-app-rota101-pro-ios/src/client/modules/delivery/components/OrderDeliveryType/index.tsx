// @ts-nocheck

import {useNavigation} from '@react-navigation/native';
import React, {useCallback} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {
  DELIVERY_TYPE,
  WITHDRAWAL_TYPE,
} from '../../../../constants/orderDeliveryType';
import {useOrderService} from '../../../../contexts/orderService';
import OrderLocal from '../OrderLocal';
import WithdrawInLocal from '../WithdrawInLocal';

import {translate} from '../../../../locales';
import {styles} from './styles';

export default function OrderDeliveryType() {
  const {orderDeliveryType, setOrderDeliveryType} = useOrderService();

  const navigation = useNavigation();

  const handleOrderDeliveryTypeSelected = useCallback(
    value => {
      setOrderDeliveryType(value);
    },
    [orderDeliveryType],
  );

  const verifyActiveType = useCallback(
    (value, style) => {
      if (orderDeliveryType === value) return style;
      return null;
    },
    [orderDeliveryType],
  );

  const ShowOrderDeliveryTypeOption = useCallback(() => {
    switch (orderDeliveryType) {
      case DELIVERY_TYPE:
        return <OrderLocal navigation={navigation} />;
      case WITHDRAWAL_TYPE:
        return <WithdrawInLocal />;
      default:
        return null;
    }
  }, [orderDeliveryType]);

  return (
    <>
      <View style={styles.container}>
        <TouchableOpacity
          style={[
            styles.button,
            verifyActiveType(DELIVERY_TYPE, styles.buttonActive),
          ]}
          onPress={() => handleOrderDeliveryTypeSelected(DELIVERY_TYPE)}
        >
          <Text
            style={[
              styles.buttonText,
              verifyActiveType(DELIVERY_TYPE, styles.buttonTextActive),
            ]}
          >
            {translate('orderDeliveryType.text_delivery')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.button,
            verifyActiveType(WITHDRAWAL_TYPE, styles.buttonActive),
          ]}
          onPress={() => handleOrderDeliveryTypeSelected(WITHDRAWAL_TYPE)}
        >
          <Text
            style={[
              styles.buttonText,
              verifyActiveType(WITHDRAWAL_TYPE, styles.buttonTextActive),
            ]}
          >
            {translate('orderDeliveryType.text_withdrawal')}
          </Text>
        </TouchableOpacity>
      </View>
      <ShowOrderDeliveryTypeOption />
    </>
  );
}

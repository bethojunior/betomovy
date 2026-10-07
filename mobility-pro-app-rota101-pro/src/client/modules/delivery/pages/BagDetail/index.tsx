/* eslint-disable eqeqeq */
// @ts-nocheck

import React, {useEffect} from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import {useOrderService} from '../../../../contexts/orderService';
import OrderEstablishment from '../../components/OrderEstablishment';
import OrderProducts from '../../components/OrderProducts';
import OrderDetailValues from '../../components/OrderDetailValues';
import OrderPaymentForm from '../../../../components/OrderPaymentForm';
import OrderFooter from '../../components/OrderFooter';
import OrderCoupon from '../../../../components/OrderCoupon';
import OrderDeliveryType from '../../components/OrderDeliveryType';
import {styles} from './styles';

export default function BagDetail({navigation}) {
  const {bag, setCoupon} = useOrderService();

  useEffect(() => {
    if (bag.length == 0) {
      setCoupon(null);
      navigation.goBack();
    }
  }, [bag]);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        <OrderDeliveryType />
        <OrderEstablishment />
        <OrderProducts navigation={navigation} />
        <OrderDetailValues />
        <OrderCoupon />
        <OrderPaymentForm navigation={navigation} />
      </ScrollView>
      <OrderFooter navigation={navigation} />
    </View>
  );
}

/* eslint-disable consistent-return */
// @ts-nocheck

import React, {useState, useEffect} from 'react';
import {View, StyleSheet, ScrollView, Alert, AppState} from 'react-native';
import apiDelivery from '../../../../api/apiDelivery';
import LoadView from '../../../../components/LoadView';
import OrderTimeline from '../../components/OrderTimeline';
import AppSocket from '../../../../services/socket';
import DriverDeliveryOrder from '../../../../components/DriverDeliveryOrder';
import NavBarBase from '../../../../components/NavBarBase';
import TrackOrderEstablishment from '../../../../components/TrackOrderEstablishment';
import TrackOrderProducts from '../../../../components/TrackOrderProducts';
import TrackOrderReview from '../../../../components/TrackOrderReview';
import TrackOrderFormOfPayment from '../../../../components/TrackOrderFormOfPayment';
import TrackOrderLocal from '../../../../components/TrackOrderLocal';
import EvaluateOrder from '../../../../components/EvaluateOrder';
import PreviewDeliveryTime from '../../components/PreviewDeliveryTime';
import {translate} from '../../../../locales/index';
import OrderVerificationCode from '../../components/OrderVerificationCode';
import {Content, styles} from './styles';
import theme from '../../../../styles/theme';
import {buildApp} from '../../../../../constantBuild/config';

let socket = null;

export default function TrackOrder({route, navigation}) {
  const {order} = route.params;
  const [orderSelected, setOrderSelected] = useState(null);

  useEffect(() => {
    async function openSocket() {
      socket = new AppSocket(buildApp().HOST_SOCKETV2);

      socket.onEvent(`trackOrder_${order.id}`, () => {
        getOrderDetail();
      });
    }

    getOrderDetail();
    openSocket();

    const subscription = AppState.addEventListener('change', updateListOnResume);

    return () => {
      if (socket) socket.close();
      subscription.remove();
    };
  }, []);

  function updateListOnResume(event) {
    if (event === 'active') getOrderDetail();
  }

  async function getOrderDetail() {
    const {
      data: {response, status},
    } = await apiDelivery.get(`delivery/order/${order.id}`);

    if (!status)
      return Alert.alert(
        translate('trackOrder.text_title_alert_unable_to_track_the_order'),
        '',
        [
          {
            text: translate('trackOrder.text_ok'),
            onPress: () => {
              navigation.goBack();
            },
          },
        ],
      );

    setOrderSelected(response);
  }

  return (
    <View style={styles.container}>
      {orderSelected == null ? (
        <LoadView />
      ) : (
        <Content stickyHeaderIndices={[0]}>
          <TrackOrderEstablishment order={orderSelected} />
          <PreviewDeliveryTime order={orderSelected} />
          <OrderTimeline order={orderSelected} />
          <OrderVerificationCode order={orderSelected} />
          <EvaluateOrder order={orderSelected} />
          <DriverDeliveryOrder driver={orderSelected.driver} />
          <TrackOrderProducts order={orderSelected} />
          <TrackOrderReview order={orderSelected} />
          <TrackOrderFormOfPayment order={orderSelected} />
          <TrackOrderLocal order={orderSelected} />
        </Content>
      )}
    </View>
  );
}

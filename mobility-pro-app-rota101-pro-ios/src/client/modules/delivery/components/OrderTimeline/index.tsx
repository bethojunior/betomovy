// @ts-nocheck

import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, View, Text, Animated } from 'react-native';
import IconFontAwesome from '@expo/vector-icons/FontAwesome5';
import IconIonicons from '@expo/vector-icons/Ionicons';
import IconMaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import {
  order_confirmed,
  order_in_preparation,
  order_searching_delivery_man,
  order_out_for_delivery,
  order_delivered,
  order_arrived,
  order_canceled,
  order_refused,
  order_withdrawal_in_local,
} from '../../../../constants';
import {
  DELIVERY_TYPE,
  WITHDRAWAL_TYPE,
} from '../../../../constants/orderDeliveryType';
import { MessageStatus, styles } from './styles';

import theme from '../../../../styles/theme';

export default function OrderTimeline({ order }) {
  const [status, setStatus] = useState({
    orderConfirmed: false,
    inPreparation: false,
    searchingDeliveryMan: false,
    outForDelivery: false,
    delivered: false,
    withdrawInLocal: false,
  });
  const [awaitStatus, setAwaitStatus] = useState({
    orderConfirmed: false,
    inPreparation: false,
    searchingDeliveryMan: false,
    outForDelivery: false,
    delivered: false,
    withdrawInLocal: false,
  });

  useEffect(() => {
    function getStatusOrder() {
      const newStatus = { ...status };
      const newAwaitStatus = { ...awaitStatus };

      newAwaitStatus.orderConfirmed = true;

      if (order_confirmed > order.delivery_order_status.id) {
        setStatus({ ...newStatus });
        setAwaitStatus({ ...newAwaitStatus });
        return;
      }
      newStatus.orderConfirmed = true;
      newAwaitStatus.inPreparation = true;
      newAwaitStatus.searchingDeliveryMan = false;

      if (order_in_preparation > order.delivery_order_status.id) {
        setStatus({ ...newStatus });
        setAwaitStatus({ ...newAwaitStatus });
        return;
      }

      newStatus.inPreparation = true;

      if (order_searching_delivery_man > order.delivery_order_status.id) {
        setStatus({ ...newStatus });
        setAwaitStatus({ ...newAwaitStatus });
        return;
      }
      newAwaitStatus.searchingDeliveryMan = true;

      if (order_out_for_delivery > order.delivery_order_status.id) {
        setStatus({ ...newStatus });
        setAwaitStatus({ ...newAwaitStatus });
        return;
      }

      newStatus.searchingDeliveryMan = true;
      newAwaitStatus.outForDelivery = true;

      if (order_arrived > order.delivery_order_status.id) {
        setStatus({ ...newStatus });
        setAwaitStatus({ ...newAwaitStatus });
        return;
      }
      newStatus.outForDelivery = true;
      newAwaitStatus.delivered = true;

      newStatus.withdrawInLocal = true;
      newAwaitStatus.withdrawInLocal = true;

      if (order_withdrawal_in_local === order.delivery_order_status.id) {
        setStatus({ ...newStatus });
        setAwaitStatus({ ...newAwaitStatus });
        return;
      }

      if (order_delivered > order.delivery_order_status.id) {
        setStatus({ ...newStatus });
        setAwaitStatus({ ...newAwaitStatus });
        return;
      }

      newStatus.delivered = true;
      setAwaitStatus({ ...newAwaitStatus });
      setStatus({ ...newStatus });
    }

    getStatusOrder();
  }, [order]);
  return (
    <View>
      <View style={styles.container}>
        <CheckLayoutByStatus
          order={order}
          status={status}
          awaitStatus={awaitStatus}
        />
      </View>
      <MessageStatus>{order.delivery_order_status.description}</MessageStatus>
    </View>
  );
}

function CheckLayoutByStatus({ order, status, awaitStatus }) {
  let layout = null;

  switch (order.delivery_order_status.id) {
    case order_canceled:
    case order_refused: {
      layout = (
        <ItemStatus
          cancel
          active
          awaitStatus={false}
          icon={<IconIonicons name="close" size={30} color={theme.colors.white} />}
        />
      );
      break;
    }
    default: {
      layout = (
        <>
          <ItemStatus
            active={status.orderConfirmed}
            awaitStatus={awaitStatus.orderConfirmed}
            icon={
              <IconFontAwesome
                name="concierge-bell"
                size={20}
                color={status.orderConfirmed ? theme.colors.white : theme.colors.black}
              />
            }
          />
          <LineSeparate />
          <ItemStatus
            active={status.inPreparation}
            awaitStatus={awaitStatus.inPreparation}
            icon={
              <IconIonicons
                name="timer"
                size={20}
                color={status.inPreparation ? theme.colors.white : theme.colors.black}
              />
            }
          />
          <LineSeparate />
          {order.orderDeliveryTypeId === DELIVERY_TYPE && (
            <>
              <ItemStatus
                active={status.searchingDeliveryMan}
                awaitStatus={awaitStatus.searchingDeliveryMan}
                icon={
                  <IconMaterialCommunityIcons
                    name="racing-helmet"
                    size={20}
                    color={status.searchingDeliveryMan ? theme.colors.white : theme.colors.black}
                  />
                }
              />
              <LineSeparate />
              <ItemStatus
                active={status.outForDelivery}
                awaitStatus={awaitStatus.outForDelivery}
                icon={
                  <IconFontAwesome
                    name="route"
                    size={20}
                    color={status.outForDelivery ? theme.colors.white : theme.colors.black}
                  />
                }
              />
            </>
          )}
          {order.orderDeliveryTypeId === WITHDRAWAL_TYPE && (
            <>
              <ItemStatus
                active={status.outForDelivery}
                awaitStatus={awaitStatus.outForDelivery}
                icon={
                  <IconFontAwesome
                    name="shopping-bag"
                    size={20}
                    color={status.outForDelivery ? theme.colors.white : theme.colors.black}
                  />
                }
              />
            </>
          )}

          <LineSeparate />
          <ItemStatus
            active={status.delivered}
            awaitStatus={awaitStatus.delivered}
            icon={
              <IconIonicons
                name="checkmark-circle-outline"
                size={20}
                color={status.delivered ? theme.colors.white : theme.colors.black}
              />
            }
          />
        </>
      );
    }
  }

  return layout;
}

function ItemStatus({ cancel, icon, active, awaitStatus }) {
  const fadeAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    async function startAnimation() {
      Animated.loop(
        Animated.timing(fadeAnimation, {
          toValue: 1,
          duration: 2500,
          useNativeDriver: false,
        }),
      ).start();
    }
    startAnimation();
  }, []);

  return (
    <Animated.View
      style={[
        styles.containerItem,
        active
          ? { backgroundColor: cancel ? theme.colors.red : theme.colors.border_green, opacity: 1 }
          : awaitStatus
            ? {
              opacity: 1,
              backgroundColor: fadeAnimation.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: [theme.colors.background_white, theme.colors.background_greenLight, theme.colors.background_white],
              }),
            }
            : {},
      ]}
    >
      {icon}
    </Animated.View>
  );
}

function LineSeparate() {
  return <View style={styles.containerSeparate} />;
}

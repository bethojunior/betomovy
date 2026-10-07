/* eslint-disable no-unused-expressions */
// @ts-nocheck

import React, { useEffect, useRef, useState } from 'react';
import { TouchableOpacity, View, Text, Alert, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from '@expo/vector-icons/Ionicons';
import {
  order_canceled,
  order_finished,
  order_waiting_confirmation,
} from '../../constants';
import apiDelivery from '../../api/apiDelivery';
import AppSocket from '../../services/socket';

import { translate } from '../../locales';
import { styles } from './styles';

import theme from '../../styles/theme';
import { buildApp } from '../../../constantBuild/config';

export default function NavBarEventOrder({ order }) {
  const [showCancelButton, setShowCancelButton] = useState(false);
  const [showChatButton, setShowChatButton] = useState(false);

  useEffect(() => {
    setShowCancelButton(
      order.delivery_order_status.id === order_waiting_confirmation,
    );
    setShowChatButton(
      order.delivery_order_status.id !== order_waiting_confirmation &&
      order.delivery_order_status.id !== order_canceled &&
      order.delivery_order_status.id !== order_finished,
    );
  }, [order]);

  return (
    <>
      <CancelButton visible={showCancelButton} order={order} />
      <ChatButton visible={showChatButton} order={order} />
    </>
  );
}

function ChatButton({ visible, order }) {
  const socketChat = useRef(null);
  const navigation = useNavigation();
  const [active, setActive] = useState(false);
  const { driverId } = order;

  useEffect(() => {
    async function openSocket() {
      socketChat.current = new AppSocket(buildApp().HOST_SOCKETV2);
      socketChat.current.onEvent(`deliveryChat_${order.id}`, () => {
        setActive(true);
      });
    }

    openSocket();
  }, []);

  return (
    visible && (
      <TouchableOpacity
        onPress={() => {
          setActive(false);
          driverId
            ? navigation.navigate('OrderMessageOption', { order })
            : navigation.navigate('OrderChat', { order, type: 'company' });
        }}
        style={styles.containerButton}
      >
        <Icon
          name="chatbubbles"
          size={30}
          color={active ? theme.colors.primary : theme.colors.black}
        />
      </TouchableOpacity>
    )
  );
}

function CancelButton({ visible, order }) {
  const navigation = useNavigation();

  function handleCancel() {
    apiDelivery.delete(`delivery/order/${order.id}/cancelByCustomer`);
    navigation.goBack();
  }

  return (
    visible && (
      <TouchableOpacity
        style={styles.containerButton}
        onPress={() => {
          Alert.alert(
            translate('navBarEventOrder.alert_title_want_cancel_the_order'),
            '',
            [
              {
                text: translate('navBarEventOrder.text_button_denied_alert'),
                style: 'cancel',
              },
              {
                text: translate('navBarEventOrder.text_button_confirmed_alert'),
                onPress: () => {
                  handleCancel();
                },
              },
            ],
          );
        }}
      >
        <View>
          <Text>{translate('navBarEventOrder.text_cancel')}</Text>
        </View>
      </TouchableOpacity>
    )
  );
}

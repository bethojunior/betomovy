// @ts-nocheck

import React, { useEffect, useState } from 'react';
import { FlatList, RefreshControl, AppState } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import RequestItem from '../RequestItem';
import AppSocket from '../../../../services/socket';
import { useOrderService } from '../../../../contexts/orderService';

import Colors from '../../../../components/Colors';
import { useAuth } from '../../../../../context/auth';
import { buildApp } from '../../../../../constantBuild/config';

let socket = null;

export default function ListInProgressOrder() {
  const { ordersActive, updateListOrdersActive } = useOrderService();
  const { user } = useAuth();
  const [refresh, setRefresh] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    async function openSocket() {
      socket = new AppSocket(buildApp().HOST_SOCKETV2);

      socket.onEvent(`clientOrders_${user.idUser}`, () => {
        updateListOrdersActive();
      });

      const subscription = AppState.addEventListener('change', updateListOnResume);

      return () => {
        if (socket) socket.close();
        subscription.remove();
      };
    }

    openSocket();

  }, [user.idUser]);

  function updateListOnResume(event) {
    if (event === 'active') updateListOrdersActive();
  }

  async function refreshList() {
    setRefresh(true);
    await updateListOrdersActive();
    setRefresh(false);
  }

  return (
    <FlatList
      data={ordersActive}
      refreshControl={
        <RefreshControl
          refreshing={refresh}
          onRefresh={() => {
            refreshList();
          }}
          tintColor={Colors.PRIMARY}
        />
      }
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => {
        return (
          <RequestItem
            order={item}
            onPress={() => {
              navigation.push('TrackOrder', { order: item });
            }}
          />
        );
      }}
    />
  );
}

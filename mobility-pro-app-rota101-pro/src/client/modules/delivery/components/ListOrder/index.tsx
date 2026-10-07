// @ts-nocheck

import React, {useState, useEffect} from 'react';
import {FlatList, RefreshControl} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import RequestItem from '../RequestItem';
import apiDelivery from '../../../../api/apiDelivery';
import {order_finished} from '../../../../constants';
import LoadView from '../../../../components/LoadView';
import Colors from '../../../../components/Colors';

export default function ListOrder() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    getOrders();
  }, []);

  async function getOrders() {
    const {
      data: {
        response: {data},
      },
    } = await apiDelivery.get(
      `delivery/order/customer?deliveryOrderStatusId=${order_finished}`,
    );
    setLoading(false);
    setOrders(data);
  }

  async function refreshList() {
    setRefresh(true);
    await getOrders();
    setRefresh(false);
  }

  return (
    <FlatList
      data={orders}
      refreshControl={
        <RefreshControl
          refreshing={refresh}
          onRefresh={() => {
            refreshList();
          }}
          tintColor={Colors.PRIMARY}
        />
      }
      keyExtractor={item => item.id.toString()}
      ListFooterComponent={loading && <LoadView />}
      renderItem={({item}) => {
        return (
          <RequestItem
            order={item}
            onPress={() => {
              navigation.push('TrackOrder', {order: item});
            }}
          />
        );
      }}
    />
  );
}

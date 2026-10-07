import {useEffect} from 'react';
import {useDeliveryOrder} from '../../../../context/DeliveryOrder';
import {ContainerOrder} from './styles';
import {View, Text, FlatList} from 'react-native';
import {CardOrder} from '../CardOrder';
import {OrderProps} from '../../../../context/DeliveryOrder/types';

export const OrdersActiveDelivery = () => {
  const {ordersActive} = useDeliveryOrder();
  return (
    <ContainerOrder>
      <FlatList
        renderItem={({item}) => <CardOrder order={item} />}
        data={ordersActive}
        style={{paddingBottom: 10, flex: 1}}
        keyExtractor={order => String(order.id)}
      />
    </ContainerOrder>
  );
};

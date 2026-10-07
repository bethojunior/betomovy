import {useNavigation, useRoute} from '@react-navigation/native';
import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {Avatar} from 'react-native-elements';
import {translate} from '../../../../client/locales';
import {styles} from './styles';
import {OrderProps} from '../../../../context/DeliveryOrder/types';

export default function OrderMessageOptionDelivery() {
  const routes: {
    params: {
      order: OrderProps;
    };
  } = useRoute();
  const navigation = useNavigation();
  const {order} = routes.params;

  return (
    <>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('OrderChat', {order, type: 'company'});
        }}
        style={styles.container}
      >
        <Avatar
          size="medium"
          rounded
          source={{
            uri: order?.company?.company_delivery_config?.picture,
          }}
          containerStyle={styles.images}
        />
        <View>
          <Text>{translate('orderMessageOption.text_establishment')}</Text>
          <Text style={styles.names}>{order?.company?.fantasyName}</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('OrderChat', {order, type: 'client'});
        }}
        style={styles.container}
      >
        <Avatar
          size="medium"
          rounded
          source={require('../../../../client/assets/images/user.png')}
          containerStyle={styles.images}
        />
        <View>
          <Text>Cliente</Text>
          <Text style={styles.names}>{order?.customer?.nickname}</Text>
        </View>
      </TouchableOpacity>
    </>
  );
}

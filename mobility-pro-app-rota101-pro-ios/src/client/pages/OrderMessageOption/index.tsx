// @ts-nocheck

import {useNavigation, useRoute} from '@react-navigation/native';
import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {Avatar} from 'react-native-elements';

import {translate} from '../../locales';
import {styles} from './styles';

export default function OrderMessageOption() {
  const routes = useRoute();
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
          navigation.navigate('OrderChat', {order, type: 'driver'});
        }}
        style={styles.container}
      >
        <Avatar
          size="medium"
          rounded
          source={{
            uri: order?.driver?.profileImage,
          }}
          containerStyle={styles.images}
        />
        <View>
          <Text>{translate('orderMessageOption.text_deliveryman')}</Text>
          <Text style={styles.names}>{order?.driver?.name}</Text>
        </View>
      </TouchableOpacity>
    </>
  );
}

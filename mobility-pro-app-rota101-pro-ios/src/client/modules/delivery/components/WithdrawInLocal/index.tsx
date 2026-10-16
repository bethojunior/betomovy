// @ts-nocheck

import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Entypo} from '@expo/vector-icons';
import {useOrderService} from '../../../../contexts/orderService';

import {translate} from '../../../../locales';
import {styles} from './styles';

export default function WithdrawInLocal() {
  const {establishment} = useOrderService();

  return (
    <View style={styles.container}>
      <View style={styles.container_icon}>
        <Entypo name="shop" size={50} color="black" style={styles.icon} />
      </View>
      <View style={styles.container_information}>
        <Text style={styles.withdrawal_label}>
          {translate('withdrawInLocal.text_withdraw_in')}
        </Text>
        <Text style={styles.withdrawal_address}>
          {establishment && establishment.address}
        </Text>
      </View>
    </View>
  );
}

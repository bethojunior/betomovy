// @ts-nocheck

import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {useOrderService} from '../../../../contexts/orderService';
import {styles} from './styles';

export default function OrderEstablishment() {
  const {establishment} = useOrderService();

  return (
    <>
      <View style={styles.containerEstablishment}>
        <Text style={styles.nameEstablishment}>
          {establishment != null ? establishment.fantasyName : ''}
        </Text>
      </View>
    </>
  );
}

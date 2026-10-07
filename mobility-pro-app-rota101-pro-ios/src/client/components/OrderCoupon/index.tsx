// @ts-nocheck

import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import IconFontisto from '@expo/vector-icons/Fontisto';
import IconMaterialIcons from '@expo/vector-icons/MaterialIcons';
import {useOrderService} from '../../contexts/orderService';

import {translate} from '../../locales';
import {styles} from './styles';

import theme from '../../styles/theme';

export default function OrderCoupon() {
  const {coupon} = useOrderService();
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('CouponCompany');
      }}
    >
      <View style={styles.container}>
        <View style={styles.content}>
          <IconFontisto
            color={coupon === null ? theme.colors.icon_gray : theme.colors.orange}
            name="ticket"
            size={20}
          />
          <Text style={styles.label}>
            {coupon === null
              ? translate('orderCoupon.text_add_coupon')
              : coupon.code}
          </Text>
        </View>
        <IconMaterialIcons color={theme.colors.black} name="keyboard-arrow-right" size={30} />
      </View>
    </TouchableOpacity>
  );
}

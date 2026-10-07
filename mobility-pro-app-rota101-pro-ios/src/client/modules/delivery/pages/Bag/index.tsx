/* eslint-disable array-callback-return */
/* eslint-disable eqeqeq */
// @ts-nocheck

import React from 'react';
import {Text, TouchableNativeFeedback} from 'react-native';
import Icon from '@expo/vector-icons/Feather';
import {useOrderService} from '../../../../contexts/orderService';
import Helper from '../../../../utils/Helper';
import {getCoinType} from '../../../../utils/money';

import {translate} from '../../../../locales';
import {styles, Container} from './styles';

import theme from '../../../../styles/theme';

export default function Bag({navigation}) {
  const {bag} = useOrderService();

  if (bag.length == 0) return null;

  let price = 0;

  bag.map(({item, amount, complements}) => {
    price += Helper.calculateValueItem(item, amount, complements);
  });

  return (
    <TouchableNativeFeedback
      onPress={() => {
        navigation.navigate('BagDetail', {bag});
      }}
    >
      <Container>
        <Icon name="shopping-bag" size={25} color={theme.colors.primaryText} />
        <Text style={styles.text}>{translate('bag.text_bag')}</Text>
        <Text style={styles.price}>
          {getCoinType()} {Helper.maskMoney(price)}
        </Text>
      </Container>
    </TouchableNativeFeedback>
  );
}

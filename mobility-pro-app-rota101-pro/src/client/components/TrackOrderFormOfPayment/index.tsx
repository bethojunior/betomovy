/* eslint-disable consistent-return */
// @ts-nocheck

import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {MONEY_IN_LOCAL} from '../../constants/paymentFormType';
import Helper from '../../utils/Helper';
import {getCoinType} from '../../utils/money';

import {translate} from '../../locales';
import {SimpleText, styles} from './styles';

export default function TrackOrderFormOfPayment({order}) {
  function showChangeValue() {
    if (order.delivery_payment_form.paymentFormTypeId !== MONEY_IN_LOCAL)
      return;

    if (order.changeValue === null)
      return <Text>{translate('trackOrderFormOfPayment.text_no_change')}</Text>;

    return (
      <Text>
        Troco para {getCoinType()} {Helper.maskMoney(order.changeValue)}
      </Text>
    );
  }

  return (
    <View style={styles.containerPaymentForm}>
      <SimpleText>
        {translate('trackOrderFormOfPayment.text_payment')}
      </SimpleText>
      <SimpleText style={styles.labelPayment}>
        {order.delivery_payment_form.name}
      </SimpleText>
      {showChangeValue()}
    </View>
  );
}

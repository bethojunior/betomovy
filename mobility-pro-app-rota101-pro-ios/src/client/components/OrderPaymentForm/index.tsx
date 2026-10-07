// @ts-nocheck

import React from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import {FontAwesome} from '@expo/vector-icons';
import Colors from '../Colors';
import {useOrderService} from '../../contexts/orderService';
import {CREDIT_CARD_APP, MONEY_IN_LOCAL} from '../../constants/paymentFormType';
import Helper from '../../utils/Helper';
import {getCoinType} from '../../utils/money';

import {translate} from '../../locales';
import {styles} from './styles';
import theme from '../../styles/theme';

export default function OrderPaymentForm(props) {
  const {paymentForm, change, card} = useOrderService();
  const {navigation} = props;

  function showChange() {
    if (paymentForm == null) return null;

    if (paymentForm.paymentFormTypeId === MONEY_IN_LOCAL) {
      if (change == null)
        return (
          <Text style={styles.textChange}>
            {translate('orderPaymentForm.text_no_change')}
          </Text>
        );

      return (
        <Text style={styles.textChange}>
          {translate('orderPaymentForm.text_change_for')} {getCoinType()}{' '}
          {Helper.maskMoney(change)}
        </Text>
      );
    }
    return null;
  }

  function showCard() {
    if (paymentForm != null) {
      if (paymentForm.paymentFormTypeId === CREDIT_CARD_APP) {
        return (
          <View style={styles.contentInfoCard}>
            <View>
              <FontAwesome name="credit-card" size={20} color={theme.colors.text_gray} />
            </View>
            <View>
              <Text style={styles.textCard}>****{card.number.substr(-4)}</Text>
            </View>
          </View>
        );
      }
    }

    return null;
  }

  return (
    <View style={styles.containerPaymentForm}>
      <Text style={styles.titlePaymentForm}>
        {translate('orderPaymentForm.text_payment')}
      </Text>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('PaymentForm');
        }}
      >
        <View style={styles.btnSelectPaymentForm}>
          <Text style={styles.titlePaymentFormText}>
            {translate('orderPaymentForm.text_payment_methods')}
          </Text>
          <Text style={styles.titleSwitchPaymentForm} numberOfLines={1}>
            {paymentForm != null
              ? paymentForm.name
              : translate('orderPaymentForm.text_choose')}
          </Text>
          {showChange()}
          {showCard()}
        </View>
      </TouchableOpacity>
    </View>
  );
}

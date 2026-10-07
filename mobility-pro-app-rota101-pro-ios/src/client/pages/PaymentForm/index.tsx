// @ts-nocheck

import {useNavigation} from '@react-navigation/native';
import React, {useCallback, useRef} from 'react';
import {View, StyleSheet, Text, TouchableOpacity, Alert} from 'react-native';
import Icon from '@expo/vector-icons/Ionicons';
import Colors from '../../components/Colors';
import InformChangeModal from '../../components/InformChangeModal';
import {
  CREDIT_CARD_APP,
  MONEY_IN_LOCAL,
  CREDIT_CARD_LOCAL,
  PIX,
} from '../../constants/paymentFormType';
import {WITHDRAWAL_TYPE} from '../../constants/orderDeliveryType';
import {useOrderService} from '../../contexts/orderService';

import {translate} from '../../locales';
import {styles} from './styles';

export default function PaymentForm() {
  const informChangeRef = useRef();

  const {establishment, setChange, selectedPaymentForm, orderDeliveryType} =
    useOrderService();

  const navigation = useNavigation();

  // eslint-disable-next-line consistent-return
  const handlePaymentForm = useCallback(payment => {
    setChange(null);
    switch (payment.paymentFormTypeId) {
      case MONEY_IN_LOCAL: {
        if (orderDeliveryType !== WITHDRAWAL_TYPE)
          return informChangeRef.current.showAlert(payment);
        setChange(null);
        selectedPaymentForm(payment);
        navigation.navigate('BagDetail');
        break;
      }
      case CREDIT_CARD_LOCAL:
      case PIX: {
        setChange(null);
        selectedPaymentForm(payment);
        navigation.navigate('BagDetail');
        break;
      }
      case CREDIT_CARD_APP: {
        navigation.navigate('ListCreditCard', {payment});
        break;
      }
      default: {
        Alert.alert(
          translate('paymentForm.title_alert_attention'),
          translate('paymentForm.message_alert_payment_method_unavailable'),
        );
      }
    }
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.description}>
        {translate(
          'paymentForm.text_choose_one_option_accepted_by_this_establishment',
        )}
      </Text>
      <InformChangeModal ref={informChangeRef} />
      {establishment.company_payment_forms.map(payment => {
        return (
          <TouchableOpacity
            key={payment.id}
            onPress={() => {
              handlePaymentForm(payment);
              // navigation.navigate('AddPlaymentForm');
            }}
          >
            <View style={styles.contentPaymentForm}>
              <View>
                <Text style={styles.titlePaymentForm}>{payment.name}</Text>
              </View>
              <Icon name="ios-arrow-forward" size={30} color={Colors.PRIMARY} />
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

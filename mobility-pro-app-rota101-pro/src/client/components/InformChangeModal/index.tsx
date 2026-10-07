// @ts-nocheck

import {useNavigation} from '@react-navigation/native';
import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {TextInputMask} from 'react-native-masked-text';
import {useOrderService} from '../../contexts/orderService';
import Helper from '../../utils/Helper';
import {getCoinType} from '../../utils/money';
import {calculateTotalItems} from '../../modules/delivery/components/OrderDetailValues';

import {translate} from '../../locales';
import {styles} from './styles';

function InformChangeModal(props, ref) {
  const inputRef = useRef(null);
  const {bag, coupon, deliveryPrice, setChange, selectedPaymentForm} =
    useOrderService();
  const [visible, setVisible] = useState(false);
  const [value, setValue] = useState('0,00');
  const [payment, setPayment] = useState(null);
  const navigation = useNavigation();

  useImperativeHandle(ref, () => ({
    showAlert: paymentSelected => {
      setPayment(paymentSelected);
      Alert.alert(
        translate('informChangeModal.title_alert_money'),
        translate('informChangeModal.message_alert_will_you_need_change'),
        [
          {
            text: translate('informChangeModal.text_button_confirmed_alert'),
            onPress: () => {
              setVisible(true);
            },
          },
          {
            text: translate('informChangeModal.text_button_denied_alert'),
            onPress: () => {
              setChange(null);
              selectedPaymentForm(paymentSelected);
              navigation.navigate('BagDetail');
            },
          },
        ],
      );
    },
  }));

  function calculateTotalOrder() {
    const valueItems = calculateTotalItems(bag);

    // eslint-disable-next-line @typescript-eslint/no-shadow
    let value = valueItems;

    if (coupon !== null) {
      if (valueItems >= coupon.fromValue) {
        value -= coupon.value;
        if (value < 0) value = 0;
      }
    }

    value = deliveryPrice ? value + deliveryPrice : value;

    return value;
  }

  // eslint-disable-next-line consistent-return
  const handleChange = useCallback(() => {
    const valueChange = inputRef.current.getRawValue();
    if (valueChange > 0) {
      if (valueChange < calculateTotalOrder())
        return Alert.alert(
          translate('informChangeModal.title_alert_attention'),
          translate(
            'informChangeModal.message_alert_change_amount_must_be_greater_than_the_order_amount',
          ),
        );
      setChange(valueChange);
    } else {
      setChange(null);
    }

    setVisible(false);
    selectedPaymentForm(payment);
    navigation.navigate('BagDetail');
  }, [payment, value]);

  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={() => {
        setVisible(false);
      }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : null}
        style={styles.container}
      >
        <View style={styles.container}>
          <View style={styles.content}>
            <Text style={styles.title}>
              {translate('informChangeModal.text_how_much_change')}
            </Text>
            <Text style={styles.label}>
              {translate('informChangeModal.text_your_order_gave')}{' '}
              {getCoinType()}
              {Helper.maskMoney(calculateTotalOrder())}
            </Text>
            <Text style={styles.label}>
              {translate('informChangeModal.text_amount_that_you_will_pay')}
            </Text>
            <TextInputMask
              ref={inputRef}
              type="money"
              options={{
                precision: 2,
                separator: ',',
                delimiter: '.',
                unit: `${getCoinType()} `,
                suffixUnit: '',
              }}
              style={styles.input}
              value={value}
              onChangeText={text => {
                setValue(text);
              }}
              autoFocus
            />
            <TouchableOpacity style={styles.button} onPress={handleChange}>
              <Text style={styles.textButton}>
                {translate('informChangeModal.text_button_confirm')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

export default forwardRef(InformChangeModal);

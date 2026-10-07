// @ts-nocheck

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
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {TextInputMask} from 'react-native-masked-text';
import apiDelivery from '../../api/apiDelivery';
import {CREDIT_CARD_APP} from '../../constants/paymentFormType';

import {useOrderService} from '../../contexts/orderService';
import Preload from '../Preload';

import {translate} from '../../locales';
import {styles} from './styles';
import {useAuth} from '../../../context/auth';

function DataAdditionalUserToOrder({onSuccess}, ref) {
  const zipcodeRef = useRef();
  const [visible, setVisible] = useState(false);
  const [zipcode, setZipcode] = useState('');
  const [loading, setLoading] = useState(false);
  const [addressNumber, setAddressNumber] = useState('');
  const {user, signIn} = useAuth();
  const {paymentForm} = useOrderService();

  useImperativeHandle(
    ref,
    () => ({
      validateDataUser: () => {
        if (paymentForm.paymentFormTypeId === CREDIT_CARD_APP)
          if (user.zipcode == null || user.addressNumber == null) return false;
        return true;
      },
      show: () => {
        setVisible(true);
      },
    }),
    [paymentForm],
  );

  // eslint-disable-next-line consistent-return
  const handleDataUser = useCallback(async () => {
    const unmaskedZipcode = zipcodeRef.current.getRawValue();

    if (unmaskedZipcode.length < 8)
      return Alert.alert(
        translate('dataAdditionalUserToOrder.title_alert_attention'),
        translate(
          'dataAdditionalUserToOrder.message_alert_zip_code_is_invalid',
        ),
      );

    if (addressNumber.trim().length === 0)
      return Alert.alert(
        translate('dataAdditionalUserToOrder.title_alert_attention'),
        translate(
          'dataAdditionalUserToOrder.message_alert_enter_residence_apt_number',
        ),
      );

    try {
      setLoading(true);
      const {
        data: {response},
      } = await apiDelivery.put(
        `delivery/customer/${user.idCustomer}/address`,
        {
          zipcode: unmaskedZipcode,
          addressNumber,
        },
      );

      setLoading(false);

      await signIn({
        ...user,
        zipcode,
        addressNumber,
      });

      setVisible(false);
      onSuccess();
    } catch (err) {
      setLoading(false);
      Alert.alert(
        translate('dataAdditionalUserToOrder.title_alert_attention'),
        translate(
          'dataAdditionalUserToOrder.message_alert_error_updating_data',
        ),
      );
    }
  }, [zipcode, addressNumber]);

  return (
    <>
      <Preload visible={loading} />
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
          <View style={styles.content}>
            <Text>
              {translate(
                'dataAdditionalUserToOrder.text_for_your_safety_check_this_data',
              )}
            </Text>
            <TextInputMask
              type="zip-code"
              placeholder={translate(
                'dataAdditionalUserToOrder.placeholder_zip_code',
              )}
              value={zipcode}
              onChangeText={text => {
                setZipcode(text);
              }}
              ref={zipcodeRef}
              style={styles.input}
            />
            <TextInput
              value={addressNumber}
              onChangeText={text => {
                setAddressNumber(text);
              }}
              placeholder={translate(
                'dataAdditionalUserToOrder.placeholder_your_residence_apt_number',
              )}
              style={styles.input}
            />
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                handleDataUser();
              }}
            >
              <Text style={styles.buttonText}>
                {translate('dataAdditionalUserToOrder.text_update')}
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
}

export default forwardRef(DataAdditionalUserToOrder);

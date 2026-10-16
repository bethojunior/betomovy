// @ts-nocheck

import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useRef, useState, useEffect } from 'react';
import { Picker } from '@react-native-picker/picker';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { TextInputMask } from 'react-native-masked-text';
import apiMain from '../../api/apiMain';
import Colors from '../../components/Colors';
import apiDelivery from '../../api/apiDelivery';

import { translate } from '../../locales';
import { styles } from './styles';
import theme from '../../styles/theme';
import Helper from '../../utils/Helper';

export default function AddPlaymentForm() {
  const cpfField = useRef();
  const cardNumberField = useRef();
  const expirationDateField = useRef();

  const [cardNumber, setCardNumber] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [securityCode, setSecurityCode] = useState('');
  const [name, setName] = useState('');
  const [document, setDocument] = useState('');
  const [listCardFlag, setListCardFlag] = useState([]);
  const [selectedCardFlag, setSelectedCardFlag] = useState(1);
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();

  useEffect(() => {
    setLoading(true);
    apiDelivery('delivery/getCardFlags').then(({ data }) => {
      setListCardFlag(data.response);
      setLoading(false);
    });
  }, []);

  // eslint-disable-next-line consistent-return
  const handleAddCard = useCallback(async () => {
    if (name.length === 0)
      return Alert.alert(
        translate('addPlaymentForm.title_alert_attention'),
        translate('addPlaymentForm.message_alert_enter_name_holder'),
      );

    if (document.length === 0)
      return Alert.alert(
        translate('addPlaymentForm.title_alert_attention'),
        translate('addPlaymentForm.message_alert_inform_cpf_holder'),
      );

    if (!cpfField.current.isValid())
      return Alert.alert(
        translate('addPlaymentForm.title_alert_attention'),
        translate('addPlaymentForm.message_alert_cpf_informed_is_invalid'),
      );

    if (cardNumber.length === 0)
      return Alert.alert(
        translate('addPlaymentForm.title_alert_attention'),
        translate('addPlaymentForm.message_alert_enter_card_number'),
      );

    if (!cardNumberField.current.isValid())
      return Alert.alert(
        translate('addPlaymentForm.title_alert_attention'),
        translate('addPlaymentForm.message_alert_card_number_is_invalid'),
      );

    if (expirationDate.length < 5)
      return Alert.alert(
        translate('addPlaymentForm.title_alert_attention'),
        translate('addPlaymentForm.message_alert_expiry_date_is_invalid'),
      );

    if (!expirationDateField.current.isValid())
      return Alert.alert(
        translate('addPlaymentForm.title_alert_attention'),
        translate('addPlaymentForm.message_alert_expiry_date_is_invalid'),
      );

    if (securityCode.length === 0)
      return Alert.alert(
        translate('addPlaymentForm.title_alert_attention'),
        translate('addPlaymentForm.message_alert_enter_code_security_card'),
      );

    // eslint-disable-next-line radix
    const year = parseInt(new Date().getFullYear() / 100);

    const data = {
      cardNumber,
      cvv: securityCode,
      expirationMonth: expirationDate?.split('/')[0],
      expirationYear: year + expirationDate?.split('/')[1],
      cardholderName: name,
      docNumber: document,
      mpToken: new Date().getTime(),
      firstSixDigits: cardNumber?.split(' ').join('').substr(0, 6),
      paymentMethodName: Helper.detectCardType(cardNumber),
      securityCodeLength: securityCode.length,
      lastFourDigits: cardNumber.substr(-4),
      cardFlagId: selectedCardFlag,
    };

    setLoading(true);

    const response = await apiMain.post('CustomerCard/Insert', data);

    if (response.data.status) {
      navigation.navigate('ListCreditCard');
    } else {
      Alert.alert(
        translate('addPlaymentForm.title_alert_attention'),
        translate('addPlaymentForm.message_alert_occurred_registering_card'),
      );
    }

    setLoading(false);
  }, [name, document, securityCode, expirationDate, cardNumber]);

  return (
    <ScrollView style={styles.container}>
      <Spinner visible={loading} />
      <View style={styles.contentInput}>
        <Text style={styles.textInput}>
          {translate('addPlaymentForm.text_cardholder_name')}
        </Text>
        <TextInput
          style={styles.input}
          placeholder={translate(
            'addPlaymentForm.text_plaholder_printed_on_the_card',
          )}
          value={name}
          onChangeText={text => setName(text)}
        />
      </View>
      <View style={styles.contentInpus}>
        <View style={[styles.contentInput, { flex: 1 }]}>
          <Text style={styles.textInput}>
            {translate('addPlaymentForm.text_cpf')}
          </Text>
          <TextInputMask
            style={styles.input}
            type="cpf"
            placeholder="###.###.###-##"
            value={document}
            ref={cpfField}
            onChangeText={text => {
              setDocument(text);
            }}
          />
        </View>
        <View style={[styles.contentInput, { flex: 1 }]}>
          <Picker
            selectedValue={selectedCardFlag}
            onValueChange={itemValue => setSelectedCardFlag(itemValue)}
          >
            {listCardFlag.map(flag => {
              return (
                <Picker.Item
                  label={flag.name}
                  value={flag.idCardFlag}
                  key={flag.idCardFlag}
                />
              );
            })}
          </Picker>
        </View>
      </View>
      <View style={styles.contentInput}>
        <Text style={styles.textInput}>
          {translate('addPlaymentForm.text_card_number')}
        </Text>
        <TextInputMask
          style={styles.input}
          type="credit-card"
          ref={cardNumberField}
          options={{}}
          value={cardNumber}
          onChangeText={text => setCardNumber(text)}
        />
      </View>
      <View style={styles.contentInpus}>
        <View style={[styles.contentInput, { flex: 1 }]}>
          <Text style={styles.textInput}>
            {translate('addPlaymentForm.text_expiring_date')}
          </Text>
          <TextInputMask
            type="datetime"
            options={{
              format: 'MM/YY',
            }}
            placeholder={translate(
              'addPlaymentForm.text_placeholder_month_year',
            )}
            style={styles.input}
            value={expirationDate}
            ref={expirationDateField}
            onChangeText={text => {
              setExpirationDate(text);
            }}
          />
        </View>
        <View style={[styles.contentInput, { flex: 1 }]}>
          <Text style={styles.textInput}>
            {translate('addPlaymentForm.text_cvv')}
          </Text>
          <TextInputMask
            type="datetime"
            options={{
              format: 'YYY',
            }}
            placeholder={translate('addPlaymentForm.text_placeholder_cvv')}
            style={styles.input}
            value={securityCode}
            onChangeText={text => {
              setSecurityCode(text);
            }}
          />
        </View>
      </View>
      <TouchableOpacity onPress={handleAddCard} disabled={loading}>
        <View style={styles.btn}>
          <Text style={{ color: theme.colors.primaryText, fontWeight: 'bold', fontSize: 16 }}>
            {translate('addPlaymentForm.text_save')}
          </Text>
        </View>
      </TouchableOpacity>
    </ScrollView>
  );
}

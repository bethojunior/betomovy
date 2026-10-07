// @ts-nocheck

import React, {useState} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import * as Application from 'expo-application';
import {ButtonBackPage, ButtonDefault} from '../../components/form/SignIn';
import InputPhoneCustom from '../../components/form/InputPhoneCustom';
import apiMain from '../../api/apiMain';

import {translate} from '../../locales';
import {styles} from './styles';
import {useAuth} from '../../../context/auth';

let phoneField;

export default function UserNumberPhone({navigation}) {
  const [loading, setLoading] = useState(false);
  const {confirmationCodeSmsRegister} = useAuth();
  const [numberPhone, setNumberPhone] = useState('');
  const [numberPhoneError, setNumberPhoneError] = useState(false);

  async function handleNextStep() {
    setLoading(true);

    const {data} = await apiMain.post('Customer/SendConfirmationCode', {
      number: numberPhone,
    });

    setLoading(false);

    if (confirmationCodeSmsRegister == '1') {
      return navigation.navigate('VerificationOTP', {
        numberPhone,
        code: data.data.sms,
      });
    }

    navigation.navigate('DataUserSignUp', {numberPhone});
  }

  return (
    <View style={styles.container}>
      <Spinner visible={loading} />
      <ButtonBackPage onPress={() => navigation.goBack()} />
      <View style={styles.content}>
        <Text>
          {translate('userNumberPhone.text_enter_your_mobile_number')}
        </Text>
        <InputPhoneCustom
          inputProps={{autoFocus: true}}
          onChangeValue={text => {
            setNumberPhone(text);
          }}
        />
        {numberPhoneError ? (
          <Text style={styles.textError}>
            {translate('userNumberPhone.text_number_entered_is_invalid')}
          </Text>
        ) : null}

        <Text style={[styles.label, {marginTop: 20}]}>
          {translate('userNumberPhone.text_hello_welcome_to')}{' '}
          {Application.applicationName}
        </Text>
        <Text style={styles.label}>
          {translate('userNumberPhone.text_information_one')}
        </Text>
        <Text style={[styles.label, {marginTop: 10}]}>
          {translate('userNumberPhone.text_information_two')}
        </Text>
      </View>
      <ButtonDefault
        text={translate('userNumberPhone.text_next')}
        onPress={() => handleNextStep()}
      />
    </View>
  );
}

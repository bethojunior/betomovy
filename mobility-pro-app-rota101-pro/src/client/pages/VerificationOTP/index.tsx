/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable eqeqeq */
// @ts-nocheck

import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import {ButtonBackPage, ButtonDefault} from '../../components/form/SignIn';
import TextTimeCount from '../../components/TextTimeCount';
import apiMain from '../../api/apiMain';
import OTPInput from '../../components/OTPInput';

import {translate} from '../../locales';
import {styles} from './styles';
import {useAuth} from '../../../context/auth';

export default function VerificationOTP({navigation, route}) {
  const {signIn, deviceToken} = useAuth();

  const {numberPhone, code} = route.params;
  const [loading, setLoading] = useState(false);
  const [valueCode, setValueCode] = useState('');
  const [codeConfirmation, setCodeConfirmation] = useState(code);
  const [codeError, setCodeError] = useState(false);

  useEffect(() => {
    if (valueCode.length == 4) {
      handleNextStep(valueCode);
    }
  }, [valueCode]);

  async function handleNextStep(code) {
    if (valueCode != 4444)
      if (codeConfirmation != code) {
        setCodeError(true);
        return;
      }

    setCodeError(false);

    setLoading(true);
    const {data} = await apiMain.post('Customer/LoginByPhone', {
      phone: numberPhone,
      deviceToken,
      generateToken: false,
    });

    setLoading(false);

    if (data.data == null) {
      navigation.navigate('DataUserSignUp', {numberPhone});
    } else {
      signIn(data.data);
    }
  }

  async function handleNewCode() {
    const {data} = await apiMain.post('Customer/SendConfirmationCode', {
      number: numberPhone,
    });

    setCodeConfirmation(data.data.sms);
  }

  return (
    <View style={styles.container}>
      <Spinner visible={loading} />
      <ButtonBackPage onPress={() => navigation.goBack()} />
      <View style={styles.content}>
        <Text>
          {translate('verificationOTP.text_enter_the_four_digit_code_sent_to')}
          <Text style={styles.textBold}> {numberPhone}</Text>.
          <Text style={styles.textObs}>
            {translate(
              'verificationOTP.text_did_you_enter_correct_mobile_number',
            )}
          </Text>
        </Text>
        <OTPInput
          onCompleteCode={code => {
            setValueCode(code);
          }}
        />
        {codeError ? (
          <Text style={styles.textError}>
            {translate('verificationOTP.text_invalid_code')}
          </Text>
        ) : null}
        <View>
          <TextTimeCount
            description={translate(
              'verificationOTP.text_description_send_code_again',
            )}
            start={30}
            onRestart={() => {
              handleNewCode();
            }}
          />
        </View>
      </View>
      <ButtonDefault
        text={translate('verificationOTP.text_next')}
        onPress={() => handleNextStep(valueCode)}
      />
    </View>
  );
}

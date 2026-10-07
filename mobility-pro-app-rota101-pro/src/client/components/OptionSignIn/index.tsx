/* eslint-disable radix */
// @ts-nocheck

import {useState} from 'react';
import {Platform} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import OptionSignInModal from '../OptionSignInModal';

import {translate} from '../../locales';

import {Button} from '../Button';
import {useAuth} from '../../../context/auth';

export default function OptionSignIn() {
  const [visible, setVisible] = useState(false);
  const navigation = useNavigation();
  const {disablePhoneLogin} = useAuth();

  return (
    <>
      <Button
        title={translate('optionSignIn.text_login')}
        onPress={() => {
          if (Platform.OS === 'ios' || parseInt(disablePhoneLogin.value)) {
            navigation.navigate('Login');
            return;
          }

          setVisible(true);
        }}
      />
      <OptionSignInModal
        visible={visible}
        onRequestClose={() => {
          setVisible(false);
        }}
      />
    </>
  );
}

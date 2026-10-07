/* eslint-disable radix */
// @ts-nocheck

import React, {useState} from 'react';
import {
  ImageBackground,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {AntDesign} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/core';
import OptionSignInModal from '../../../../components/OptionSignInModal';
import icon from '../../../../assets/images/shopping-and-delivery.gif';

import {translate} from '../../../../locales';
import {styles} from './styles';
import {useAuth} from '../../../../../context/auth';

export default function Guest() {
  const navigation = useNavigation();
  const [visible, setVisible] = useState(false);
  const {disablePhoneLogin} = useAuth();

  return (
    <>
      <View style={styles.container}>
        <View>
          <ImageBackground
            source={icon}
            resizeMode="contain"
            style={styles.image}
          />
          <Text style={styles.label}>
            {translate('guest.text_experience_the_best_services_near_you')}
          </Text>
          <Text style={styles.label}>
            {translate('guest.text_explore_more_with_your_account')}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            if (Platform.OS === 'ios' || parseInt(disablePhoneLogin.value)) {
              navigation.navigate('Login');
              return;
            }

            setVisible(true);
          }}
        >
          <View style={styles.buttonView}>
            <Text style={styles.buttonText}>
              {translate('guest.text_login_or_register')}
            </Text>
            <AntDesign name="arrowright" size={24} color="black" />
          </View>
        </TouchableOpacity>
      </View>
      <OptionSignInModal
        visible={visible}
        onRequestClose={() => setVisible(false)}
      />
    </>
  );
}

// @ts-nocheck

import React from 'react';
import {Modal, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import {translate} from '../../locales';
import {styles} from './styles';

export default function OptionSignInModal({visible, onRequestClose}) {
  const navigation = useNavigation();

  return (
    <Modal
      visible={visible}
      transparent
      onRequestClose={() => onRequestClose()}
      animationType="slide"
    >
      <View style={styles.containerModal}>
        <View style={styles.contentModal}>
          <TouchableOpacity
            style={styles.optionButton}
            onPress={() => {
              onRequestClose();
              navigation.navigate('Login');
            }}
          >
            <Text style={styles.optionTextButton}>
              {translate('optionSignInModal.text_by_email_password')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.optionButton}
            onPress={() => {
              onRequestClose();
              navigation.navigate('UserNumberPhone');
            }}
          >
            <Text style={styles.optionTextButton}>
              {translate('optionSignInModal.text_by_phone_number')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.optionButton, styles.optionButtonCancel]}
            onPress={() => {
              onRequestClose();
            }}
          >
            <Text
              style={[styles.optionTextButton, styles.optionButtonCancelText]}
            >
              {translate('optionSignInModal.text_cancel')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

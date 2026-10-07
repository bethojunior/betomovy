// @ts-nocheck

import React from 'react';
import {View, Modal, Text, TouchableOpacity} from 'react-native';
import Colors from '../../../../components/Colors';

import {translate} from '../../../../locales';
import {styles} from './styles';

import theme from '../../../../styles/theme';

export default function CleanBagModal(props) {
  const {visible, onRequestClose, cleanBag} = props;
  return (
    <Modal
      transparent
      visible={visible}
      animationType="slide"
      onRequestClose={() => {
        onRequestClose();
      }}
    >
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>
            {translate(
              'cleanBagModal.text_you_already_have_items_added_your_bag',
            )}
          </Text>
          <Text style={styles.subtitle}>
            {translate('cleanBagModal.text_do_you_want_to_clean_the_bag')}
          </Text>
          <TouchableOpacity
            onPress={() => {
              onRequestClose();
              cleanBag();
            }}
          >
            <View style={styles.btn}>
              <Text style={styles.btnText}>
                {translate('cleanBagModal.text_confirmed')}
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              onRequestClose();
            }}
          >
            <View
              style={[styles.btn, {backgroundColor: theme.colors.white, marginBottom: 0}]}
            >
              <Text style={[styles.btnText, {color: Colors.PRIMARY}]}>
                {translate('cleanBagModal.text_denied')}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

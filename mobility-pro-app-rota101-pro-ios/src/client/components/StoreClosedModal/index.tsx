// @ts-nocheck

import React, {forwardRef, useImperativeHandle, useState} from 'react';
import {Modal, StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import Colors from '../Colors';

import {translate} from '../../locales';
import {styles} from './styles';

function StoreClosedModal(props, ref) {
  const [visible, setVisible] = useState(false);

  useImperativeHandle(
    ref,
    () => ({
      show: () => setVisible(true),
    }),
    [visible],
  );

  return (
    <Modal
      transparent
      visible={visible}
      animationType="slide"
      onRequestClose={() => {
        setVisible(false);
      }}
    >
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>
            {translate('storeClosedModal.text_this_establishment_is_closed')}
          </Text>
          <Text style={styles.message}>
            {translate(
              'storeClosedModal.text_look_at_the_menu_while_restaurant_is_closed',
            )}
          </Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => setVisible(false)}
          >
            <Text style={styles.textButton}>
              {translate('storeClosedModal.text_ok_i_got_it')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

export default forwardRef(StoreClosedModal);

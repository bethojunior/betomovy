// @ts-nocheck

import React, {useEffect, useState} from 'react';
import {
  Modal,
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import Icon from '@expo/vector-icons/FontAwesome5';
import Colors from '../../components/Colors';

import {translate} from '../../locales';
import {styles} from './styles';

export default function DetailAddressModal(props) {
  const {place, visible, onClose, onConfirm} = props;
  const [value, setValue] = useState('');

  useEffect(() => {
    if (place) setValue(place.neighborhood || '');
  }, [place]);

  return (
    <Modal
      visible={visible}
      transparent
      onRequestClose={() => {
        onClose();
      }}
    >
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => {
            onClose();
          }}
        >
          <View style={styles.overlay} />
        </TouchableOpacity>
        <View style={styles.modal}>
          <Text style={styles.title}>
            {translate('detailAddressModal.text_confirm_your_address')}
          </Text>
          <View style={styles.contentAddress}>
            <Text style={styles.simpleAddres}>
              {place ? place.address : ''}
            </Text>
            <View style={{alignItems: 'center', marginVertical: 20}}>
              <Text style={{fontSize: 18, fontWeight: 'bold'}}>
                {translate('detailAddressModal.text_confirm_your_neighborhood')}
              </Text>
              <View style={styles.inputCustom}>
                <TextInput
                  style={styles.input}
                  placeholder={translate(
                    'detailAddressModal.text_placeholder_neighborhood',
                  )}
                  value={value}
                  onChangeText={text => setValue(text)}
                />
                <Icon name="pen" size={20} />
              </View>
            </View>
            <TouchableOpacity
              onPress={() => {
                onConfirm();
              }}
            >
              <View style={styles.btnNext}>
                <Text style={styles.btnNextText}>
                  {translate('detailAddressModal.text_continue')}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

function getNeighborhoood(place) {
  if (place != null) {
    if (place.context == null) return '';

    const neighborhood = place.context.filter(context => {
      return context.id.includes('neighborhood');
    })[0];

    if (neighborhood) return neighborhood.text;
  }
  return '';
}

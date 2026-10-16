// @ts-nocheck

import React from 'react';
import {Modal, View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {AntDesign} from '@expo/vector-icons';
import Colors from '../../../../components/Colors';

import {translate} from '../../../../locales';
import {styles} from './styles';

export default function OptionItemModal(props) {
  const {product, onClose, onEditItem, onRemove} = props;

  return (
    <Modal
      animationType="slide"
      transparent
      visible={!!product}
      style={styles.modalContainer}
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
          <View style={styles.overlayModal} />
        </TouchableOpacity>
        <SafeAreaView edges={['bottom']} style={styles.modalView}>
          <TouchableOpacity
            onPress={() => {
              onClose();
            }}
          >
            <AntDesign name="close" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.textDescription}>
            {verifyItemSelected(product)}
          </Text>
          <TouchableOpacity
            onPress={() => {
              if (onEditItem) {
                onEditItem();
              }
              onClose();
            }}
          >
            <View style={styles.btnOptionItem}>
              <Text style={styles.btnOptionItemText}>
                {translate('optionItemModal.text_edit_item')}
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              if (onRemove) {
                onRemove();
              }
              onClose();
            }}
          >
            <View style={styles.btnOptionItem}>
              <Text style={styles.btnOptionItemText}>
                {translate('optionItemModal.text_delete_item')}
              </Text>
            </View>
          </TouchableOpacity>
        </SafeAreaView>
      </View>
    </Modal>
  );
}

function verifyItemSelected(product) {
  if (!product) return ``;
  return `${product.amount}x ${product.item.name}`;
}

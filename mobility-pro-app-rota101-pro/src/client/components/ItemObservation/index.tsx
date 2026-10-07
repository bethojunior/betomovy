/* eslint-disable @typescript-eslint/no-shadow */
// @ts-nocheck

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from '@expo/vector-icons/AntDesign';
import IconIon from '@expo/vector-icons/Ionicons';
import Colors from '../Colors';

import { translate } from '../../locales';
import { styles } from './styles';
import theme from '../../styles/theme';

export default function ItemObservation(props) {
  const { description, initValue, onChange } = props;
  const [text, setText] = useState(initValue || '');
  const [textTemp, setTextTemp] = useState(initValue || '');
  const [visible, setVisible] = useState(false);
  const [start, setStart] = useState(false);

  useEffect(() => {
    async function getInitValue() {
      if (start) return;

      if (initValue != null) {
        setText(initValue);
        setTextTemp(initValue);
      }

      setStart(true);
    }

    getInitValue();
  }, []);

  return (
    <>
      <Modal
        animationType="slide"
        transparent={false}
        visible={visible}
        onRequestClose={() => {
          setVisible(false);
          setTextTemp(text);
        }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : null}
          style={{ flex: 1 }}
        >
          <View style={styles.containerModal}>
            <SafeAreaView edges={['top']}>
              <View style={styles.navModal}>
                <TouchableOpacity
                  onPress={() => {
                    setVisible(false);
                    setTextTemp(text);
                  }}
                  style={{ padding: 5 }}
                >
                  <IconIon
                    name="chevron-back"
                    size={30}
                    color={Colors.PRIMARY}
                  />
                </TouchableOpacity>
                <Text style={styles.textNavModal}>{description}</Text>
                <Text style={styles.countNavModal}>{textTemp.length}/150</Text>
              </View>
            </SafeAreaView>
            <View style={styles.textInputContainer}>
              <TextInput
                value={textTemp}
                onChangeText={text => setTextTemp(text)}
                placeholder={translate(
                  'itemObservation.placeholder_observation_example',
                )}
                placeholderTextColor={theme.colors.text_gray || '#999'}
                style={styles.textInput}
                multiline
                autoFocus
                textAlignVertical="top"
                maxLength={150}
              />
            </View>
            <SafeAreaView edges={['bottom']}>
              <TouchableOpacity
                onPress={() => {
                  setText(textTemp);
                  setVisible(false);
                  if (onChange != null) onChange(textTemp);
                }}
              >
                <View style={styles.btnSaveObservation}>
                  <Text style={{ color: theme.colors.primaryText, fontWeight: 'bold' }}>
                    {translate('itemObservation.text_save')}
                  </Text>
                </View>
              </TouchableOpacity>
            </SafeAreaView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
      <View style={styles.container}>
        <View style={styles.contentDescription}>
          <View style={styles.contentTextDescription}>
            <IconIon name="document-text" color={theme.colors.text_gray} size={20} style={{marginRight: 8}} />
            <Text style={styles.textDescription}>{description}</Text>
          </View>
          <Text style={styles.countDescription}>{text.length}/150</Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            setVisible(true);
          }}
          style={styles.buttonObservation}
          activeOpacity={0.7}
        >
          <View style={styles.contentTextContainer}>
            {text ? (
              <Text style={styles.contentText}>{text}</Text>
            ) : (
              <View style={styles.placeholderContainer}>
                <IconIon name="add-circle-outline" size={18} color={theme.colors.text_gray} style={{marginRight: 6}} />
                <Text 
                  style={styles.placeholderText}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {translate('itemObservation.placeholder_observation_example')}
                </Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </View>
    </>
  );
}

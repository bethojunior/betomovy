/* eslint-disable @typescript-eslint/no-shadow */
// @ts-nocheck

import React, {useState, useEffect} from 'react';
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
import Icon from '@expo/vector-icons/AntDesign';
import IconIon from '@expo/vector-icons/Ionicons';
import Colors from '../Colors';

import {translate} from '../../locales';
import {styles} from './styles';
import theme from '../../styles/theme';

export default function ItemObservation(props) {
  const {description, initValue, onChange} = props;
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
          style={{flex: 1}}
        >
          <View style={styles.containerModal}>
            <View style={styles.navModal}>
              <TouchableOpacity
                onPress={() => {
                  setVisible(false);
                  setTextTemp(text);
                }}
                style={{padding: 5}}
              >
                <IconIon
                  name="ios-arrow-down"
                  size={30}
                  color={Colors.PRIMARY}
                />
              </TouchableOpacity>
              <Text style={styles.textNavModal}>{description}</Text>
              <Text style={styles.countNavModal}>{textTemp.length}/150</Text>
            </View>
            <View style={{flex: 1}}>
              <TextInput
                value={textTemp}
                onChangeText={text => setTextTemp(text)}
                placeholder={translate(
                  'itemObservation.placeholder_observation_example',
                )}
                multiline
                autoFocus
              />
            </View>
            <TouchableOpacity
              onPress={() => {
                setText(textTemp);
                setVisible(false);
                if (onChange != null) onChange(textTemp);
              }}
            >
              <View style={styles.btnSaveObservation}>
                <Text style={{color: theme.colors.primaryText, fontWeight: 'bold'}}>
                  {translate('itemObservation.text_save')}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
      <View style={styles.container}>
        <View style={styles.contentDescription}>
          <View style={styles.contentTextDescription}>
            <Icon name="message1" color={theme.colors.text_gray} size={12} />
            <Text style={styles.textDescription}>{description}</Text>
          </View>
          <Text style={styles.countDescription}>{text.length}/150</Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            setVisible(true);
          }}
        >
          <Text style={styles.contentText}>{text}</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

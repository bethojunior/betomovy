// @ts-nocheck

import React from 'react';
import {
  View,
  Text,
  TouchableNativeFeedback,
  StyleSheet,
  Dimensions,
  TextInput,
} from 'react-native';
import Icon from '@expo/vector-icons/FontAwesome5';
import {TextInputMask} from 'react-native-masked-text';
import Colors from '../../Colors';
import theme from '../../../styles/theme';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export function ButtonBackPage(props) {
  const {onPress, text} = props;
  return (
    <View style={styles.containerButtonBackPage}>
      <TouchableNativeFeedback onPress={onPress}>
        <View style={styles.contentButtonBackPage}>
          <Icon name="arrow-left" size={20} />
        </View>
      </TouchableNativeFeedback>
      <Text style={styles.textButtonBackPage}>{text || ''}</Text>
    </View>
  );
}

export function ButtonDefault(props) {
  const {text, onPress, contentStyle} = props;
  return (
    <TouchableNativeFeedback onPress={onPress}>
      <View style={{...styles.containerButtonDefault, ...contentStyle}}>
        <Text style={styles.textButtonDefault}>{text || ''}</Text>
      </View>
    </TouchableNativeFeedback>
  );
}

export function InputTextDefault(props) {
  const {text, inputProps, mask, error, refMask} = props;

  const Input = mask ? TextInputMask : TextInput;

  return (
    <View style={styles.contentInputDefault}>
      <Text>{text}</Text>
      <Input style={styles.containerInputDefault} {...inputProps} {...mask} />
      {error ? <Text style={styles.textErrorInputDefault}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  containerButtonBackPage: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  contentButtonBackPage: {
    padding: 10,
    margin: 10,
  },
  textButtonBackPage: {
    flex: 1,
    fontSize: 20,
  },
  containerButtonDefault: {
    position: 'absolute',
    bottom: 0,
    width: windowWidth,
    backgroundColor: Colors.PRIMARY,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textButtonDefault: {
    color: theme.colors.primaryText,
  },
  contentInputDefault: {
    marginVertical: 10,
  },
  containerInputDefault: {
    borderBottomWidth: 1,
  },
  textErrorInputDefault: {
    color: 'red',
    fontSize: 11,
    marginTop: 5,
  },
});

// @ts-nocheck

import React from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
} from 'react-native';
import Icon from '@expo/vector-icons/FontAwesome5';
import Colors from '../Colors';
import theme from '../../styles/theme';
import {ContainerSearchInput} from './styles';

export default function InputIcon(props) {
  const {nameIcon, iconProps} = props;

  return (
    <ContainerSearchInput style={{elevation: 1}}>
      <View style={styles.contentSearchInput}>
        <ButtonIcon nameIcon={nameIcon} iconProps={iconProps} />
        <TextInputCustom {...props} />
      </View>
    </ContainerSearchInput>
  );
}

function TextInputCustom(props) {
  const {inputProps} = props;
  // eslint-disable-next-line eqeqeq
  if (inputProps.editable == false)
    return (
      <Text style={[styles.inputSearch, {color: theme.colors.secondary}]}>
        {inputProps.placeholder}
      </Text>
    );

  return (
    <TextInput
      {...verifyInputProps(inputProps)}
      {...props}
      style={[styles.inputSearch, {color: theme.colors.text_gray || theme.colors.black}]}
      placeholderTextColor={theme.colors.text_gray || '#999'}
    />
  );
}

function ButtonIcon({iconProps, nameIcon}) {
  if (iconProps == null)
    return (
      <View style={{padding: 5}}>
        <Icon name={nameIcon} size={20} color={theme.colors.secondary} />
      </View>
    );
  return (
    <TouchableOpacity {...verifyIconProps(iconProps)}>
      <View style={{padding: 5}}>
        <Icon name={nameIcon} size={20} color={Colors.PRIMARY} />
      </View>
    </TouchableOpacity>
  );
}

function verifyIconProps(iconProps) {
  if (iconProps == null) return {};

  return iconProps;
}

function verifyInputProps(inputProps) {
  if (inputProps == null) return {};

  return inputProps;
}

const styles = StyleSheet.create({
  contentSearchInput: {
    backgroundColor: theme.colors.background_white,
    paddingHorizontal: 10,
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 5,
  },
  inputSearch: {
    flex: 1,
    padding: 10,
  },
});

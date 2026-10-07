import React, {useState} from 'react';
import {View, StyleSheet, TextInput} from 'react-native';
import {TextInputMask} from 'react-native-masked-text';
import Icon from '../../assets/images/brazil.png';
import theme from '../../styles/theme';

export default function InputPhoneCustom(props) {
  const [value, setValue] = useState('');
  const {inputProps, flagProps, onChangeValue} = props;

  return (
    <View style={styles.containerInput}>
      <View style={styles.contentTextInput}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={text => {
            setValue(text);
            if (onChangeValue) onChangeValue(text);
          }}
          keyboardType="number-pad"
          {...inputProps}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  containerInput: {
    backgroundColor: theme.colors.white_light,
    borderWidth: 1,
    borderColor: theme.colors.white,
    marginVertical: 10,
    paddingVertical: 10,
    borderRadius: 5,
    display: 'flex',
    flexDirection: 'row',
  },
  containerSelectCountry: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  iconFlag: {
    width: 25,
    height: 25,
  },
  textFlag: {
    marginHorizontal: 10,
  },
  contentTextInput: {
    flex: 1,
    borderLeftColor: theme.colors.white,
    borderLeftWidth: 1,
    paddingHorizontal: 10,
  },
  input: {
    paddingHorizontal: 10,
  },
});

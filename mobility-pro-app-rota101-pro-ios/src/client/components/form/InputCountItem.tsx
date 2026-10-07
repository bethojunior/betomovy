// @ts-nocheck

import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from '@expo/vector-icons/Ionicons';

import theme from '../../styles/theme';

export function InputCountItem(props) {
  const [count, setCount] = useState(1);
  const {changeValue, initValue} = props;

  useEffect(() => {
    if (initValue != null) setCount(initValue);
  }, []);

  useEffect(() => {
    changeValue(count);
  }, [count]);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.contentButton}
        onPress={() => {
          if (count > 1) setCount(count - 1);
        }}
      >
        <Icon
          name="ios-remove"
          size={25}
          color={count === 1 ? theme.colors.text_gray : theme.colors.black}
          style={styles.btnOption}
        />
      </TouchableOpacity>
      <Text style={styles.contentView}>{count}</Text>
      <TouchableOpacity
        style={styles.contentButton}
        onPress={() => {
          setCount(count + 1);
        }}
      >
        <Icon name="ios-add" size={25} color={theme.colors.black} style={styles.btnOption} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.background_white,
    borderRadius: 5,
    padding: 10,
  },
  contentButton: {
    padding: 5,
  },
  contentView: {
    width: '20%',
    textAlign: 'center',
    fontSize: 20,
  },
  btnOption: {
    paddingHorizontal: 10,
  },
});

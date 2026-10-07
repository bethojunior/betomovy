// @ts-nocheck

import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {FontAwesome} from '@expo/vector-icons';
import {styles} from './styles';
import theme from '../../styles/theme';

export default function EvaluateField({title, value, onChange}) {
  const SIZE_LARGER = 35;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{title}</Text>
      <View style={styles.content}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            if (onChange) onChange(1);
          }}
        >
          <FontAwesome
            name="star"
            size={SIZE_LARGER}
            color={value >= 1 ? theme.colors.yellowStrong : theme.colors.white}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            if (onChange) onChange(2);
          }}
        >
          <FontAwesome
            name="star"
            size={SIZE_LARGER}
            color={value >= 2 ? theme.colors.yellowStrong : theme.colors.white}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            if (onChange) onChange(3);
          }}
        >
          <FontAwesome
            name="star"
            size={SIZE_LARGER}
            color={value >= 3 ? theme.colors.yellowStrong : theme.colors.white}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            if (onChange) onChange(4);
          }}
        >
          <FontAwesome
            name="star"
            size={SIZE_LARGER}
            color={value >= 4 ? theme.colors.yellowStrong : theme.colors.white}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            if (onChange) onChange(5);
          }}
        >
          <FontAwesome
            name="star"
            size={SIZE_LARGER}
            // eslint-disable-next-line eqeqeq
            color={value == 5 ? theme.colors.yellowStrong : theme.colors.white}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

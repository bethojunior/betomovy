import React from 'react';
import {View, ActivityIndicator, StyleSheet} from 'react-native';
import {styles} from './styles';
import theme from '../../styles/theme';

export default function LoadView(props: any) {
  const {style} = props;
  return (
    <View style={[styles.container, style]}>
      <ActivityIndicator size="large" color={theme.colors.text_gray} />
    </View>
  );
}

import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { TextEdit } from '../TextEdit';
import theme from '../../styles/theme';

const ProgressActivityIndicator = ({ progress, ...props }) => {
  return (
    <View style={{ alignItems: 'center' }}>
      <ActivityIndicator {...props} />
      <TextEdit
      color={theme.colors.primary}
      >{progress}%</TextEdit>
    </View>
  );
};

export default ProgressActivityIndicator;

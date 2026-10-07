// @ts-nocheck

import React from 'react';
import { View, TouchableNativeFeedback, StyleSheet, Text } from 'react-native';
import Icon from '@expo/vector-icons/FontAwesome5';
import theme from '../../styles/theme';
import { SubTitle, Title } from './styles';

export default function ButtonOptionCustom(props) {
  const { icon, title, subtitle, onPress, isSpeedMob, colorsText } = props;
  return (
    <View>
      <TouchableNativeFeedback onPress={onPress}>
        <View style={styles.container}>
          {icon}
          <View style={styles.content}>
            <Title color={colorsText}>{title}</Title>
            {subtitle ? <SubTitle color={colorsText}>{subtitle}</SubTitle> : null}
          </View>
          {!isSpeedMob &&
            <Icon
              name="chevron-right"
              size={15}
              style={{
                position: 'absolute',
                right: 15,
                color: theme.colors.secondary,
              }}
            />
          }
        </View>
      </TouchableNativeFeedback>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 15,
  },
});

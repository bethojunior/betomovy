// @ts-nocheck

import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Avatar} from 'react-native-elements';
import {DescriptionEstablishment, styles} from './styles';

export default function TrackOrderEstablishment({order}) {
  return (
    <View style={styles.containerEstablishment}>
      <Avatar
        size="medium"
        rounded
        source={{
          uri: order.company.company_delivery_config.picture,
        }}
        containerStyle={styles.logoEstablishment}
      />
      <DescriptionEstablishment numberOfLines={1}>
        {order.company.fantasyName}
      </DescriptionEstablishment>
    </View>
  );
}

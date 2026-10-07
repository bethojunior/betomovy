// @ts-nocheck

import React from 'react';
import {View, Image, Text} from 'react-native';

import {translate} from '../../locales';
import {DriverName, LabelNameDriver, styles} from './styles';

export default function DriverDeliveryOrder({driver}) {
  return driver === null ? null : (
    <View style={styles.container}>
      <View style={styles.contentInfoDriver}>
        <Image source={{uri: driver.profileImage}} style={styles.profile} />
        <View>
          <LabelNameDriver>
            {translate('driverDeliveryOrder.text_deliveryman')}
          </LabelNameDriver>
          <DriverName>{driver.name}</DriverName>
        </View>
      </View>
    </View>
  );
}

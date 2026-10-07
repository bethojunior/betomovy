// @ts-nocheck

import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import {styles} from './styles';

export default function TabIconWithBadge({name, badgeCount, color, size}) {
  return (
    <View style={styles.container}>
      <Ionicons name={name} size={size} color={color} />
      {badgeCount > 0 && (
        <View style={styles.containerBadge}>
          <Text style={styles.textBadge}>{badgeCount}</Text>
        </View>
      )}
    </View>
  );
}

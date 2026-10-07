// @ts-nocheck

import React from 'react';
import {useNavigation} from '@react-navigation/native';
import Icon from '@expo/vector-icons/Ionicons';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import {styles} from './styles';

export default function NavBarBase({title}) {
  const navigation = useNavigation();
  return (
    <View style={styles.containerNav}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <View style={styles.contentIcon}>
          <Icon name="ios-arrow-back" size={25} />
        </View>
      </TouchableOpacity>
      <Text style={styles.titleNav}>{title}</Text>
      <Text />
    </View>
  );
}

// @ts-nocheck

import React from 'react';
import * as Application from 'expo-application';
import {
  Image,
  Linking,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Feather, MaterialCommunityIcons} from '@expo/vector-icons';
import {styles} from './styles';

import theme from '../../styles/theme';

export default function Publicity({route}) {
  const {publicity} = route.params;
  return (
    <View style={styles.container}>
      <Image
        source={{uri: publicity.banner}}
        resizeMode="stretch"
        style={styles.image}
      />
      <Text style={styles.description}>{publicity.description}</Text>
      <View style={styles.content}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            Linking.openURL(publicity.link);
          }}
        >
          <MaterialCommunityIcons name="web" size={28} color={theme.colors.white} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            Share.share({
              title: Application.applicationName,
              message: publicity.description,
              url: publicity.link,
            });
          }}
        >
          <Feather name="share" size={28} color={theme.colors.white} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

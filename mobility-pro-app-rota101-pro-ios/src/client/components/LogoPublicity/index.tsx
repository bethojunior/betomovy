/* eslint-disable react-hooks/rules-of-hooks */
// @ts-nocheck

import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {TouchableOpacity, StyleSheet, Image} from 'react-native';
import {useAuth} from '../../../context/auth';
import apiMain from '../../api/apiMain';
import {AppTypeConst} from '../../constants/app';

import {useLocal} from '../../contexts/local';
import {styles} from './styles';

export default function LogoPublicity() {
  const [publicity, setPublicity] = useState(null);

  const {placeSelected, placeUser} = useLocal();
  const {user} = useAuth();

  const navigation = useNavigation();

  if (!user) {
    return <></>;
  }

  useEffect(() => {
    if (placeSelected || placeUser) {
      getPublicity();
    }
  }, [placeSelected || placeUser]);

  async function getPublicity() {
    const {latitude, longitude} = placeSelected || placeUser;
    apiMain
      .get(
        `advertising/get?lat=${latitude}&lng=${longitude}&appId=${AppTypeConst}`,
      )
      .then(async response => {
        const {data} = response.data;
        setPublicity(data);
      });
  }

  if (!publicity) return null;

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('Publicity', {publicity});
      }}
      style={styles.container}
    >
      <Image
        source={{uri: publicity.thumbnail}}
        resizeMode="cover"
        style={styles.imageCard}
      />
    </TouchableOpacity>
  );
}

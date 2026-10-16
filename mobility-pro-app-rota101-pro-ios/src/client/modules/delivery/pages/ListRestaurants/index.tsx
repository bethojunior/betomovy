/* eslint-disable eqeqeq */
// @ts-nocheck

import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import * as Location from 'expo-location';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LocalInput from '../../../../components/form/LocalInput';
import { useLocal } from '../../../../contexts/local';
import ListEstablishment from '../../components/ListEstablishment';
import PermissionLocal from '../../../../pages/PermissionLocal';
import { styles } from './styles';
import { useAuth } from '../../../../../context/auth';

export default function ListRestaurant() {
  const { placeSelected, getLocalByPosition } = useLocal();
  const { permissionLocal } = useAuth();
  const [position, setPosition] = useState(null);
  const [isWithoutLocal, setIsWithoutLocal] = useState(false);

  const navigation = useNavigation();
  const { params } = useRoute();
  useEffect(() => {
    async function getEstablishment() {
      if (placeSelected == null) {
        getByLocal();
      } else {
        getDeliveryCompanys(placeSelected.latitude, placeSelected.longitude);
      }
    }

    if (permissionLocal == true || placeSelected != null) getEstablishment();
  }, [placeSelected, permissionLocal]);

  async function getByLocal() {
    const { status } = await Location.getForegroundPermissionsAsync({
      accuracy: 1,
    });

    if (status === 'granted') {
      const { coords } = await Location.getCurrentPositionAsync({ accuracy: 1 });
      const { latitude, longitude } = coords;
      getLocalByPosition(latitude, longitude);
      getDeliveryCompanys(latitude, longitude);
    }
  }

  function getDeliveryCompanys(latitude, longitude) {
    setPosition({ latitude, longitude });
  }

  return (
    <View style={styles.container} keyboardShouldPersistTaps="handled">
      <PermissionLocal
        visible={!permissionLocal}
        onWithoutLocal={status => {
          setIsWithoutLocal(status);
        }}
      />
      <ListEstablishment
        navigation={navigation}
        position={position}
        isWithoutLocal={isWithoutLocal}
        deliverySectionId={params ? params.deliverySectionId : null}
        HeaderComponent={
          <>
            <LocalInput
              onPress={() => {
                navigation.navigate('Local');
              }}
            />
          </>
        }
      />
    </View>
  );
}

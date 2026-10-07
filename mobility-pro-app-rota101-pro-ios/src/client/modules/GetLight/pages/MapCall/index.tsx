// @ts-nocheck

import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {Ionicons} from '@expo/vector-icons';
import * as Location from 'expo-location';
import {WhereForInput, WhereForText} from '../../../../pages/Home/styles';
import {Container, ContainerLogoCentral, Logo, Text} from './styles';
import {useTrip} from '../../../../contexts/Trip';
import {useLocal} from '../../../../contexts/local';
import {useAuth} from '../../../../../context/auth';
import {useTripGL} from '../../../../contexts/TripGL';

export function MapCall() {
  const navigation = useNavigation();
  const {handleTripStateChange, completedTripData, setCompletedTripData} =
    useTripGL();
  const {position, setPosition} = useLocal();
  const {getPermissionLocal, getConfigByPosition} = useAuth();
  const [showTripFinishModal, setShowTripFinishModal] = useState();

  useEffect(() => {
    getPermissionLocal().then(() => {
      Location.getLastKnownPositionAsync({accuracy: 1}).then(location => {
        if (location) {
          setPosition({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          });
        } else {
          Location.getCurrentPositionAsync({accuracy: 1}).then(({coords}) => {
            setPosition({
              latitude: coords.latitude,
              longitude: coords.longitude,
            });
          });
        }
      });
    });
  }, []);

  useEffect(() => {
    if (position) {
      getConfigByPosition(position);
    }
  }, [position]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', handleTripStateChange);

    // return route.params?.noUnsubscribe ? null : unsubscribe;
  }, [navigation]);

  useEffect(() => {
    if (completedTripData) {
      setTimeout(() => {
        setShowTripFinishModal(true);
      }, 400);
    }
  }, [completedTripData]);
  return (
    <>
      <Container>
        <ContainerLogoCentral>
          <Logo source={{uri: 'https://i.imgur.com/4Z0Z9ZQ.png'}} />
        </ContainerLogoCentral>
        <WhereForInput
          onPress={() => {
            navigation.push('GetLightTrip');
          }}
        >
          <WhereForText>Endereço do Serviço</WhereForText>
        </WhereForInput>
      </Container>
    </>
  );
}

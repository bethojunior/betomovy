/* eslint-disable @typescript-eslint/no-shadow */
// @ts-nocheck

import {useCallback, useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import * as Location from 'expo-location';
import {Modal} from 'react-native';
import {Container} from './styles';
import {useLocal} from '../../../../contexts/local';
import LookUpAddressesModalGL from '../../components/LookUpAddressesModalGL';
import TripFinishModal from '../../../../components/TripFinishModal';
import {OfferFingerprint} from '../../../../components/OfferFingerprint';
import {useAuth} from '../../../../../context/auth';
import {useTripGL} from '../../../../contexts/TripGL';
import {STATUS_FINISHED} from '../../../../constants/trip';

export default function TripGetLight() {
  const {position, setPosition, placeUser} = useLocal();
  const {getPermissionLocal, getConfigByPosition, offerBiometry} = useAuth();
  const {tripActiveDetails} = useTripGL();
  const [showTripFinishModal, setShowTripFinishModal] = useState();

  const navigation = useNavigation();

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
    if (placeUser && !origin.address)
      setOrigin({
        address: placeUser.address,
        latitude: placeUser.latitude,
        longitude: placeUser.longitude,
        street: placeUser.street || null,
        type: placeUser.type,
      });
  }, []);

  useEffect(() => {
    if (position) {
      getConfigByPosition(position);
    }
  }, [position]);

  const {
    origin,
    hideTravelOptions,
    trip,
    calculateAll,
    setSelectedPaymentMethod,
    setHideTravelOptions,
    setVisibleLookUpAddressesModal,
    setOrigin,
    getTripPaymentMethods,
    tripStatus,
    dataCalculate,
  } = useTripGL();

  // const {getTripPaymentMethods} = useTrip();

  const [loadingConfirm, setLoadingConfirm] = useState(true);
  const handleAddressesCapture = useCallback(
    async ({origin, destination: destiny, waypoints}) => {
      setLoadingConfirm(true);
      calculateAll(origin, destiny, waypoints);
      await getTripPaymentMethods();
      setLoadingConfirm(false);
      setHideTravelOptions(true);
      setVisibleLookUpAddressesModal(true);
    },
    [],
  );

  const handleBack = useCallback(() => {
    if (navigation.canGoBack()) navigation.goBack();
  }, []);

  useEffect(() => {
    setHideTravelOptions(true);

    async function getSelectedPaymentMethod() {
      const lastSelectedPaymentMethod = await AsyncStorage.getItem(
        'lastSelectedPaymentMethod',
      );

      if (lastSelectedPaymentMethod) {
        setSelectedPaymentMethod(JSON.parse(lastSelectedPaymentMethod));
      }
    }

    getSelectedPaymentMethod();
  }, [trip]);

  const finishedModal = async () => {
    const tripFinished = await AsyncStorage.getItem('tripSchedule');
    if (tripFinished) {
      const tripParse = JSON.parse(tripFinished);
      await tripActiveDetails(tripParse?.tripReference).then(trip => {
        trip?.status === STATUS_FINISHED && setShowTripFinishModal(true);
      });
    }
  };

  useEffect(() => {
    finishedModal();
  }, [tripStatus]);

  return (
    <>
      <Modal visible={offerBiometry}>
        <OfferFingerprint />
      </Modal>
      <TripFinishModal
        setVisible={setShowTripFinishModal}
        visible={showTripFinishModal}
        closeModal={() => setShowTripFinishModal(false)}
      />
      <Container>
        <LookUpAddressesModalGL
          onComplete={handleAddressesCapture}
          setLoader={setLoadingConfirm}
          visible={true && hideTravelOptions}
          hideTravelOptions={hideTravelOptions}
        />
      </Container>
    </>
  );
}

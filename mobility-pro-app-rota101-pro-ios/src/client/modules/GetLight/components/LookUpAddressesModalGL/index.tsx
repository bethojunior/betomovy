/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable consistent-return */
/* eslint-disable radix */
// @ts-nocheck
import {useCallback, useEffect, useRef, useState} from 'react';
import {MaterialIcons} from '@expo/vector-icons';

import {Alert} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {
  Container,
  Content,
  ContentInputIcon,
  ContentInputs,
  DeleteWaypointButton,
  DeleteWaypointButtonContainer,
  WaypointContainer,
  ContainerBackPage,
} from './styles';
import InputAddress from '../../../../components/InputAddress';
import SearchAddressModal from '../../../../components/SearchAddressModal';
import {useLocal} from '../../../../contexts/local';
import {ContainerLogoCentral, Logo} from '../../pages/MapCall/styles';
import {If} from '../If';
import TravelOptionsGL from '../TravelOptionsGL';
import {translate} from '../../../../locales';
import logo from '../../../../../../assets/logo.png';
import Preload from '../../../../components/Preload';
import {useAuth} from '../../../../../context/auth';
import {useTripGL} from '../../../../contexts/TripGL';
import theme from '../../../../styles/theme';
import {BackPage} from '../../../../components/BackPage';
import {useModules} from '../../../../contexts/modules';

export default function LookUpAddressesModalGL({
  onComplete,
  visible,
  setLoader,
}) {
  const {placeUser, position} = useLocal();
  const {
    origin,
    destination,
    waypoints,
    waypointQuantities,
    setOrigin,
    setDestination,
    setWaypoints,
    setWaypointQuantities,
    showLoadingToGetPrices,
  } = useTripGL();
  const {cityConfig, offerBiometry} = useAuth();
  const {init} = useModules();

  const searchAddressModal = useRef(null);

  const [loadingConfirm, setLoadingConfirm] = useState(false);
  const [showWaypointInputAddButton, setShowWaypointInputAddButton] =
    useState(true);
  const [latitudeSum, setLatitudeSum] = useState('');
  const {navigate} = useNavigation();

  const handleConfirmAddress = useCallback(() => {
    setLoadingConfirm(true);
    setLatitudeSum(origin.latitude - 0.0002);
    const originLatitudeSum = origin.latitude - 0.0002;
    const originLongitude = origin.longitude;
    setDestination({
      address: origin.address,
      latitude: originLatitudeSum,
      longitude: originLongitude,
      street: null,
      type: 'here',
    });
    setLoadingConfirm(false);
  }, [destination, origin]);

  useEffect(() => {
    if (origin.address) {
      handleConfirmAddress();
    }
  }, [origin]);

  const handleRemoveInputWaypoint = useCallback(
    id => {
      setWaypointQuantities(state => state - 1);

      setWaypoints(state => {
        if (state.length > 1) {
          return [...state.filter(waypoint => waypoint.id !== id)];
        }

        return [];
      });

      if (waypointQuantities === parseInt(cityConfig.quantityTripWayPoints))
        setShowWaypointInputAddButton(true);
    },
    [waypointQuantities, waypoints],
  );

  const handlesAlreadyAddedAddressValidation = useCallback(
    address => {
      const waypointAlreadyExists = waypoints.some(
        waypoint =>
          waypoint.latitude === address.latitude &&
          waypoint.longitude === address.longitude,
      );
      const originAlreadyExists =
        origin.latitude === address.latitude &&
        origin.longitude === address.longitude;
      const destinationAlreadyExists =
        destination.latitude === address.latitude &&
        destination.longitude === address.longitude;

      return (
        waypointAlreadyExists || originAlreadyExists || destinationAlreadyExists
      );
    },
    [origin, destination, waypoints],
  );

  const handleAddressSelected = useCallback(
    (addressResult, type) => {
      const addressAlreadyAdded =
        handlesAlreadyAddedAddressValidation(addressResult);

      if (addressAlreadyAdded) {
        return Alert.alert('Atenção', 'Endereço já adicionado!');
      }

      const addressesTypes = {
        origin: addressResult =>
          setOrigin({
            address: addressResult.address,
            latitude: addressResult.latitude,
            longitude: addressResult.longitude,
            street: addressResult.street || null,
            type: addressResult.type,
          }),
        destination: addressResult => setDestination({}),
        waypoint: (addressResult, id) =>
          setWaypoints([
            ...waypoints.map(waypoint => {
              if (waypoint.id === id)
                return {
                  ...waypoint,
                  address: addressResult.address,
                  latitude: addressResult.latitude,
                  longitude: addressResult.longitude,
                  street: addressResult.street || null,
                  type: addressResult.type,
                };

              return waypoint;
            }),
          ]),
      };

      const attribute = type.split('-')[0];

      addressesTypes[attribute](addressResult, type);
    },
    [origin, destination, waypoints],
  );

  const handleAddressValidation = useCallback(() => {
    if (!origin.address) {
      Alert.alert('Atenção!', 'Digite o endereço de origem');
      searchAddressModal.current.setTypeOfAddress('origin');
      searchAddressModal.current.show();
      return;
    }
    if (onComplete) onComplete({origin, destination, waypoints});
  }, [origin, destination, waypoints, waypointQuantities]);

  useEffect(() => {
    if (placeUser && !origin.address)
      setOrigin({
        address: placeUser.address,
        latitude: placeUser.latitude,
        longitude: placeUser.longitude,
        street: placeUser.street || null,
        type: placeUser.type,
      });
  }, [placeUser, position]);

  useEffect(() => {
    if (origin.address) {
      handleAddressValidation();
    } else {
      setLoader(false);
    }
  }, [destination]);

  return (
    <If condition={visible}>
      <SearchAddressModal
        handleAddressSelected={(addressResult, type) => {
          handleAddressSelected(addressResult, type);
        }}
        ref={searchAddressModal}
      />
      <Container>
        <Content>
          <ContainerLogoCentral>
            <If condition={init !== 'GetLight'}>
              <ContainerBackPage>
                <BackPage
                  onPress={() => navigate('TripRoutes', {screen: 'Home'})}
                />
              </ContainerBackPage>
            </If>
            <Logo
              source={theme.images.logo ? {uri: theme.images.logo} : logo}
            />
            {/* <LogoPublicity /> */}
          </ContainerLogoCentral>
          <ContentInputIcon>
            <ContentInputs>
              <InputAddress
                value={origin.address}
                onPress={() => {
                  searchAddressModal.current.setTypeOfAddress('origin');
                  searchAddressModal.current.show();
                }}
                placeholder={translate('schedule.placeholder_enter_address')}
              />
              {Boolean(waypoints.length) &&
                waypoints.map((waypoint, index) => (
                  <WaypointContainer key={`${index}-${waypoint.id}`}>
                    <InputAddress
                      value={waypoint.address}
                      onPress={() => {
                        searchAddressModal.current.setTypeOfAddress(
                          waypoint.id,
                        );
                        searchAddressModal.current.show();
                      }}
                    />
                    <DeleteWaypointButtonContainer>
                      <DeleteWaypointButton
                        onPress={() => handleRemoveInputWaypoint(waypoint.id)}
                      >
                        <MaterialIcons name="close" size={18} color="black" />
                      </DeleteWaypointButton>
                    </DeleteWaypointButtonContainer>
                  </WaypointContainer>
                ))}
              <Preload visible={showLoadingToGetPrices && !offerBiometry} />
            </ContentInputs>
          </ContentInputIcon>
          <If condition={latitudeSum !== ''}>
            <TravelOptionsGL hide={!visible} />
          </If>
        </Content>
      </Container>
    </If>
  );
}

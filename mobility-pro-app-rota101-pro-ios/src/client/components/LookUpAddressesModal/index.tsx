import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {AntDesign, MaterialIcons, Ionicons} from '@expo/vector-icons';

import {Alert, View} from 'react-native';
import InputAddress from '../InputAddress';
import SearchAddressModal from '../SearchAddressModal';
import {
  ButtonBack,
  Container,
  ContainerButtonsUse,
  Content,
  ContentIcons,
  ContentInputIcon,
  ContentInputs,
  DeleteWaypointButton,
  DeleteWaypointButtonContainer,
  DestinationAddressContainer,
  DestinationIcon,
  OriginIcon,
  SeparateIcon,
  StopIcon,
  WaypointContainer,
} from './styles';
import {useLocal} from '../../contexts/local';
import {useTrip} from '../../contexts/Trip';
import {useAuth} from '../../../context/auth';
import {If} from '../If';
import theme from '../../styles/theme';
import {translate} from '../../locales';
import {ButtonTextAction} from '../ButtonTextAction';
import {RFValue} from 'react-native-responsive-fontsize';
import Helper from '../../utils/Helper';

export default function LookUpAddressesModal({
  onBack,
  onComplete,
  visible,
  destinationPerson,
  voice,
  handleBackButtonOnAddress,
  typeAddress,
}) {
  const {placeUser, lastPlaceSelected} = useLocal();
  const {stateTripCustomer, dispatchTripCustomer} = useTrip();
  const {origin, destination, waypoints, waypointQuantities} =
    stateTripCustomer;
  const {cityConfig, generalSettings} = useAuth();
  const searchAddressModal = useRef(null);
  const [showWaypointInputAddButton, setShowWaypointInputAddButton] =
    useState(true);

  const tripNoDestination = async () => {
    const destination = {
      address: origin?.address,
      latitude: origin?.latitude,
      longitude: origin?.longitude,
      street: origin?.street || null,
      type: origin?.type,
    };
    await onComplete({origin, destination, waypoints});
  };

  const buttonsActive = [
    {
      text: translate('tripDriver.trip_without_destination'),
      onPress: () => {
        tripNoDestination();
      },
      conditionalShow: Helper.generalSettingsActive(
        generalSettings,
        'enable_open_price_trip',
      ),
      icon: (
        <Ionicons
          style={{
            marginRight: RFValue(5),
          }}
          name="car"
          size={RFValue(18)}
          color={theme.colors.secondary}
        />
      ),
    },
  ];

  useEffect(() => {
    if (lastPlaceSelected) {
      dispatchTripCustomer({
        type: 'update',
        field: 'destination',
        arg: lastPlaceSelected,
      });
    }
  }, []);

  const handleRemoveInputWaypoint = useCallback(
    id => {
      dispatchTripCustomer({
        type: 'update',
        field: 'waypointQuantities',
        arg: waypointQuantities - 1,
      });

      if (waypoints.length > 0) {
        dispatchTripCustomer({
          type: 'update',
          field: 'waypoints',
          arg:
            waypoints.length > 1
              ? [...waypoints.filter(waypoint => waypoint.id !== id)]
              : [],
        });
      }

      if (waypointQuantities === parseInt(cityConfig.quantityTripWayPoints))
        setShowWaypointInputAddButton(true);
    },
    [waypointQuantities, waypoints],
  );

  const handleAddInputWaypoint = useCallback(() => {
    dispatchTripCustomer({
      type: 'update',
      field: 'waypointQuantities',
      arg: waypointQuantities + 1,
    });

    dispatchTripCustomer({
      type: 'update',
      field: 'waypoints',
      arg: [
        ...waypoints,
        {id: `waypoint-${new Date().getTime()}`, address: ''},
      ],
    });

    if (waypointQuantities + 1 === parseInt(cityConfig.quantityTripWayPoints))
      setShowWaypointInputAddButton(false);
  }, [waypointQuantities, waypoints]);

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
          dispatchTripCustomer({
            type: 'update',
            field: 'origin',
            arg: {
              address: addressResult.address,
              latitude: addressResult.latitude,
              longitude: addressResult.longitude,
              street: addressResult.street || null,
              type: addressResult.type,
            },
          }),
        destination: addressResult =>
          dispatchTripCustomer({
            type: 'update',
            field: 'destination',
            arg: {
              address: addressResult.address,
              latitude: addressResult.latitude,
              longitude: addressResult.longitude,
              street: addressResult.street || null,
              type: addressResult.type,
            },
          }),
        waypoint: (addressResult, id) =>
          dispatchTripCustomer({
            type: 'update',
            field: 'waypoints',
            arg: [
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
            ],
          }),
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

    if (!destination.address) {
      Alert.alert('Atenção!', 'Digite o endereço de destino');
      searchAddressModal.current.setTypeOfAddress('destination');
      searchAddressModal.current.show();
      return;
    }

    if (onComplete) onComplete({origin, destination, waypoints});
  }, [origin, destination, waypoints, waypointQuantities]);

  useEffect(() => {
    if (placeUser && !origin.address)
      dispatchTripCustomer({
        type: 'update',
        field: 'origin',
        arg: {
          address: placeUser.address,
          latitude: placeUser.latitude,
          longitude: placeUser.longitude,
          street: placeUser.street || null,
          type: placeUser.type,
        },
      });
  }, [visible]);

  useEffect(() => {
    if (destination.address) handleAddressValidation();
  }, [destination]);

  useEffect(() => {
    if (visible && voice) {
      setTimeout(() => {
        searchAddressModal?.current?.valueVoice(voice, 'destination');
      }, 1000);
    }
  }, [voice]);

  const monitoringMapFee = useMemo(() => {
    const dataWaypoint = waypoints?.find(
      item => item?.id && item?.address === '',
    );
    if (
      (origin && Object?.keys(origin)?.length === 0) ||
      !origin ||
      typeAddress === 'origin'
    ) {
      return 'origin';
    } else if (waypoints.length > 0 && dataWaypoint) {
      if (dataWaypoint?.address === '' || typeAddress === 'waypoint') {
        return 'waypoint';
      }
    } else if (
      (destination && Object?.keys(destination)?.length === 0) ||
      !destination ||
      typeAddress === 'destination'
    ) {
      return 'destination';
    }
  }, [origin, destination, typeAddress, waypoints]);

  return (
    <If condition={visible}>
      <View>
        <SearchAddressModal
          handleAddressSelected={(addressResult, type) => {
            handleAddressSelected(addressResult, type);
          }}
          handleBackButtonOnAddress={handleBackButtonOnAddress}
          ref={searchAddressModal}
        />
        <Container>
          <Content>
            <ButtonBack onPress={onBack}>
              <AntDesign name="arrowleft" size={30} color="black" />
            </ButtonBack>
            <ContentInputIcon>
              <ContentIcons>
                <OriginIcon />
                <SeparateIcon />
                {Boolean(waypoints.length) &&
                  waypoints.map((waypoint, index) => (
                    <React.Fragment key={`${waypoint.id}-${index}`}>
                      <StopIcon />
                      <SeparateIcon />
                    </React.Fragment>
                  ))}
                <DestinationIcon />
              </ContentIcons>
              <ContentInputs>
                <InputAddress
                  value={origin.address}
                  activeOpacity={monitoringMapFee === 'origin'}
                  onPress={() => {
                    searchAddressModal.current.setTypeOfAddress('origin');
                    searchAddressModal.current.show();
                  }}
                  placeholder={translate(
                    'trip.input_address_placeholer_origin',
                  )}
                />
                {Boolean(waypoints.length) &&
                  waypoints.map((waypoint, index) => (
                    <WaypointContainer key={`${index}-${waypoint.id}`}>
                      <InputAddress
                        activeOpacity={monitoringMapFee === 'waypoint'}
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
                          <MaterialIcons
                            name="close"
                            size={18}
                            color={theme.colors.secondary}
                          />
                        </DeleteWaypointButton>
                      </DeleteWaypointButtonContainer>
                    </WaypointContainer>
                  ))}
                {/* <If condition={!destinationPerson}> */}
                <DestinationAddressContainer>
                  <InputAddress
                    value={destination.address}
                    activeOpacity={monitoringMapFee === 'destination'}
                    onPress={() => {
                      searchAddressModal.current.setTypeOfAddress(
                        'destination',
                      );
                      searchAddressModal.current.show();
                    }}
                    placeholder={translate(
                      'trip.input_address_placeholder_text',
                    )}
                  />
                  {showWaypointInputAddButton && (
                    <DeleteWaypointButtonContainer>
                      <DeleteWaypointButton onPress={handleAddInputWaypoint}>
                        <MaterialIcons
                          name="add"
                          size={18}
                          color={theme.colors.secondary}
                        />
                      </DeleteWaypointButton>
                    </DeleteWaypointButtonContainer>
                  )}
                </DestinationAddressContainer>
                {/* </If> */}
              </ContentInputs>
            </ContentInputIcon>
          </Content>
        </Container>
      </View>
      <ContainerButtonsUse>
        {buttonsActive?.map((button, index) => {
          return (
            <If key={index} condition={button.conditionalShow}>
              <View
                style={{
                  borderBottomColor: theme.colors.secondary,
                  borderBottomWidth: 0.5,
                  paddingVertical: RFValue(5),
                }}
              >
                <ButtonTextAction
                  icon={button?.icon}
                  text={button?.text}
                  onPress={button?.onPress}
                />
              </View>
            </If>
          );
        })}
      </ContainerButtonsUse>
    </If>
  );
}

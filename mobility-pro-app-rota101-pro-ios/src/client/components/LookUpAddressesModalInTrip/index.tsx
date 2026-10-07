/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable radix */
// @ts-nocheck

import React, {useCallback, useEffect, useRef, useState} from 'react';
import {AntDesign, MaterialIcons} from '@expo/vector-icons';
import {Alert, Modal, View} from 'react-native';
import InputAddress from '../InputAddress';
import SearchAddressModal from '../SearchAddressModal';
import {
  ButtonBack,
  ButtonConfirm,
  Container,
  ContainerNewValue,
  Content,
  ContentChangePrice,
  ContentIcons,
  ContentInputIcon,
  ContentInputs,
  ContentText,
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
import {TextEdit} from '../TextEdit';
import theme from '../../styles/theme';
import {IfLoaderInsideScreen} from '../IfLoaderInsideScreen';
import Helper from '../../utils/Helper';
import {translate} from '../../locales';

export default function LookUpAddressesModalInTrip({
  onBack,
  onComplete,
  visible,
  destinationPerson,
  voice,
  setVisible,
}) {
  const {placeUser, lastPlaceSelected} = useLocal();
  const {changeRoute, stateTripCustomer, dispatchTripCustomer} = useTrip();

  const {
    origin,
    destination,
    waypoints,
    waypointQuantities,
    isLoading,
    changeRoutePreview,
  } = stateTripCustomer;

  const {cityConfig} = useAuth();
  const searchAddressModal = useRef(null);
  const [showWaypointInputAddButton, setShowWaypointInputAddButton] =
    useState(true);

  useEffect(() => {
    if (lastPlaceSelected && Object.keys(lastPlaceSelected).length > 0) {
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
        {
          id: `waypoint-${new Date().getTime()}`,
          type: 'waypoint',
        },
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
              type: 'origin',
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
              type: 'destination',
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
                    latitude: Number(addressResult.latitude),
                    longitude: Number(addressResult.longitude),
                    street: addressResult.street || null,
                    type: 'waypoint',
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
    if (!destination?.address) {
      if (waypoints.length > 0) {
        const destination = {
          address: waypoints[0].address,
          latitude: Number(waypoints[0].latitude),
          longitude: Number(waypoints[0].longitude),
          street: waypoints[0].street || null,
          type: 'destination',
        };
        if (onComplete) onComplete({origin, destination, waypoints: []});
        dispatchTripCustomer({
          type: 'update',
          field: 'waypoints',
          arg: [],
        });
        return;
      }

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

  // useEffect(() => {
  //   if (
  //     (destination?.address && searchAddressModal?.current?.setTypeOfAddress) ||
  //     (destination?.name && searchAddressModal?.current?.setTypeOfAddress)
  //   )
  //     handleAddressValidation();
  // }, [destination, origin, waypoints]);

  useEffect(() => {
    if (visible && voice) {
      setTimeout(() => {
        searchAddressModal?.current?.valueVoice(voice, 'destination');
      }, 1000);
    }
  }, [voice]);

  return (
    <If condition={visible}>
      <Modal visible={visible}>
        <View
          style={{
            flex: 1,
          }}
        >
          <SearchAddressModal
            handleAddressSelected={(addressResult, type) => {
              handleAddressSelected(addressResult, type);
            }}
            ref={searchAddressModal}
          />
          <Container>
            <Content>
              <ButtonBack onPress={onBack}>
                <AntDesign name="arrowleft" size={30} color={theme.colors.secondary} />
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
                    disabled
                    onPress={() => {
                      searchAddressModal.current.setTypeOfAddress('origin');
                      searchAddressModal.current.show();
                    }}
                    placeholder="Insira o local de partida"
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
                            onPress={() =>
                              handleRemoveInputWaypoint(waypoint.id)
                            }
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
                      value={destination?.address || destination?.name}
                      onPress={() => {
                        searchAddressModal.current.setTypeOfAddress(
                          'destination',
                        );
                        searchAddressModal.current.show();
                      }}
                      placeholder="Para onde?"
                    />
                    {showWaypointInputAddButton && (
                      <DeleteWaypointButtonContainer>
                        <DeleteWaypointButton onPress={handleAddInputWaypoint}>
                          <MaterialIcons name="add" size={18} color={theme.colors.secondary} />
                        </DeleteWaypointButton>
                      </DeleteWaypointButtonContainer>
                    )}
                  </DestinationAddressContainer>
                  {/* </If> */}
                </ContentInputs>
              </ContentInputIcon>
            </Content>
          </Container>
          <IfLoaderInsideScreen loading={isLoading}>
            <If condition={Object.keys(changeRoutePreview).length === 0}>
              <ButtonConfirm onPress={handleAddressValidation}>
                <TextEdit color={theme.colors.primaryText} size="large">
                  {translate('tripDriver.text_ok')}
                </TextEdit>
              </ButtonConfirm>
            </If>
            <If condition={Object.keys(changeRoutePreview).length > 0}>
              <ContainerNewValue>
                <ContentChangePrice>
                  <ButtonBack
                    onPress={() =>
                      dispatchTripCustomer({
                        type: 'update',
                        field: 'changeRoutePreview',
                        arg: {},
                      })
                    }
                  >
                    <AntDesign name="arrowleft" size={30} color="black" />
                  </ButtonBack>
                  <ContentText>
                    <TextEdit size="large" color={theme.colors.secondary}>
                      {translate('tripDriver.text_new_value_recalculated')}
                    </TextEdit>
                    <TextEdit size="large" color={theme.colors.secondary}>
                      {`${cityConfig.typeMoney} ${Helper.maskMoney(
                        Number(changeRoutePreview?.price),
                      )}`}
                    </TextEdit>
                  </ContentText>
                  <ButtonConfirm
                    onPress={async () => {
                      changeRoute();
                      setVisible(false);
                    }}
                  >
                    <TextEdit color={theme.colors.primaryText} size="large">
                      {translate('tripDriver.text_confirm')}
                    </TextEdit>
                  </ButtonConfirm>
                </ContentChangePrice>
              </ContainerNewValue>
            </If>
          </IfLoaderInsideScreen>
        </View>
      </Modal>
    </If>
  );
}

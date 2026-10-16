import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RFValue } from 'react-native-responsive-fontsize';
import InputAddress from '../InputAddress';
import SearchAddressModal from '../SearchAddressModal';
import { BottomSheetModal } from '../BottomSheetModal';
import {
  AddressInputWrapper,
  AddressRow,
  BackButton,
  ButtonConfirm,
  Content,
  ContentChangePrice,
  ContentText,
  DestinationSquare,
  Footer,
  HeaderRow,
  HeaderSubtitle,
  HeaderTextGroup,
  HeaderTitle,
  InputsColumn,
  MarkerColumn,
  MarkerLine,
  OriginBall,
  OriginHelpCard,
  OriginHelpText,
  RoundIconButton,
  RouteCard,
  TimelineRow,
  Wrapper,
  WaypointBall,
} from './styles';
import { useLocal } from '../../contexts/local';
import { useTrip } from '../../contexts/Trip';
import { useAuth } from '../../../context/auth';
import { TextEdit } from '../TextEdit';
import theme from '../../styles/theme';
import Helper from '../../utils/Helper';
import { translate } from '../../locales';

export default function LookUpAddressesModalInTrip({
  onBack,
  onComplete,
  visible,
  destinationPerson,
  voice,
  setVisible,
}) {
  const [isSubmittingChangeRoute, setIsSubmittingChangeRoute] = useState<boolean>();

  const { placeUser, lastPlaceSelected } = useLocal();
  const { changeRoute, stateTripCustomer, dispatchTripCustomer } = useTrip();

  const {
    origin,
    destination,
    waypoints,
    waypointQuantities,
    isLoading,
    changeRoutePreview,
  } = stateTripCustomer;

  const { cityConfig } = useAuth();
  const searchAddressModal = useRef(null);
  const [showWaypointInputAddButton, setShowWaypointInputAddButton] = useState(true);

  useEffect(() => {
    if (lastPlaceSelected && Object.keys(lastPlaceSelected).length > 0) {
      dispatchTripCustomer({
        type: 'update',
        field: 'destination',
        arg: lastPlaceSelected,
      });
    }
  }, []);

  const resetChangeRoutePreview = useCallback(() => {
    if (Object.keys(changeRoutePreview).length > 0) {
      dispatchTripCustomer({ type: 'update', field: 'changeRoutePreview', arg: {} });
    }
  }, [changeRoutePreview, dispatchTripCustomer]);

  const handleRemoveInputWaypoint = useCallback(
    (id) => {
      resetChangeRoutePreview();

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
              ? [...waypoints.filter((waypoint) => waypoint.id !== id)]
              : [],
        });
      }

      if (waypointQuantities === (parseInt(cityConfig?.quantityTripWayPoints) || 3))
        setShowWaypointInputAddButton(true);
    },
    [waypointQuantities, waypoints, resetChangeRoutePreview],
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

    if (waypointQuantities + 1 === (parseInt(cityConfig?.quantityTripWayPoints) || 3))
      setShowWaypointInputAddButton(false);
  }, [waypointQuantities, waypoints]);

  const handlesAlreadyAddedAddressValidation = useCallback(
    (address) => {
      const waypointAlreadyExists = waypoints.some(
        (waypoint) =>
          waypoint.latitude === address.latitude && waypoint.longitude === address.longitude,
      );
      const originAlreadyExists =
        origin.latitude === address.latitude && origin.longitude === address.longitude;
      const destinationAlreadyExists =
        destination.latitude === address.latitude &&
        destination.longitude === address.longitude;

      return waypointAlreadyExists || originAlreadyExists || destinationAlreadyExists;
    },
    [origin, destination, waypoints],
  );

  const handleAddressSelected = useCallback(
    (addressResult, type) => {
      resetChangeRoutePreview();

      const addressAlreadyAdded = handlesAlreadyAddedAddressValidation(addressResult);

      if (type.startsWith('waypoint')) {
        if (waypoints.length > 0) {
          const isSameAsOrigin =
            origin.latitude === addressResult.latitude &&
            origin.longitude === addressResult.longitude;

          if (isSameAsOrigin) {
            return Alert.alert(
              'Atenção',
              'Endereço do waypoint não pode ser igual ao da origem!',
            );
          }
        }
      }

      if (waypoints.length <= 0 && addressAlreadyAdded) {
        return Alert.alert('Atenção', 'Endereço já adicionado!');
      }

      const addressesTypes = {
        origin: (addressResult) =>
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
        destination: (addressResult) =>
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
              ...waypoints.map((waypoint) => {
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
      const attribute = type?.split('-')[0];

      addressesTypes[attribute](addressResult, type);
    },
    [origin, destination, waypoints, resetChangeRoutePreview],
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
        if (onComplete) onComplete({ origin, destination, waypoints: [] });
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

    if (onComplete) onComplete({ origin, destination, waypoints });
  }, [origin, destination, waypoints, waypointQuantities]);

  const handleBack = () => {
    if (Object.keys(changeRoutePreview).length > 0) {
      dispatchTripCustomer({ type: 'update', field: 'changeRoutePreview', arg: {} });
    }

    if (onBack) onBack();
  };

  const handleChangeRoute = async () => {
    setIsSubmittingChangeRoute(true);
    await changeRoute();
    setIsSubmittingChangeRoute(false);
    setVisible(false);
  };

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
    if (visible && voice) {
      setTimeout(() => {
        searchAddressModal?.current?.valueVoice(voice, 'destination');
      }, 1000);
    }
  }, [voice]);

  return (
    <BottomSheetModal visible={visible} onRequestClose={handleBack}>
      <SearchAddressModal
        ref={searchAddressModal}
        handleAddressSelected={(addressResult, type) => {
          handleAddressSelected(addressResult, type);
        }}
      />

      <LookUpAddressesContent
        origin={origin}
        destination={destination}
        waypoints={waypoints}
        changeRoutePreview={changeRoutePreview}
        isLoading={isLoading}
        isSubmittingChangeRoute={isSubmittingChangeRoute}
        showWaypointInputAddButton={showWaypointInputAddButton}
        cityConfig={cityConfig}
        onBack={handleBack}
        onPressOrigin={() => {
          searchAddressModal.current.setTypeOfAddress('origin');
          searchAddressModal.current.show();
        }}
        onPressWaypoint={(id) => {
          searchAddressModal.current.setTypeOfAddress(id);
          searchAddressModal.current.show();
        }}
        onPressDestination={() => {
          searchAddressModal.current.setTypeOfAddress('destination');
          searchAddressModal.current.show();
        }}
        onRemoveWaypoint={handleRemoveInputWaypoint}
        onAddWaypoint={handleAddInputWaypoint}
        onConfirm={handleAddressValidation}
        onChangeRoute={handleChangeRoute}
      />
    </BottomSheetModal>
  );
}

interface LookUpAddressesContentProps {
  origin: any;
  destination: any;
  waypoints: any[];
  changeRoutePreview: any;
  isLoading: boolean;
  isSubmittingChangeRoute: boolean;
  showWaypointInputAddButton: boolean;
  cityConfig: any;
  onBack: () => void;
  onPressOrigin: () => void;
  onPressWaypoint: (id: string) => void;
  onPressDestination: () => void;
  onRemoveWaypoint: (id: string) => void;
  onAddWaypoint: () => void;
  onConfirm: () => void;
  onChangeRoute: () => void;
}

const LookUpAddressesContent = ({
  origin,
  destination,
  waypoints,
  changeRoutePreview,
  isLoading,
  isSubmittingChangeRoute,
  showWaypointInputAddButton,
  cityConfig,
  onBack,
  onPressOrigin,
  onPressWaypoint,
  onPressDestination,
  onRemoveWaypoint,
  onAddWaypoint,
  onConfirm,
  onChangeRoute,
}: LookUpAddressesContentProps) => {
  const [showOriginHelp, setShowOriginHelp] = useState(false);
  const hasChangeRoutePreview = Object.keys(changeRoutePreview).length > 0;

  return (
    <Wrapper>
      <HeaderRow>
        <BackButton activeOpacity={0.7} onPress={onBack}>
          <Ionicons name="chevron-back" size={RFValue(18)} color={theme.colors.secondary} />
        </BackButton>

        <HeaderTextGroup>
          <HeaderTitle>{translate('trip.edit_route_title')}</HeaderTitle>
          <HeaderSubtitle>{translate('trip.edit_route_subtitle')}</HeaderSubtitle>
        </HeaderTextGroup>
      </HeaderRow>

      <Content>
        <RouteCard>
          <InputsColumn>
            <TimelineRow>
              <MarkerColumn>
                <OriginBall />
                <MarkerLine />
              </MarkerColumn>

              <AddressRow>
                <AddressInputWrapper>
                  <InputAddress
                    value={origin.address}
                    disabled
                    onPress={onPressOrigin}
                    placeholder="Insira o local de partida"
                  />
                </AddressInputWrapper>
                <RoundIconButton
                  variant="help"
                  onPress={() => setShowOriginHelp(current => !current)}
                >
                  <Ionicons
                    name="help-circle-outline"
                    size={RFValue(18)}
                    color={theme.colors.text_gray}
                  />
                </RoundIconButton>
              </AddressRow>
            </TimelineRow>

            {showOriginHelp && (
              <OriginHelpCard>
                <Ionicons
                  name="information-circle"
                  size={RFValue(16)}
                  color={theme.colors.primary}
                />
                <OriginHelpText>{translate('trip.origin_address_cannot_change')}</OriginHelpText>
              </OriginHelpCard>
            )}

            {waypoints.map((waypoint, index) => (
              <TimelineRow key={`${index}-${waypoint.id}`}>
                <MarkerColumn>
                  <WaypointBall />
                  <MarkerLine />
                </MarkerColumn>

                <AddressRow>
                  <AddressInputWrapper>
                    <InputAddress
                      value={waypoint.address}
                      onPress={() => onPressWaypoint(waypoint.id)}
                    />
                  </AddressInputWrapper>
                  <RoundIconButton
                    variant="remove"
                    onPress={() => onRemoveWaypoint(waypoint.id)}
                  >
                    <Ionicons name="close" size={RFValue(14)} color={theme.colors.text_gray} />
                  </RoundIconButton>
                </AddressRow>
              </TimelineRow>
            ))}

            <TimelineRow>
              <MarkerColumn>
                <DestinationSquare />
              </MarkerColumn>

              <AddressRow>
                <AddressInputWrapper>
                  <InputAddress
                    value={destination?.address || destination?.name}
                    onPress={onPressDestination}
                    placeholder="Para onde?"
                  />
                </AddressInputWrapper>
                {showWaypointInputAddButton && (
                  <RoundIconButton variant="add" onPress={onAddWaypoint}>
                    <Ionicons name="add" size={RFValue(16)} color={theme.colors.secondary} />
                  </RoundIconButton>
                )}
              </AddressRow>
            </TimelineRow>
          </InputsColumn>
        </RouteCard>
      </Content>

      <Footer>
        {!hasChangeRoutePreview ? (
          <ButtonConfirm
            onPress={onConfirm}
            title={translate('tripDriver.text_ok')}
            loading={isLoading}
          />
        ) : (
          <ContentChangePrice>
            <ContentText>
              <TextEdit size="large" color={theme.colors.secondary}>
                {translate('tripDriver.text_new_value_recalculated')}
              </TextEdit>
              <TextEdit size="xlarge" color={theme.colors.secondary} fontWeight="bold">
                {`${cityConfig?.typeMoney} ${Helper.maskMoney(Number(changeRoutePreview?.price))}`}
              </TextEdit>
            </ContentText>
            <ButtonConfirm
              title={translate('tripDriver.text_confirm')}
              onPress={onChangeRoute}
              loading={isSubmittingChangeRoute}
            />
          </ContentChangePrice>
        )}
      </Footer>
    </Wrapper>
  );
};

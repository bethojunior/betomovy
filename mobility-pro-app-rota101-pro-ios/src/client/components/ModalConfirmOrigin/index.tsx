import {
  Container,
  Body,
  HeaderTitle,
  ButtonConfirm,
  AddressOrigin,
  ButtonFixAddress,
  TextBtnConfirm,
  ContentAddress,
  TextBtnFixAddress,
} from './styles';

import {useTrip} from '../../contexts/Trip';

import {translate} from '../../locales';
import SearchAddressModal from '../SearchAddressModal';

import {useCallback, useEffect, useRef} from 'react';
import {Alert} from 'react-native';
import {useAddressConfirmation} from '../../../driver/src/hooks/addressConfirmation';

interface ModalConfirmOriginProps {
  visibleTravelOptions: boolean;
  setVisible: (data: boolean) => void;
  address: string;
  handleConfirmRace: () => void;
  setVisibleTravelOption: (data: boolean) => void;
}

export const ModalConfirmOrigin = ({
  visibleTravelOptions,
  setVisible,
  address,
  handleConfirmRace,
  setVisibleTravelOption,
}: ModalConfirmOriginProps) => {
  const limitCharacters = (characters: string) => {
    return `${characters.substring(0, 60)}...`;
  };

  const searchAddressModal = useRef(null);

  const {
    stateTripCustomer,
    dispatchTripCustomer,
    calculateAll,
    getTripPaymentMethods,
  } = useTrip();

  const {confirmAddress} = useAddressConfirmation();

  const {origin, destination, waypoints} = stateTripCustomer;

  const onAddressConfirmed = () => {
    confirmAddress();
  };

  const handleSetOrigin = () => {
    searchAddressModal.current.setTypeOfAddress('origin');
    searchAddressModal.current.show();
  };

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

      setVisibleTravelOption(true);

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

  useEffect(() => {
    calculateAll(origin, destination as any, waypoints, true);
    getTripPaymentMethods();

    if (visibleTravelOptions) {
      setVisible(false);
    }
  }, [origin]);

  return (
    <Container>
      <SearchAddressModal
        handleAddressSelected={(addressResult, type) => {
          handleAddressSelected(addressResult, type);
        }}
        ref={searchAddressModal}
      />
      <HeaderTitle>{translate('modalConfirmOrigin.title_modal')}</HeaderTitle>
      <Body>
        <ContentAddress>
          <AddressOrigin>{limitCharacters(address)}</AddressOrigin>
          <ButtonFixAddress>
            <TextBtnFixAddress onPress={handleSetOrigin}>
              {translate('modalConfirmOrigin.text_button_fix')}
            </TextBtnFixAddress>
          </ButtonFixAddress>
        </ContentAddress>
        <ButtonConfirm
          onPress={() => {
            handleConfirmRace();
            setVisible(false);
          }}
        >
          <TextBtnConfirm>
            {translate('modalConfirmOrigin.text_confirm_button')}
          </TextBtnConfirm>
        </ButtonConfirm>
      </Body>
    </Container>
  );
};

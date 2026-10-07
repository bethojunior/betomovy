import {Alert, Image} from 'react-native';
import React from 'react';
import {Marker} from 'react-native-maps';
import {useTrip} from '../../contexts/Trip';
import {translate} from '../../locales';

import {
  AddressContainer,
  ArrrowIcon,
  ContainerCard,
  ContainerMinutes,
  TextCard,
  TextMinuts,
} from './styles';
import {useLocal} from '../../contexts/local';
import { DestinationProps } from '../../contexts/Trip/types';

interface Props {
  local: DestinationProps;
  address: string;
}

export const MarkerLabel = React.memo(({local, address}: Props) => {
  const {dispatchTripCustomer, stateTripCustomer} = useTrip();
  const {setLastPlaceSelected} = useLocal();
  const {calculateAllData} = stateTripCustomer;

  return (
    <>
      <Marker
        coordinate={{
          latitude: Number(local.latitude),
          longitude: Number(local.longitude),
        }}
        // flat
        style={{
          alignItems: 'center',
          flexDirection: 'column-reverse',
        }}
        onPress={() => {
          Alert.alert(
            translate('tripDriver.do_you_want_to_change_the_destination'),
            translate(
              'tripDriver.when_changing_the_destination_the_route_will_recalculated',
            ),
            [
              {
                text: translate('tripDriver.cancel'),
                onPress: () => {},
                style: 'cancel',
              },
              {
                text: translate('tripDriver.accept'),
                onPress: () => {
                  setLastPlaceSelected({});
                  dispatchTripCustomer({
                    type: 'editTrip',
                  });
                },
              },
            ],
            {cancelable: false},
          );
        }}
      >
        <Image
          style={{
            width: 35,
            height: 35,
          }}
          source={require('../../assets/images/pin3d.png')}
        />
        <ContainerCard>
          <ContainerMinutes>
            <TextMinuts>{calculateAllData?.duration}</TextMinuts>
            <TextMinuts>{translate('trip.minutes')}</TextMinuts>
          </ContainerMinutes>
          <AddressContainer>
            <TextCard numberOfLines={2}>{address}</TextCard>
            <ArrrowIcon name="arrow-forward-ios" />
          </AddressContainer>
        </ContainerCard>
      </Marker>
    </>
  );
});

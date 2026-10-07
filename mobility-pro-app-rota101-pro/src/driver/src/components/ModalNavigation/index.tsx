import {Linking} from 'react-native';
import {useTripProvider} from '../../context/Trip';
import {CardButtonText} from '../CardButtonText';
import ModalFrame from '../Modal/ModalFrame';
import {
  STATUS_ACCEPTED,
  STATUS_BOARDING,
  STATUS_IN_PROGRESS,
} from '../../constants/trip';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useEffect, useState} from 'react';
import {OrderProps} from '../../../../context/DeliveryOrder/types';
import {OrderStatus} from '../CardOrder/Constants';

interface Props {
  modalNavigation: boolean;
  setModalNavigation: (value: boolean) => void;
  delivery?: OrderProps;
}

export const ModalNavigation = ({
  modalNavigation,
  setModalNavigation,
  delivery,
}: Props) => {
  const openNavigationDelivery = (
    url: string,
    params: string = '',
    latitude,
    longitude,
  ) => {
    Linking.openURL(`${url}${latitude},${longitude}${params}`);
    setModalNavigation(false);
  };
  if (delivery) {
    const {latitude: lat, longitude: lng} =
      delivery?.delivery_order_status?.id < OrderStatus.ORDER_OUT_FOR_DELIVERY
        ? delivery?.company_address
        : delivery?.delivery_order_place.place;

    return (
      <ModalFrame
        visible={modalNavigation}
        setVisible={setModalNavigation}
        hideConfirm
        onClose={() => {
          setModalNavigation(false);
        }}
      >
        <CardButtonText
          text={'Waze'}
          onPress={async () => {
            openNavigationDelivery(
              'https://waze.com/ul?ll=',
              '&navigate=yes',
              lat,
              lng,
            );
            await AsyncStorage.setItem('lastGps', 'waze');
            setModalNavigation(false);
          }}
        />
        <CardButtonText
          text={'Google Maps'}
          onPress={async () => {
            openNavigationDelivery(
              'https://www.google.com/maps/dir/?api=1&destination=',
              '',
              lat,
              lng,
            );
            await AsyncStorage.setItem('lastGps', 'google');
            setModalNavigation(false);
          }}
        />
      </ModalFrame>
    );
  }
  const tripAccepted: any = useTripProvider(
    (context: any) => context.stateTrip.tripAccepted,
  );
  const [loading, setLoading] = useState(true);

  const waypoints = tripAccepted?.tripWayPoints?.filter(waypoint => {
    return waypoint?.confirmed === '0';
  });

  const switchCaseSearchNative = (
    status,
    origin,
    destination,
    waypoints,
    dir = 'latitude',
  ) => {
    switch (status) {
      case STATUS_ACCEPTED:
        return origin[dir];
      case STATUS_BOARDING:
        return origin[dir];
      case STATUS_IN_PROGRESS:
        return waypoints && waypoints.length > 0
          ? waypoints[0][dir]
          : destination[dir];
      default:
        return destination[dir];
    }
  };

  const openNavigation = (url: string, params: string = '') => {
    Linking.openURL(
      `${url}${switchCaseSearchNative(
        tripAccepted?.status,
        tripAccepted.origin,
        tripAccepted.destination,
        waypoints,
        'latitude',
      )},${switchCaseSearchNative(
        tripAccepted?.status,
        tripAccepted.origin,
        tripAccepted.destination,
        waypoints,
        'longitude',
      )}${params}`,
    );
    setModalNavigation(false);
  };

  const getLastNavigation = async () => {
    setLoading(true);
    const lastNavigation = await AsyncStorage.getItem('lastGps');
    if (lastNavigation && lastNavigation === 'waze') {
      openNavigation('https://waze.com/ul?ll=', '&navigate=yes');
    } else if (lastNavigation && lastNavigation === 'google') {
      openNavigation('https://www.google.com/maps/dir/?api=1&destination=');
    }
    setLoading(false);
  };

  useEffect(() => {
    if (modalNavigation) {
      getLastNavigation();
    }
  }, [modalNavigation]);

  return (
    <ModalFrame
      visible={modalNavigation && !loading}
      setVisible={setModalNavigation}
      hideConfirm
      onClose={() => {
        setModalNavigation(false);
      }}
    >
      <CardButtonText
        text={'Waze'}
        onPress={async () => {
          openNavigation('https://waze.com/ul?ll=', '&navigate=yes');
          await AsyncStorage.setItem('lastGps', 'waze');
          setModalNavigation(false);
        }}
      />
      <CardButtonText
        text={'Google Maps'}
        onPress={async () => {
          openNavigation('https://www.google.com/maps/dir/?api=1&destination=');
          await AsyncStorage.setItem('lastGps', 'google');
          setModalNavigation(false);
        }}
      />
    </ModalFrame>
  );
};

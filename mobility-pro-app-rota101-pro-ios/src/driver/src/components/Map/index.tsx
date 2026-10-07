import React, {memo, useEffect, useState} from 'react';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import {useTripProvider} from '../../context/Trip';
import {mapAubergine} from '../../styles/mapNight';
import {useAuth} from '../../../../context/auth';
import {mapLight} from '../../styles/mapLight';
import {Dimensions, Platform} from 'react-native';
import {useIsFocused} from '@react-navigation/native';

const {width, height} = Dimensions.get('screen');

interface Props {
  mapRef: (ref: MapView) => void;
  setCountVisible: (value: boolean) => void;
  onTouchMove?: () => void;
  onTouchEnd?: () => void;
  onMapLoaded?: () => void;
  noDriver?: boolean;
  children?: React.ReactNode;
  latitude: number;
  longitude: number;
  setCenterInBottom?: boolean;
  mapType?:
    | 'standard'
    | 'satellite'
    | 'hybrid'
    | 'terrain'
    | 'none'
    | 'mutedStandard';
  distanceMapBottom?: number;
}

export const Map = ({
  mapRef,
  setCountVisible,
  distanceMapBottom,
  onTouchMove,
  onTouchEnd,
  onMapLoaded,
  noDriver,
  children,
  latitude,
  longitude,
  mapType,
  setCenterInBottom,
}: Props) => {
  const {stateTrip} = useTripProvider();
  const {generalSettings} = useAuth();
  const {tripAccepted} = stateTrip;

  const [itsDay, setItsDay] = useState(false);

  const getHourToDayOrNight = () => {
    const date = new Date();
    const hour = date.getHours();
    const hourNow = hour > 6 && hour < 18 ? true : false;
    const conditionalSettings =
      generalSettings?.find(item => item?.key === 'enable_map_dark_driver')
        ?.value === '1'
        ? hourNow
        : true;
    return conditionalSettings;
  };

  useEffect(() => {
    setItsDay(getHourToDayOrNight());
  }, []);

  const isFocused = useIsFocused();

  return (
    <>
      <MapView
        ref={mapRef}
        style={
          setCenterInBottom
            ? {
                width,
                height: height + distanceMapBottom,
              }
            : {flex: 1}
        }
        onPress={() => setCountVisible(false)}
        onMapLoaded={() => onMapLoaded && onMapLoaded}
        onTouchMove={() => onTouchMove && onTouchMove()}
        onTouchEnd={() => onTouchEnd && onTouchEnd()}
        showsUserLocation={!!noDriver}
        showsCompass={false}
        showsMyLocationButton={false}
        zoomEnabled
        initialCamera={{
          center: {
            latitude: latitude,
            longitude: longitude,
          },
          heading: 0,
          zoom: 18,
          pitch: 0,
          altitude: 0,
        }}
        showsBuildings={false}
        mapType={'standard'}
        rotateEnabled={
          tripAccepted && Object.keys(tripAccepted)?.length > 0 ? true : false
        }
        // customMapStyle={itsDay ? mapLight : mapAubergine}
      >
        {/* AGUARDAR SERVIÇO DO SOCKET PRA DESCOMENTAR {polyline !== null && <Polyline coordinates={polyline} />} */}
        {children}
      </MapView>
    </>
  );
};

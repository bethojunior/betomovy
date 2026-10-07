import AsyncStorage from '@react-native-async-storage/async-storage';
import MapService from '../../../../client/services/mapService';

export const setRouteTraveled = async location => {
  const routeTraveled = await AsyncStorage.getItem('routeTraveledTaximeter');

  if (routeTraveled === null) {
    const initialRoute = [
      {
        latitude: location?.latitude,
        longitude: location?.longitude,
      },
    ];

    await AsyncStorage.setItem(
      'routeTraveledTaximeter',
      String(MapService.encondePolyline(initialRoute)),
    );

    // kmRef.current = 0;
  } else {
    const routeDecoded = MapService.decodePolyline(routeTraveled);

    (routeDecoded as {}[]).push({
      latitude: location?.latitude,
      longitude: location?.longitude,
    });

    await AsyncStorage.setItem(
      'routeTraveledTaximeter',
      String(MapService.encondePolyline(routeDecoded)),
    );
    // await getKmRouteTraveled(); // @TODO - TESTAR SE
  }

  return '';
};

export const setTimeTraveled = async () => {
  const paused = await AsyncStorage.getItem('taximeterIsPause');
  const timeOut = await AsyncStorage.getItem('TX-timeBg');

  if ((paused == 'false' && !timeOut) || (!paused && !timeOut)) {
    AsyncStorage.setItem('TX-timeBg', JSON.stringify(new Date()));
  }
};

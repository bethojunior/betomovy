import MapService from '../../../../client/services/mapService';
import { storage } from '~/common/services/mmkv/storage';

export const setRouteTraveled = location => {
  const routeTraveled = storage.getItem('routeTraveledTaximeter', 'string');

  if (routeTraveled === null) {
    const initialRoute = [
      {
        latitude: location?.latitude,
        longitude: location?.longitude,
      },
    ];

    storage.setItem(
      'routeTraveledTaximeter',
      String(MapService.encondePolyline(initialRoute)),
    );
  } else {
    const routeDecoded = MapService.decodePolyline(routeTraveled);

    (routeDecoded as {}[]).push({
      latitude: location?.latitude,
      longitude: location?.longitude,
    });

    storage.setItem(
      'routeTraveledTaximeter',
      MapService.encondePolyline(routeDecoded),
    );
  }

  return '';
};

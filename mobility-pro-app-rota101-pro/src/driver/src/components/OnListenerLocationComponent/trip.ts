import MapService from '../../../../client/services/mapService';
import {useStorage} from '../../../../utils/Storage';

export const setRouteTraveledRecalcule = async ({latitude, longitude}) => {
  const {setItem, getItem} = useStorage();
  let routeTraveled = (await getItem('routeTraveled', false)) || [];

  if (routeTraveled.length > 0) {
    routeTraveled = MapService.decodePolyline(routeTraveled);
  }

  routeTraveled.push([latitude, longitude]);

  routeTraveled = MapService.encondePolyline(routeTraveled);

  setItem('routeTraveled', routeTraveled, false);
};

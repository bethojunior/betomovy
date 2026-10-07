import apiMainDriver from '../../api/apiMain';
import { TIMEOUT_LONG, TIMEOUT_SHORT } from '~/common/constants/timeouts';

export const serviceTaximeter = {
  findByTripType: async ({ lat, lng }, tripTypeId) => {
    try {
      const { data } = await apiMainDriver.get(
        `Price/FindByTripType?tripTypeId=${tripTypeId}&lat=${lat}&lng=${lng}`,
        { timeout: TIMEOUT_SHORT },
      );

      return data;
    } catch (error) {
      console.log(error);
    }
  },
  startTrip: async (
    tripTypeId: string,
    latitude: number,
    longitude: number,
    priceId: string = '761',
    multiplierDynamic?: string,
  ) => {
    try {
      const { data } = await apiMainDriver.post(
        'taximeterTrip/start',
        {
          latitude,
          longitude,
          priceId,
          tripTypeId,
          multiplierDynamic,
        },
        { timeout: TIMEOUT_LONG },
      );

      return data;
    } catch (error) {
      console.log(error);
    }
  },
  stopTrip: async (
    distance: number,
    estimatedTripTime: string,
    price: number,
    tripReference: string,
  ) => {
    try {
      const { data } = await apiMainDriver.post(
        'TaximeterTrip/update',
        {
          distance,
          estimatedTripTime,
          price,
          tripReference,
        },
        { timeout: TIMEOUT_LONG },
      );

      return data;
    } catch (error) {
      console.log(error);
    }
  },
  updateDistanceAndEstimatedTime: async (
    tripReference: string,
    distance: number,
    estimatedTripTime: number,
    price: number,
  ) => {
    try {
      const { data } = await apiMainDriver.post(
        'TaximeterTrip/finalize',
        { tripReference, distance, estimatedTripTime, price },
        { timeout: TIMEOUT_LONG },
      );

      return data;
    } catch (error) {
      console.log(error);
    }
  },
};

import apiMainDriver from '../../api/apiMain';

export const serviceTaximeter = {
  findByTripType: async ({lat, lng}, tripTypeId) => {
    try {
      const {data} = await apiMainDriver.get(
        `Price/FindByTripType?tripTypeId=${tripTypeId}&lat=${lat}&lng=${lng}`,
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
      const {data} = await apiMainDriver.post('taximeterTrip/start', {
        latitude,
        longitude,
        priceId,
        tripTypeId,
        multiplierDynamic,
      });

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
      const {data} = await apiMainDriver.post('TaximeterTrip/update', {
        distance,
        estimatedTripTime,
        price,
        tripReference,
      });

      return data;
    } catch (error) {
      console.log(error);
    }
  },
};

import apiMainDriver from '../../api/apiMain';

export const TravelService = {
  getTravels: async (
    idDriver: number,
    status = null,
    page: number = 1,
    date = null,
  ) => {
    const payload = {
      stdObject: [
        {
          driverId: idDriver.toString(),
          status: status,
          page: page,
          date: date,
        },
      ],
    };
    const {data} = await apiMainDriver.post('Driver/GetTrips', payload);

    return data;
  },
  getTrip: async (tripReference: string) => {
    const payload = {
      stdObject: {
        tripReference: tripReference,
      },
    };
    const {data} = await apiMainDriver.post('Trip/Get', payload);

    return data;
  },
  reportTrip: async (tripReference: string, message: string) => {
    console.log(tripReference, message);
    const {data} = await apiMainDriver.post('Trip/Report', {
      message: message,
      tripReference: tripReference,
    });
    return data;
  },
};

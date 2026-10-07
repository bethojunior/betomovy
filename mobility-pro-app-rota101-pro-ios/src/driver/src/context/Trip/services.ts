import apiMainDriver from '../../api/apiMain';

export const tripService = {
  cancelTrip: async (cancellationReasonsId, driverId, tripReference) => {
    const payload = {
      stdObject: [
        {
          cancellationReasonsId,
          driverId,
          tripReference,
        },
      ],
    };
    try {
      const response = await apiMainDriver.post('Driver/CancelTrip', payload);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  },
  acceptScheduledTrip: async (driverId, tripReference) => {
    try {
      const response = await apiMainDriver.post('Driver/AcceptScheduled', {
        driverId,
        tripReference,
      });
      return response.data;
    } catch (error) {
      console.log(error);
    }
  },
};

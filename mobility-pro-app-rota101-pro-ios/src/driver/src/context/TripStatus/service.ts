import apiMainDriver from '../../api/apiMain';

export const TripStatusService = () => {

  const getTripsActives = async (driverId: string) => {
    try {
      const {data} = await apiMainDriver.post('Driver/GetTripsActives', {
        stdObject: [
          {
            driverId,
          },
        ],
      });
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const arrival = async (tripReference: string) => {
    const response = await apiMainDriver.post('Driver/InformArrival', {
      stdObject: [
        {
          tripReference,
        },
      ],
    });

    return response;
  };

  const init = async (tripReference: string) => {
    const response = await apiMainDriver.post('Driver/InitTrip', {
      stdObject: [
        {
          tripReference,
        },
      ],
    });

    return response;
  };

  const confirmWaypoint = async (idWayPoint: number) => {
    const response = await apiMainDriver.post('Driver/ConfirmWaypoint', {
      idWayPoint,
    });

    return response;
  };

  const finish = async (tripReference: string) => {
    const response = await apiMainDriver.post('Driver/FinishTrip', {
      stdObject: [
        {
          tripReference,
        },
      ],
    });

    return response;
  };

  const putPreAvailable = async () => {
    const {data} = await apiMainDriver.post('Driver/PutPreAvailable', {
      stdObject: [{}],
    });

    return data;
  };

  const finishWithRecalc = async ({
    tripReference,
    oldPrice,
    newPrice,
    newDistance,
    newTripTime,
  }) => {
    const response = await apiMainDriver.post('Trip/RecalculatePrice', {
      tripReference,
      oldPrice,
      newPrice,
      newDistance,
      newTripTime,
    });

    return response;
  };
  return {
    arrival,
    getTripsActives,
    init,
    confirmWaypoint,
    finish,
    finishWithRecalc,
    putPreAvailable,
  };
};

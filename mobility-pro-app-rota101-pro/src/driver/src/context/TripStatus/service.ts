import apiMainDriver from '../../api/apiMain';
import { TIMEOUT_LONG } from '~/common/constants/timeouts';

export const TripStatusService = () => {
  const arrival = async (tripReference: string) => {
    const response = await apiMainDriver.post(
      'Driver/InformArrival',
      {
        stdObject: [
          {
            tripReference,
          },
        ],
      },
      { timeout: TIMEOUT_LONG },
    );

    return response;
  };

  const init = async (tripReference: string) => {
    const response = await apiMainDriver.post(
      'Driver/InitTrip',
      {
        stdObject: [
          {
            tripReference,
          },
        ],
      },
      { timeout: TIMEOUT_LONG },
    );

    return response;
  };

  const waiting = async (tripReference: string) => {
    const response = await apiMainDriver.post(
      'Driver/PutTripInWaiting',
      {
        stdObject: [
          {
            tripReference,
          },
        ],
      },
      { timeout: TIMEOUT_LONG },
    );

    return response;
  };

  const finishWaiting = async (tripReference: string) => {
    const response = await apiMainDriver.post(
      'Driver/FinishWaitingTime',
      {
        stdObject: [
          {
            tripReference,
          },
        ],
      },
      { timeout: TIMEOUT_LONG },
    );

    return response;
  };

  const confirmWaypoint = async (idWayPoint: number) => {
    const response = await apiMainDriver.post(
      'Driver/ConfirmWaypoint',
      {
        idWayPoint,
      },
      { timeout: TIMEOUT_LONG },
    );

    return response;
  };

  const finish = async (tripReference: string) => {
    const response = await apiMainDriver.post(
      'Driver/FinishTrip',
      {
        stdObject: [
          {
            tripReference,
          },
        ],
      },
      { timeout: TIMEOUT_LONG },
    );

    return response;
  };

  const putPreAvailable = async () => {
    const { data } = await apiMainDriver.post(
      'Driver/PutPreAvailable',
      {},
      { timeout: TIMEOUT_LONG },
    );
    return data;
  };

  const finishWithRecalc = async ({
    tripReference,
    oldPrice,
    newPrice,
    newDistance,
    newTripTime,
    tolls = [],
    completeTripAfterRecalc = false,
  }) => {
    const response = await apiMainDriver.post(
      'Trip/RecalculatePrice',
      {
        tripReference,
        oldPrice,
        newPrice,
        newDistance,
        newTripTime,
        tolls,
        completeTripAfterRecalc,
      },
      { timeout: TIMEOUT_LONG },
    );

    return response;
  };

  const getWaitingTimeFees = async ({ cityId, tripTypeId }) => {
    const response = await apiMainDriver.post(
      'price/getWaitingTimeFees',
      {
        cityId,
        tripTypeId,
      },
      { timeout: TIMEOUT_LONG },
    );

    return response;
  };

  const saveWaitingTime = async (payload) => {
    const response = await apiMainDriver.post('driver/saveTimeWaiting', payload, {
      timeout: TIMEOUT_LONG,
    });

    return response;
  };

  return {
    arrival,
    init,
    confirmWaypoint,
    finish,
    finishWithRecalc,
    putPreAvailable,
    waiting,
    finishWaiting,
    getWaitingTimeFees,
    saveWaitingTime,
  };
};

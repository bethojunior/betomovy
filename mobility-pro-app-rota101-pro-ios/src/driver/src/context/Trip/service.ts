import Logger from '~/utils/Logger';
import {translate} from '../../../../client/locales';
import {ApiResponse, ApiResponsePaginated} from '../../../../interfaces/api';
import {DriverTripSummary} from '../../../../interfaces/driverTripSummary';
import {Trip} from '../../../../interfaces/trip';
import {customToast} from '../../../../utils/FlashMessage';
import apiMainDriver from '../../api/apiMain';

const logger = new Logger('TripService');

const RATE_TIMEOUT_MS = 15000;

export const TripService = () => {
  const accept = async (
    driverId: string,
    tripReference: string,
    estimatedTimeDriverArrival: number,
    distanceDriverArrival: number,
  ) => {
    const response = await apiMainDriver.post('Driver/AcceptTrip', {
      stdObject: [
        {
          driverId,
          tripReference,
          estimatedTimeDriverArrival,
          distanceDriverArrival,
        },
      ],
    });

    if (!response.data.status) {
      return { status: false, message: response.data.message || '' };
    }

    return response.data;
  };

  const sendMessage = async (
    userId: number,
    tripReference: string,
    chatBotTripTypeId: number,
  ) => {
    return apiMainDriver.post('ChatBotTrip/SendMessage', {
      userId,
      tripReference,
      chatBotTripTypeId,
    });
  };

  const getReasonsCancel = async () => {
    const response = await apiMainDriver.post('CancellationReasons/GetAll', {
      stdObject: [{}],
    });

    return response;
  };

  const search = async (
    driverId: number,
    listTripsDenied: any,
    location: {latitude: number; longitude: number},
    userId: number,
  ) => {
    const response = await apiMainDriver.post('Driver/searchTrip', {
      stdObject: [
        {
          driverId,
          listTripsDenied,
          location,
          userId,
        },
      ],
    });

    const body = response?.data;
    if (!body || body.status === false) {
      return null;
    }

    const payload = body.data;
    if (Array.isArray(payload)) {
      return payload[0] ?? null;
    }

    return payload ?? null;
  };

  const get = async (tripReference: string) => {
    const response = await apiMainDriver.post('Trip/Get', {
      stdObject: [
        {
          tripReference,
        },
      ],
    });

    if (!response.status) {
      return customToast(response.data.message, 'danger');
    }

    return response.data.data;
  };

  const refuse = async (driverId: number, tripReference: string) => {
    const response = await apiMainDriver.post('driver/refuseTrip', {
      stdObject: [
        {
          driverId,
          tripReference,
        },
      ],
    });

    if (!response.data.status) {
      return customToast(response.data.message, 'danger');
    }

    return true;
  };

  const cancell = async (cancelTrip: any) => {
    const response = await apiMainDriver.post('Driver/CancelTrip', {
      stdObject: [cancelTrip],
    });

    return response.data.status;
  };

  const rate = async (rating: number, tripReference: string) => {
    try {
      const response = await apiMainDriver.post<ApiResponse<any>>(
        'TripRating/Rate',
        { rating, tripReference },
        { timeout: RATE_TIMEOUT_MS },
      );

      return response.data;
    } catch (e) {
      logger.log("rate", (e as any)?.response?.data);
      throw e;
    }
  };

  const addBlackList = async (addresses: any) => {
    try {
      const response = await apiMainDriver.post('AddressBlacklist/Insert', {
        addresses,
      });

      if (!response.data.status) {
        return customToast(
          translate('finishTrip.text_error_blacklist'),
          'danger',
        );
      }

      return response;
    } catch (e) {
      logger.log("addBlackList", e?.response?.data);
    }
  };

  const addRiskArea = async (address: {}) => {
    try {
      await apiMainDriver.post('riskArea/store', address);
    } catch (e) {
      logger.log("addRiskArea", e?.response?.data);
    }
  };

  const getPaymentInVehicle = async () => {
    try {
      const {data} = await apiMainDriver.post(
          'TripPaymentForm/GetAll?paymentInVehicle=1',
        {
          stdObject: [{}],
        },
      );

      return data;
    } catch (error) {
      logger.log("getPaymentInVehicle", error);
    }
  };

  const getTripTypes = async (lat, lng) => {
    try {
      const {data} = await apiMainDriver.get(
        `TripType/FindByLocale?latlng=${lat},${lng}`,
      );

      return data;
    } catch (error) {
      logger.log("getTripTypes", error);
    }
  };

  const cancelTrip = async (cancellationReasonsId, driverId, tripReference) => {
    try {
      const response = await apiMainDriver.post('Driver/CancelTrip', {
        stdObject: [
          {
            cancellationReasonsId,
            driverId,
            tripReference,
          },
        ],
      });
      return response.data;
    } catch (error) {
      logger.log("cancelTrip", error);
    }
  };

  const acceptScheduledTrip = async (driverId, tripReference) => {
    try {
      const response = await apiMainDriver.post('Driver/AcceptScheduled', {
        driverId,
        tripReference,
      });
      return response.data;
    } catch (error) {
      logger.log("acceptScheduledTrip", error);
    }
  };

  const acceptTripOffer = async (driverId: string, tripReference: string) => {
    try {
      const response = await apiMainDriver.post('tripbid/acceptOfferByDriver', {
        driverId,
        tripReference,
      });

      return response.data;
    } catch (error) {
      logger.log("acceptTripOffer", error);
    }
  };

  const createTripOffer = async (driverId: string, tripId: string, price) => {
    try {
      const response = await apiMainDriver.post('tripbid/create', {
        driverId,
        tripId,
        price: Number(price)?.toFixed(2),
      });

      return response.data;
    } catch (error) {
      logger.log("createTripOffer", error);
    }
  };

  const getTripsAvailable = async (page: number, params?: {}) => {
    try {
      const response = await apiMainDriver.post<
        ApiResponsePaginated<Trip, 'trips'>
      >('Driver/TripsAvailable', {stdObject: [{...params, page}]});
      return response.data;
    } catch (error) {
      logger.log("getTripsAvailable", error);
    }
  };

  const getTripsAccepted = async (page: number, params?: {}) => {
    try {
      const response = await apiMainDriver.post<
        ApiResponsePaginated<Trip, 'trips'>
      >('Driver/TripsAccepted', {stdObject: [{...params, page}]});
      return response.data;
    } catch (error) {
      logger.log("getTripsAccepted", error);
    }
  };

  const getTripsSummary = async (params?: {}) => {
    try {
      const response = await apiMainDriver.post<ApiResponse<DriverTripSummary>>(
        'Driver/TripsSummary',
        {stdObject: [params]},
      );
      return response.data;
    } catch (error) {
      logger.log("getTripsSummary", error);
    }
  };

  return {
    accept,
    sendMessage,
    search,
    get,
    refuse,
    cancell,
    rate,
    addBlackList,
    addRiskArea,
    getReasonsCancel,
    getPaymentInVehicle,
    getTripTypes,
    cancelTrip,
    acceptScheduledTrip,
    acceptTripOffer,
    createTripOffer,
    getTripsAvailable,
    getTripsAccepted,
    getTripsSummary,
  };
};

import axios from 'axios';
import {translate} from '../../../../client/locales';
import {customToast} from '../../../../utils/FlashMessage';
import apiMainDriver from '../../api/apiMain';
import Helper from '../../utils/Helper';
import {AppState} from 'react-native';

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
      return response.data.message;
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
    if (AppState.currentState !== 'active') {
      return;
    }
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

    if (!response.status) {
      return response.data.message;
    }

    return response.data.data[0];
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
    const response = await apiMainDriver.post('driver/cancelTrip', {
      stdObject: [cancelTrip],
    });

    return response.data.status;
  };

  const rate = async (rating: number, tripReference: string) => {
    try {
      const response = await apiMainDriver.post('TripRating/Rate', {
        rating,
        tripReference,
      });

      return response;
    } catch (e) {
      console.log(e.response.data);
      return {
        status: true,
      };
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
      console.log(e?.response?.data);
    }
  };

  const addRiskArea = async (address: {}) => {
    try {
        apiMainDriver.post('riskArea/store', address);
    } catch (e) {
      console.log(e?.response?.data);
    }
  }

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
      console.log(error);
    }
  };

  const getTripTypes = async (lat, lng) => {
    try {
      const {data} = await apiMainDriver.get(
        `TripType/FindByLocale?latlng=${lat},${lng}`,
      );

      return data;
    } catch (error) {
      console.log(error);
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
      console.log(error);
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
      console.log(error);
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
      console.log(error);
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
      console.log(error);
    }
  };

  const sendPosition = async data => {
    const objectLocation = {
      stdObject: [
        {
          latitude: data?.latitude,
          longitude: data?.longitude,
          deviceModel: 'fabrica-socket',
          deviceId: '704',
          created_at: Helper.getNow(),
          driverId: parseInt(data?.idDriver),
          tripReference: data?.tripReference || null,
        },
      ],
    };

    try {
      const response = await apiMainDriver.post(
        'Location/Insert',
        objectLocation,
      );

      return response.data;
    } catch (error) {
      if (error) {
        console.log('Request canceled', error.message);
      } else {
        console.log(error);
      }
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
    sendPosition,
  };
};

import {translate} from '../../../../client/locales';
import {customToast} from '../../../../utils/FlashMessage';
import apiMainDriver from '../../api/apiMain';

export const routeService = () => {
  const newRoutes = async (lat: number, lng: number) => {
    try {
      const result = await apiMainDriver(`Route/Get?lat=${lat}&lng=${lng}`);
      return result.data;
    } catch (error) {
      return customToast(translate('pageRoutes.text_error_load'), 'danger');
    }
  };

  const released = async () => {
    try {
      const result = await apiMainDriver('RouteDriverAccepted/Get');
      return result.data;
    } catch (error) {
      return customToast(translate('pageRoutes.text_error_load'), 'danger');
    }
  };

  const offered = async () => {
    try {
      const result = await apiMainDriver('DriverRide/Offered');
      return result.data;
    } catch (error) {
      return customToast(translate('pageRoutes.text_error_load'), 'danger');
    }
  };

  const request = async (routeId: number) => {
    try {
      const result = await apiMainDriver.post('Route/Use', {routeId});
      return result.data;
    } catch (error) {
      return customToast(translate('pageRoutes.text_error_request'), 'danger');
    }
  };

  const offer = async (
    routeId: number,
    schedule: string,
    tripItems: [number],
    seatsAvailable: number,
  ) => {
    try {
      const result = await apiMainDriver.post('Ride/New', {
        routeId,
        schedule,
        tripItems,
        seatsAvailable,
      });
      return result.data;
    } catch (error) {
      return customToast(translate('pageRoutes.text_error_offer'), 'danger');
    }
  };

  const cancel = async (tripReference: string, cancellationReasonsId = 4) => {
    try {
      const result = await apiMainDriver.post('Ride/cancel', {
        tripReference,
        cancellationReasonsId,
      });
      return result.data;
    } catch (error) {
      return customToast(translate('pageRoutes.text_error_cancel'), 'danger');
    }
  };
  return {newRoutes, released, offered, request, offer, cancel};
};

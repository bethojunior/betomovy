import {createContext, useContext, useMemo, useState} from 'react';
import {translate} from '../../../../client/locales';
import {customToast} from '../../../../utils/FlashMessage';
import {routeService} from './services';
import {RoutesProps} from './types';

const RoutesContext = createContext({} as RoutesProps);

export const RoutesProvider = ({children}: any) => {
  const [listRoutes, setListRoutes] = useState([]);

  const service = routeService();

  const getNew = async (lat: number, lng: number) => {
    const result = await service.newRoutes(lat, lng);

    if (!result.status) {
      return customToast(translate('pageRoutes.text_error_load'), 'danger');
    }

    return setListRoutes(result.data);
  };

  const getReleased = async () => {
    const result = await service.released();

    if (!result.status) {
      return customToast(translate('pageRoutes.text_error_load'), 'danger');
    }

    return setListRoutes(result.data);
  };

  const getOffered = async () => {
    const result = await service.offered();

    if (!result.status) {
      return customToast(translate('pageRoutes.text_error_load'), 'danger');
    }

    return setListRoutes(result.data);
  };

  const requestRoute = async (routeId: number) => {
    const result = await service.request(routeId);

    if (!result.status) {
      return customToast(translate('pageRoutes.text_error_request'), 'danger');
    }

    return customToast(translate('pageRoutes.text_success_request'), 'success');
  };

  const offerRoute = async (
    routeId: number,
    schedule: string,
    tripItems: [number],
    seatsAvailable: number,
  ) => {
    const result = await service.offer(
      routeId,
      schedule,
      tripItems,
      seatsAvailable,
    );

    if (!result.status) {
      customToast(translate('pageRoutes.text_error_offer'), 'danger');
      return false;
    }

    customToast(translate('pageRoutes.text_success_offer'), 'success');
    return true;
  };

  const cancelOffer = async (tripReference: string) => {
    const result = await service.cancel(tripReference);

    if (!result.status) {
      customToast(translate('pageRoutes.text_error_cancel'), 'danger');
      return false;
    }

    customToast(translate('pageRoutes.text_success_cancel'), 'success');
    return true;
  };

  const value = useMemo(() => {
    return {
      getNew,
      getReleased,
      getOffered,
      listRoutes,
      requestRoute,
      offerRoute,
      cancelOffer,
    };
  }, [
    getNew,
    getReleased,
    getOffered,
    listRoutes,
    requestRoute,
    offerRoute,
    cancelOffer,
  ]);
  return (
    <RoutesContext.Provider value={value}>{children}</RoutesContext.Provider>
  );
};
export const useRoutes = () => {
  const context = useContext(RoutesContext);
  return context;
};

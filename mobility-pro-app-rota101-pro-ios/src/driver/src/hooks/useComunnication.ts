import {useCallback} from 'react';
import {appProccess, buildApp} from '../../../constantBuild/config';
import Helper from '../utils/Helper';
import {BubbleModulesLocation} from '../pages/Home/service';
import {STATUS_ACCEPTED} from '../constants/trip';

export const useCommunication = (cityConfig, userDriver, onListener) => {
  const {addListenerLocation, startLocation, stopLocation} =
    BubbleModulesLocation;

  const getUrlSocket = useCallback(() => {
    let url = buildApp().HOST_API_APP.replace('https', 'http');
    if (appProccess === 'aws') {
      url = buildApp().HOST_SOCKET;
    }
    url = url.substring(0, url.length - 1);

    return url;
  }, [cityConfig]);

  const getHTTPSend = useCallback(
    (trip, userDriverFind, states = null) => {
      const url = getUrlSocket();

      const seccondOffline = states?.offlineSend || 1800;

      const seccondOnline = states?.onlineSend || 30;

      const metersOffline = states?.metersOffline || 50;

      const metersOnline = states?.metersOffline || 50;

      const stateInterval = {
        offline: 1000 * seccondOffline,
        online: 1000 * seccondOnline,
      };

      const statusTripMeters = {
        accepted: states?.sendMetersAccept,
        boarding: states?.sendMetersBoarding,
        default: stateInterval?.offline,
      };

      const statusTripSecconds = {
        accepted: states?.sendSeccondsAccept * 1000,
        boarding: states?.sendSeccondsBoarding * 1000,
        default: stateInterval?.online,
      };

      const state = {
        url: `${url}${cityConfig?.configDriverLocation.port_url || ''}${
          cityConfig?.configDriverLocation.path_url || ''
        }`,
        data: JSON.stringify({
          api_token: userDriver?.api_token,
          deviceModel: 'fabrica',
          deviceId: '704',
          created_at: Helper.getNow(),
          driverId: userDriver?.idDriver,
          tripReference: trip?.tripReference || null,
        }),
        interval:
          userDriverFind?.status === 'desligado'
            ? stateInterval?.offline
            : stateInterval?.online,
        fastestInterval:
          userDriverFind?.status === 'desligado'
            ? stateInterval?.offline
            : stateInterval?.online,
        meters:
          userDriverFind?.status === 'desligado' ? metersOffline : metersOnline,
        useHaversine: states?.onlineSend === 5 ? false : true,
      };

      return state;
    },
    [getUrlSocket, userDriver],
  );

  const initFunction = async (trip, userDriverFind, states = null) => {
    try {
      const objetcHttp = getHTTPSend(trip, userDriverFind, states);
      await startLocation(
        objetcHttp.url,
        objetcHttp.data,
        objetcHttp.interval,
        objetcHttp.fastestInterval,
        objetcHttp.meters,
        objetcHttp.useHaversine,
      );

      setTimeout(() => {
        onListener();
      }, 1000);
    } catch (error) {
      console.log(error);
    }
  };

  return {getUrlSocket, getHTTPSend, initFunction};
};

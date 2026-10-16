import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from 'react';
import theme from '../../styles/theme';
import {ContextPropsConfigLocal, InitialStateProps} from './types';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ConfigLocalContext = createContext({} as ContextPropsConfigLocal);

// export const ConfigLocalProvider = ({children}: any) => {
//   const initialState = {
//     visibleConfigHidden: false,
//     zoomMap: 13,
//     zoomMapInTrip: 18,
//     strokePolylineWidth: 12,
//     strokePolylineColor: theme.colors.black,
//     cityConfigDriverMeters: 300,
//     locationDriverMetersRoute: 30,
//     angleDriverMap: 0,
//     angleDriverMapRoute: 70,
//     locationDriverTimeRoute: 1000,
//     meters: 15,
//     markerSize: 25,
//     durationCam: 2,
//     distanceInScreen: 0,
//     payloadInScreen: 0,
//     secondsToRedirect: 2,
//     showConfigMap: 0,
//     offlineSend: 1800,
//     onlineSend: 20,
//     metersOffline: 50,
//     metersOnline: 50,
//     sendMetersAccept: 15,
//     sendMetersBoarding: 30,
//     sendSeccondsAccept: 15,
//     sendSeccondsBoarding: 30,
//     metersToCut: 7,
//     cachePolylineOn: 1,
//   } as InitialStateProps;

//   const [states, setStates] = useReducer(
//     (state: InitialStateProps, newState: InitialStateProps) => {
//       return {...state, ...newState};
//     },
//     initialState,
//   );

//   const verifyConfigLocal = useCallback(async () => {
//     const configLocal = await AsyncStorage.getItem('configLocal');
//     // example configLocal = '{"visibleConfigHidden":false,"zoomMap":15,"zoomMapInTrip":19,"strokePolylineWidth":6,"strokePolylineColor":"#000000","cityConfigDriverMeters":300,"locationDriverMetersRoute":30,"locationDriverTimeRoute":1000}'
//     if (configLocal) {
//       setStates({
//         ...states,
//         ...JSON.parse(configLocal),
//       });
//     }
//   }, [setStates]);

//   useEffect(() => {
//     verifyConfigLocal();
//   }, []);

//   const value = useMemo(() => {
//     return {
//       states,
//       setStates,
//     };
//   }, [states, setStates]);

//   return (
//     <ConfigLocalContext.Provider value={value}>
//       {children}
//     </ConfigLocalContext.Provider>
//   );
// };
// export const useConfigLocal = () => {
//   const context = useContext(ConfigLocalContext);
//   return context;
// };

export const useConfigLocal = () => {
  const initialState = {
    visibleConfigHidden: false,
    zoomMap: 13,
    zoomMapInTrip: 18,
    strokePolylineWidth: 12,
    strokePolylineColor: theme.colors.black,
    cityConfigDriverMeters: 300,
    locationDriverMetersRoute: 30,
    angleDriverMap: 0,
    angleDriverMapRoute: 70,
    locationDriverTimeRoute: 1000,
    meters: 15,
    markerSize: 25,
    durationCam: 2,
    distanceInScreen: 0,
    payloadInScreen: 0,
    secondsToRedirect: 2,
    showConfigMap: 0,
    offlineSend: 1800,
    onlineSend: 20,
    metersOffline: 50,
    metersOnline: 50,
    sendMetersAccept: 15,
    sendMetersBoarding: 30,
    sendSeccondsAccept: 15,
    sendSeccondsBoarding: 30,
    cachePolylineOn: 1,
  } as InitialStateProps;

  const [states, setStates] = useReducer(
    (state: InitialStateProps, newState: InitialStateProps) => {
      return {...state, ...newState};
    },
    initialState,
  );

  return {
    states,
    setStates,
  };
};

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {useLocalProvider} from '../local';
import {ZoneDynamicService} from './services';
import {ZoneDynamicContextProps, ZoneDynamicObject} from './types';
import {ChildrenType} from '../../../@types';
import Helper from '../../utils/Helper';
import {format} from 'date-fns';
import { customToast } from '~/utils/FlashMessage';
// const ZoneDynamicContext = createContext({} as ZoneDynamicContextProps);
// export const ZoneDynamicProvider = ({children}: ChildrenType) => {
//   const [zonesDynamic, setZonesDynamic] = useState<ZoneDynamicObject[]>([]);
//   const [loading, setLoading] = useState<boolean>(false);
//   const {location} = useLocalProvider();

//   const getZonesDynamic = useCallback(async () => {
//     setLoading(true);
//     const hourNow = format(new Date(), 'HH:mm:ss');

//     const response = await ZoneDynamicService.getZonesDynamic(
//       hourNow,
//       location?.coords?.latitude,
//       location?.coords?.longitude,
//     );

//     if (!response.status) {
//       Toast.error(response.message);
//       return;
//     }
//     setZonesDynamic(response.data);
//   }, [location, ZoneDynamicService]);

//   useEffect(() => {
//     if (location?.coords?.latitude && zonesDynamic.length === 0 && !loading) {
//       getZonesDynamic();
//     }
//   }, [location]);

//   const value = useMemo(() => {
//     return {
//       zonesDynamic,
//       getZonesDynamic,
//     };
//   }, [zonesDynamic, getZonesDynamic]);

//   return (
//     <ZoneDynamicContext.Provider value={value}>
//       {children}
//     </ZoneDynamicContext.Provider>
//   );
// };
// export const useZoneDynamic = () => {
//   const context = useContext(ZoneDynamicContext);
//   return context;
// };

export const useZoneDynamic = () => {
  const [zonesDynamic, setZonesDynamic] = useState<ZoneDynamicObject[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const {location} = useLocalProvider();

  const getZonesDynamic = async () => {
    setLoading(true);
    const hourNow = format(new Date(), 'HH:mm:ss');

    const response = await ZoneDynamicService.getZonesDynamic(
      hourNow,
      location?.coords?.latitude,
      location?.coords?.longitude,
    );

    if (!response.status) {
      customToast(response.message, 'error');
      return;
    }
    setZonesDynamic(response.data);
  };

  useEffect(() => {
    if (location?.coords?.latitude && zonesDynamic.length === 0 && !loading) {
      getZonesDynamic();
    }
  }, [location]);

  return {
    zonesDynamic,
    getZonesDynamic,
  };
};

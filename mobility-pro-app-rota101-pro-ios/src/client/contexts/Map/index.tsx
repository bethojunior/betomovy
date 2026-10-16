import {
  createContext,
  PropsWithChildren,
  useContext,
  useMemo,
  useState,
} from 'react';
import { mapService } from './services';
import { MapContextProps } from './types';

const MapContext = createContext({} as MapContextProps);
export const MapProvider = ({ children }: PropsWithChildren) => {
  const [drivers, setDrivers] = useState([]);

  const getOnlineDrivers = async (lat: number, lng: number) => {
    const position = {
      latitude: lat,
      longitude: lng,
    };
    try {
      const response = await mapService.getDriversOnlineByPosition(position);
      setDrivers(response?.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  const value = useMemo(() => {
    return {
      drivers,
      setDrivers,
      getOnlineDrivers,
    };
  }, [drivers, setDrivers, getOnlineDrivers]);
  return <MapContext.Provider value={value}>{children}</MapContext.Provider>;
};
export const useMap = () => {
  const context = useContext(MapContext);
  return context;
};

// @ts-nocheck

import {createContext, useContext, useMemo, useState} from 'react';
import {PublicityService} from './services';
import {AppTypeConst} from '../../constants/app';
import {useLocalProvider} from '../local';

interface iPublicityContext {
  getPublicity: any;
  hasPublicity: boolean;
}

const PublicityContext = createContext<iPublicityContext>(
  {} as iPublicityContext,
);

export const PublicityProvider = ({children}: any) => {
  const [hasPublicity, setHasPublicity] = useState(true);
  const {location} = useLocalProvider();

  const getPublicity = async (typeConst: number | null = null) => {
    try {
      const {latitude, longitude} = location?.coords;
      if (!latitude || !longitude) {
        return setHasPublicity(false);
      }

      const {data} = await PublicityService.get(latitude, longitude, typeConst);

      if (!data.status || data.data === null) {
        setHasPublicity(false);
        return null;
      }

      setHasPublicity(true);
      return data.data;
    } catch (error) {
      setHasPublicity(false);
      return null;
    }
  };

  const value = useMemo(
    () => ({
      getPublicity,
      hasPublicity,
    }),
    [getPublicity, hasPublicity],
  );

  return (
    <PublicityContext.Provider value={value}>
      {children}
    </PublicityContext.Provider>
  );
};

export const usePublicity = () => {
  const context = useContext(PublicityContext);
  return context;
};

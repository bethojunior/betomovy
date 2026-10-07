import {createContext, useState, useContext, ReactNode} from 'react';
import apiMain from '../../client/api/apiMain';

interface DriversNearsContextProviderProps {
  children: ReactNode;
}

interface DriversNearsProps {
  proximity: string;
  radius: string;
  latitude: string;
  longitude: string;
  iconMapDriver: string | null;
}

interface DriversNearsContextProps {
  driversNears: DriversNearsProps[];
  setDriversNears: (data: DriversNearsProps[]) => void;
  canGetDriversNear: boolean;
  setCanGetDriversNear: (data: boolean) => void;
  getDriversOnline: (latitude: number, longitude: number) => void;
}

const DriversNearsContext = createContext<DriversNearsContextProps | undefined>(
  undefined,
);

export const DriversNearsContextProvider = ({
  children,
}: DriversNearsContextProviderProps) => {
  const [driversNears, setDriversNears] = useState<DriversNearsProps[]>([]);
  const [canGetDriversNear, setCanGetDriversNear] = useState<boolean>(true);

  const getDriversOnline = async (latitude: number, longitude: number) => {
    try {
      const responseDriversOnline = await apiMain.get(
        `DriverClose/Get?lat=${latitude}&lng=${longitude}`,
      );

      if (responseDriversOnline.status) {
        setDriversNears(responseDriversOnline?.data?.data);
        setCanGetDriversNear(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <DriversNearsContext.Provider
      value={{
        canGetDriversNear,
        driversNears,
        setCanGetDriversNear,
        setDriversNears,
        getDriversOnline,
      }}
    >
      {children}
    </DriversNearsContext.Provider>
  );
};

export const useDriversNears = () => {
  const response = useContext(DriversNearsContext);

  if (response === undefined) {
    throw new Error(
      'useDriversNears needs to be used inside DriversNearsContextProvider',
    );
  }

  return response;
};

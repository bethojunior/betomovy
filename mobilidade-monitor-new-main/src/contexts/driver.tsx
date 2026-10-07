import { createContext, useState, useCallback } from "react";
import { DriverContextValues, DriverProviderProps } from "../@types/context";

const DriverContext = createContext<DriverContextValues>({} as DriverContextValues);

export const DriverProvider = ({ children }: DriverProviderProps) => {
  const [drivers, setDrivers] = useState<DriverRealtime[]>([]);

  const handleSetDrivers = useCallback((drivers: DriverRealtime[]) => {
    setDrivers(drivers);
  }, []);

  const handleUpdateDriver = useCallback((updatedDriver: DriverRealtime) => {
    setDrivers(prevDrivers => {
      const driverIndex = prevDrivers.findIndex(driver => driver.idDriver === updatedDriver.idDriver);

      if (driverIndex === -1) {
        // Driver não existe, adiciona
        return [...prevDrivers, updatedDriver];
      } else {
        const newDrivers = [...prevDrivers];
        newDrivers[driverIndex] = updatedDriver;
        return newDrivers;
      }
    });
  }, []);

  const handleRemoveDriver = useCallback((driverId: string | number) => {
    setDrivers(prevDrivers => 
      prevDrivers.filter(driver => driver.idDriver !== driverId)
    );
  }, []);

  return (
    <DriverContext.Provider
      value={{
        drivers,
        handleSetDrivers,
        handleUpdateDriver,
        handleRemoveDriver,
      }}
    >
      {children}
    </DriverContext.Provider>
  );
};

export default DriverContext;

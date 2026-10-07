import {createContext, useContext, useMemo} from 'react';
import {useUserDriver} from '../userDriver';
import {vehicleService} from './services';
import {VehicleProps} from './types';

interface VehicleContextType {
  pendingVehicle: () => Promise<any>;
  changeCar: (data: VehicleProps) => Promise<any>;
}

const VehicleContext = createContext({} as VehicleContextType);
export const VehicleProvider = ({children}: any) => {
  const {userDriverFind} = useUserDriver();
  const pendingVehicle = async () => {
    try {
      const response = await vehicleService.getPendingVehicles(
        userDriverFind.idDriver,
      );
      return response;
    } catch (err) {
      console.log(err);
      return err;
    }
  };

  const changeCar = async (data: VehicleProps) => {
    try {
      data.driverId = userDriverFind.idDriver;
      const response = await vehicleService.postChangeCar(data);
      return response;
    } catch (err) {
      console.log(err);
      return;
    }
  };

  const value = useMemo(() => {
    return {
      pendingVehicle,
      changeCar,
    };
  }, [pendingVehicle, changeCar]);
  return (
    <VehicleContext.Provider value={value}>{children}</VehicleContext.Provider>
  );
};
export const useVehicle = () => {
  const context = useContext(VehicleContext);
  return context;
};

import {vehicleService} from './services';
import {VehicleProps} from './types';
import {VehicleDocumentAsset} from '../../components/VehicleDocumentUpload/types';
import {storage} from '../../../../common/services/mmkv/storage';

// const VehicleContext = createContext({} as VehicleContextType);
// export const VehicleProvider = ({children}: any) => {
//   const {userDriverFind} = useUserDriver();
//   const pendingVehicle = async () => {
//     try {
//       const response = await vehicleService.getPendingVehicles(
//         userDriverFind.idDriver,
//       );
//       return response;
//     } catch (err) {
//       console.log(err);
//       return err;
//     }
//   };

//   const changeCar = async (data: VehicleProps) => {
//     try {
//       data.driverId = userDriverFind.idDriver;
//       const response = await vehicleService.postChangeCar(data);
//       return response;
//     } catch (err) {
//       console.log(err);
//       return;
//     }
//   };

//   const value = useMemo(() => {
//     return {
//       pendingVehicle,
//       changeCar,
//     };
//   }, [pendingVehicle, changeCar]);
//   return (
//     <VehicleContext.Provider value={value}>{children}</VehicleContext.Provider>
//   );
// };
// export const useVehicle = () => {
//   const context = useContext(VehicleContext);
//   return context;
// };

export const useVehicle = () => {
  const {getItem} = storage;

  const userDriverFind = getItem('userDriverFindLocal', 'json');

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

  const changeCar = async (data: VehicleProps, document: VehicleDocumentAsset) => {
    try {
      data.driverId = userDriverFind.idDriver;
      const response = await vehicleService.postChangeCar(data, document);
      return response;
    } catch (err) {
      console.log(err);
      return;
    }
  };
  return {
    pendingVehicle,
    changeCar,
  };
};

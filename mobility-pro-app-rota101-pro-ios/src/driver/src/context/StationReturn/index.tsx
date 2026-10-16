import {createContext, useCallback, useContext, useMemo, useState} from 'react';
import {useUserDriver} from '../userDriver';
import {stationReturnServices} from './services';
import {PropsProvider, PropsStationReturn} from './types';

// const StationReturnContext = createContext({} as PropsProvider);
// export const StationReturnProvider = ({children}: ChildrenType) => {
//   const [selectedStation, setSelectedStation] = useState(
//     {} as PropsStationReturn,
//   );
//   const [stationsById, setStationsById] = useState<any>([]);
//   const {userDriverFind} = useUserDriver();
//   const [loading, setLoading] = useState(false);

//   const getStationReturn = useCallback(async () => {
//     try {
//       const response = await stationReturnServices.getStationReturn(
//         userDriverFind.idDriver,
//       );
//       return response;
//     } catch (error) {
//       console.log(error);
//     }
//   }, [userDriverFind]);

//   const createStationReturn = useCallback(
//     async (data: PropsStationReturn) => {
//       try {
//         const response = await stationReturnServices.createStationReturn(
//           data,
//           userDriverFind.idDriver,
//         );
//         return response;
//       } catch (error) {
//         console.log(error);
//       }
//     },
//     [userDriverFind],
//   );

//   const updateStationReturn = useCallback(
//     async (data: PropsStationReturn, idStation) => {
//       try {
//         const response = await stationReturnServices.updateStationReturn(
//           data,
//           userDriverFind.idDriver,
//           idStation,
//         );
//         return response;
//       } catch (error) {
//         console.log(error);
//       }
//     },
//     [],
//   );

//   const getStationTypeAll = async () => {
//     try {
//       const response = await stationReturnServices.getAllStationType();

//       return response;
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const getStationReturnById = useCallback(async () => {
//     try {
//       const response = await stationReturnServices.getStationReturn(
//         userDriverFind.idDriver,
//       );
//       setStationsById(response.data);
//       return response;
//     } catch (error) {
//       console.log(error);
//     }
//   }, [userDriverFind.idDriver]);

//   const activeStationReturn = useCallback(
//     async (idStation: string) => {
//       setLoading(true);
//       try {
//         const response = await stationReturnServices.activeStationReturn(
//           idStation,
//           userDriverFind.idDriver,
//         );
//         setLoading(false);
//         return response;
//       } catch (error) {
//         setLoading(false);
//         console.log(error);
//       }
//     },
//     [userDriverFind.idDriver],
//   );

//   const value = useMemo(() => {
//     return {
//       selectedStation,
//       setSelectedStation,
//       updateStationReturn,
//       stationsById,
//       getStationReturn,
//       createStationReturn,
//       getStationTypeAll,
//       getStationReturnById,
//       activeStationReturn,
//       loading,
//     };
//   }, [
//     selectedStation,
//     setSelectedStation,
//     getStationReturn,
//     createStationReturn,
//     getStationTypeAll,
//     getStationReturnById,
//     updateStationReturn,
//     stationsById,
//     activeStationReturn,
//     loading,
//   ]);

//   return (
//     <StationReturnContext.Provider value={value}>
//       {children}
//     </StationReturnContext.Provider>
//   );
// };
// export const useStationReturn = () => {
//   const context = useContext(StationReturnContext);
//   return context;
// };

export const useStationReturn = () => {
  const [selectedStation, setSelectedStation] = useState(
    {} as PropsStationReturn,
  );
  const [stationsById, setStationsById] = useState<any>([]);
  const {userDriverFind} = useUserDriver();
  const [loading, setLoading] = useState(false);

  const getStationReturn = async () => {
    try {
      const response = await stationReturnServices.getStationReturn(
        userDriverFind.idDriver,
      );
      return response;
    } catch (error) {
      console.log(error);
    }
  };

  const createStationReturn = async (data: PropsStationReturn) => {
    try {
      const response = await stationReturnServices.createStationReturn(
        data,
        userDriverFind.idDriver,
      );
      return response;
    } catch (error) {
      console.log(error);
    }
  };

  const updateStationReturn = async (data: PropsStationReturn, idStation) => {
    try {
      const response = await stationReturnServices.updateStationReturn(
        data,
        userDriverFind.idDriver,
        idStation,
      );
      return response;
    } catch (error) {
      console.log(error);
    }
  };

  const getStationTypeAll = async () => {
    try {
      const response = await stationReturnServices.getAllStationType();

      return response;
    } catch (error) {
      console.log(error);
    }
  };

  const getStationReturnById = async () => {
    try {
      const response = await stationReturnServices.getStationReturn(
        userDriverFind.idDriver,
      );
      setStationsById(response.data);
      return response;
    } catch (error) {
      console.log(error);
    }
  };

  const activeStationReturn = async (idStation: string) => {
    setLoading(true);
    try {
      const response = await stationReturnServices.activeStationReturn(
        idStation,
        userDriverFind.idDriver,
      );
      setLoading(false);
      return response;
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  return {
    selectedStation,
    setSelectedStation,
    updateStationReturn,
    stationsById,
    getStationReturn,
    createStationReturn,
    getStationTypeAll,
    getStationReturnById,
    activeStationReturn,
    loading,
  };
};

import apiMainDriver from '../../api/apiMain';
import {PropsStationReturn} from './types';

export const stationReturnServices = {
  getStationReturn: async (driverId: string) => {
    const payload = {
      stdObject: [
        {
          driverId,
        },
      ],
    };
    try {
      const response = await apiMainDriver.post('Station/GetByDriver', payload);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  },

  createStationReturn: async (data: PropsStationReturn, driverId: string) => {
    const payload = {
      stdObject: [
        {
          address: data.address,
          driverId: driverId,
          latitude: data.latitude,
          longitude: data.longitude,
          name: data.name,
          null: data.null,
          stationTypeId: data.stationTypeId,
        },
      ],
    };
    try {
      const response = await apiMainDriver.post(
        'Station/InsertByDriver',
        payload,
      );
      return response.data;
    } catch (error) {
      console.log(error);
    }
  },

  updateStationReturn: async (
    data: PropsStationReturn,
    driverId: string,
    idStation: number,
  ) => {
    const payload = {
      stdObject: [
        {
          address: data.address,
          driverId: driverId,
          name: data.name,
          null: data.null,
          idStation: idStation,
          stationTypeId: data.stationTypeId,
        },
      ],
    };
    try {
      const response = await apiMainDriver.post('Station/Edit', payload);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  },

  activeStationReturn: async (idStation: string, idDriver: string) => {
    const payload = {
      stdObject: [
        {
          stationId: idStation,
          driverId: idDriver,
        },
      ],
    };
    try {
      const response = await apiMainDriver.post(
        'Driver/DefaultStation',
        payload,
      );
      return response.data;
    } catch (error) {
      console.log(error);
    }
  },

  getAllStationType: async () => {
    try {
      const response = await apiMainDriver.get('StationType/Get');
      return response.data;
    } catch (error) {
      console.log(error);
    }
  },
};

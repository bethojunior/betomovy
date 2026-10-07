import apiMain from '../../api/apiMain';
import {Position} from './types';

export const mapService = {
  // SERVICO PARA BUSCAR MOTORISTAS ONLINE POR PERTO
  getDriversOnlineByPosition: async (position: Position) => {
    try {
      const response = await apiMain.get(
        `DriverClose/Get?lat=${position?.latitude}&lng=${position?.longitude}`,
      );
      return response.data;
    } catch (error) {
      console.log(error);
      return error;
    }
  },
};

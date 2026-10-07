import apiMainDriver from '../../api/apiMain';

export const ZoneDynamicService = {
  getZonesDynamic: async (hour: string, lat: number, lng: number) => {
    try {
      const response = await apiMainDriver.get(
        `dynamicArea/findAll?lat=${lat}&lng=${lng}&timeCurrent=${hour}`,
      );
      return response.data;
    } catch (error) {
      console.log(error);
    }
  },
};

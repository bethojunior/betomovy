import apiMainDriver from '../../api/apiMain';

export const LocalServices = {
  getLocal: async (latitude: number, longitude: number) => {
    const {data} = await apiMainDriver.get(
      `geocoding/search?latlng=${latitude},${longitude}`,
    );
    return data;
  },
};

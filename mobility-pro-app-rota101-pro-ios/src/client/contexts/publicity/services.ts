import apiMain from '../../api/apiMain';

export const PublicityService = {
  get: (latitude: number, longitude: number, AppTypeConst: number | null) => {
    return apiMain(
      `advertising/get?lat=${latitude}&lng=${longitude}${
        AppTypeConst !== null ? `&appId=${AppTypeConst}` : ''
      }`,
    );
  },
};

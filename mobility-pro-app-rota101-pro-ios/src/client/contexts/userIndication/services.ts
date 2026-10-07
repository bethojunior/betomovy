import apiMain from '../../api/apiMain';

export const userIndicationService = {
  get: (page: number) => {
    return apiMain.get(`userindication/getIndicated?page=${page}`);
  },
};

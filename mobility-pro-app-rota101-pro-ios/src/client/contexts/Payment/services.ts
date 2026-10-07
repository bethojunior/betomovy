import apiMain from '../../api/apiMain';

export const servicePayment = {
  list: () => {
    return apiMain.get('/CustomerCard/Get');
  },
};

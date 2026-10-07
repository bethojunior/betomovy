import apiMain from '../../api/apiMain';

export const PasswordController = {
  forgotPasswordPro: async payload => {
    try {
      const {data} = await apiMain.post('customer/forgotpasswordpro', payload);
      return data;
    } catch (e) {
      console.log(JSON.stringify(e?.data));
      return null;
    }
  },
  changePassword: async payload => {
    try {
      const {data} = await apiMain.post('Customer/ChangePassword', payload);
      return data;
    } catch (e) {
      console.log(JSON.stringify(e?.data));
      return null;
    }
  },
};

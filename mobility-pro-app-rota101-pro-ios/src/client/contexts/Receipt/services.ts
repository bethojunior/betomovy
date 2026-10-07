import apiMain from '../../api/apiMain';

export const ReceiptService = {
  postReceipt: async (tripReference: string) => {
    const response = await apiMain.get(
      `/TripReceipt/SendCustomer?t=${tripReference}`,
    );
    return response.data;
  },
  postMessageContactUs: async (message: string, idUser: string) => {
    const response = await apiMain.post('/Customer/HelpMeEmail', {
      message,
      userId: idUser,
    });
    return response.data;
  },
  postExcludeAccount: async (details: string, reason: string) => {
    const response = await apiMain.post('/User/RemoveAccountRequest', {
      details: details,
      reason: reason,
    });
    return response.data;
  },
};
